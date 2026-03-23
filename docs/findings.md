# Findings & Architecture Notes

## Backend
- **Namngivning:** Alla filer i `/src/controllers` och `/src/services` använder `snake_case` (t.ex. `student_controller.ts`).
- **Felhantering:** `try-catch` ska endast finnas i Controllers. Services kastar fel uppåt för korrekt statuskod-mappning (404 vs 500).
- **Airtable-koppling:** Tabellen "Elev" hämtar klockslag via en Lookup-kolumn `Lektioner` från tabellen "Lektioner".
- **Airtable Record IDs:** Vid `PATCH`-operationer (t.ex. markera som genomförd) måste det faktiska Airtable Record ID:t (som börjar på `rec...`) användas. Egna fallback-ID:n (t.ex. `studentId-datum`) accepteras inte av Airtable och resulterar i `422 Unprocessable Entity`.

## Backend: Validering & Utility
- **Airtable Utility:** `airtable.ts` har nu stöd för `PATCH` via en generisk metod som tar emot `Record<string, any>` för fälten.
    - **Pagination:** `getAllRecords` har implementerats för att hämta ALL data från Airtable genom att automatiskt loopa igenom sidor via `offset`. Detta löser problemet där sökningar endast returnerade de första 100 posterna.
- **Valideringsmönster:** Vi använder `express-validator` med en inkapslad `validate`-funktion direkt i reglernas array (t.ex. `updateStudentRules`) för att hålla routen ren (DX).
- **Fältmappning (Elev):**
    - `notes` (Frontend) <-> `kommentar` (API) <-> `Kommentar` (Airtable).
    - `goals` (Frontend) <-> `terminsmal` (API) <-> `Terminsmål` (Airtable).
    - **Genomförd-status:** För att hämta status på länkade lektioner används ett **Lookup-fält** i Airtable ("Lektioner Genomförda") på `Elev`-tabellen. Detta mappas till arrayen `upcomingLessonCompleted: boolean[]` i `Student`-objektet för att möjliggöra filtrering i frontend.
- **Airtable Skriv-operationer:** Vi har utökat `airtable.ts` med en generisk `post`-metod för att kunna skapa nya poster (t.ex. vid registrering).
- **Instrument-hantering:** Backend hanterar instrument som en array av strängar (`string[]`) för frontend, men mappar om detta till en kommaseparerad sträng ("Piano, Gitarr") för Airtable. Detta möjliggör flerval utan att bryta datamodellen.
- **Säker Profiluppdatering:** `updateProfile`-controllern ignorerar `id` i URL-parametrar och använder istället strikt `req.user.id` från JWT-token. Detta förhindrar att en inloggad användare råkar (eller illvilligt) uppdatera någon annans profil.
- **Clean Controllers:** Vi använder `matchedData` från `express-validator` i controllers för att garantera att endast validerad och sanerad data hanteras. Detta minskar risken för "mass assignment"-sårbarheter och håller controllern fri från valideringslogik.
- **Asynkron Validering:** Unikhetskontroller (t.ex. att e-post inte redan finns) görs direkt i valideringslagret via custom validators (`custom(validateEmailDoesNotExist)`), vilket separerar affärsregler från request-hantering.
- **Språkstandard:** Alla valideringsmeddelanden och loggar i backend är standardiserade till engelska.

## Backend: Teacher Profile & Settings
- **Säkerhet (Read-only):** Fält som `Timlön`, `Skattesats` och `Status` (Aktiv/Slutat) kan inte uppdateras via API:et. Service-lagret (`teacher_service.ts`) använder en strikt "allow-list" och ignorerar tyst försök att ändra dessa fält.
- **Dokument-säkerhet:** `Avtal` och `Jämkning` mappas till frontend, men `Belastningsregister` filtreras bort helt i `mapAirtableToTeacher`. Detta säkerställer att känsliga dokument aldrig lämnar backend-servern.
- **Lösenords-hantering:** Vi måste explicit inkludera `password` i `mapAirtableToTeacher` för att `auth_controller` ska kunna verifiera inloggningen. Däremot tar `profile_controller` bort lösenordet från svaret innan det skickas till klienten.
- **Smart Email-validering:** Vid uppdatering (`PATCH`) tillåter validatorn att man behåller sin *egen* e-postadress, men blockerar om man försöker byta till en adress som ägs av en *annan* användare.
- **Airtable fälttyper (Datum):** Vissa datumfält (t.ex. `Terminsslut`) kan ibland returneras som en array av strängar istället för en enkel sträng från Airtable. Tjänsten hanterar nu detta säkert via t.ex. `Array.isArray(field.Terminsslut) ? field.Terminsslut[0] : field.Terminsslut` för att garantera att frontend och inloggnings-payload får rätt format.

## Backend: Notifikationssystem Arkitektur
- **Modulär design:** Notifikationssystemet bygger på en tvådelad arkitektur. `NotificationTemplates` definierar standardvärden och vilka element (text, formulär, bild) som ska visas. `Notifications` representerar individuella utskick till lärare som kan ärva eller överstyra (override) mallens data.
- **Filtreringslogik:** Eftersom Airtables formler returnerar namn istället för ID:n för Linked Records, hämtar vi alla aktiva notiser i backend och filtrerar sedan fram inloggad lärares notiser via JavaScript `includes(teacherId)` innan datan returneras.
- **Prioritering och Sortering:** För att kritiska notiser alltid ska visas överst i frontend, poängsätts fältet `Severity` via backend: `critical` (3), `warning` (2) och `info` (1). Om flera notiser har samma poäng sorteras de efter `Created At` (nyast först).

## Backend: Lektionshantering & Schemaläggning (Transaktions-metoden)
- **Designmönster:** Istället för att spara en "mall" (standardtid, dag, upplägg) på elev-objektet används en transaktionsbaserad modell där sanningen enbart ligger i tabellen `Lektioner`. Detta eliminerar behovet av datasynkronisering mellan tabeller. Om tiden ändras på en lektion, stämmer det överallt direkt.
- **Batch-operationer:** För att respektera Airtables API-gräns (max 10 rader per request) är skapande, radering och uppdatering av lektioner implementerade med en "chunking"-strategi i `lesson_service.ts`. Arrayer delas upp i grupper om 10 via loopar innan anrop görs.
- **Tidszons-hantering (UTC):** För att undvika buggar kopplade till sommartid (Daylight Saving Time) när lektioner repeteras framåt i tiden används strikt `setUTCDate` istället för `setDate` vid loopar. Detta säkerställer att lektioner alltid landar på exakt samma veckodag, oavsett om klockan ställts om lokalt.
- **Skapa Lektioner (POST):** Kontrollern beräknar automatiskt datum (+7 dagar per iteration) från `startDate` fram till ett valfritt `repeatUntil`-datum och rullar ut lektionerna i en batch. Om `repeatUntil` saknas skapas endast en enstaka lektion.
- **Justera Lektioner (PATCH):** Bulk Update-funktion som letar upp en elevs framtida lektioner (från ett givet datum) och uppdaterar dem. Kontrollern sorterar hämtade lektioner i datumordning och applicerar det nya startdatumet, tiden och upplägget successivt på de befintliga raderna.
- **Rensa Schema (DELETE):** För att radera framtida lektioner (vid uppehåll/avslut) används `axios.delete` i en batch-funktion där ID:n formateras i query-strängen (`records[]={ID}`).
- **Sökning med Linked Records:** För att hitta framtida lektioner kopplade till en specifik elev används formeln `AND(SEARCH('{studentName}', {Elev Namn} & ''), IS_AFTER({Datum}, '{fromDate}'))`. Sökning sker på *Elev Namn* (Lookup-fält i Lektioner-tabellen) snarare än Record ID, då Airtables API ibland maskerar ID:n i länkade array-fält vilket leder till att sökningar misslyckas.
- **Enskilda Lektionsåtgärder (Single Lesson Actions):** Istället för en stor generell uppdaterings-endpoint skapades specifika endpoints för varje domänhändelse (`PATCH /:id/complete`, `PATCH /:id/reschedule`, `PATCH /:id/cancel`). Detta ger:
    - Tydligare intent och renare controller-logik.
    - Strikt, åtgärdsspecifik validering (t.ex. säkerställer att `cancelledBy` endast kan vara "Läraren" eller "Vårdnadshavaren").
    - Direktuppdatering av specifikt Record ID via en dedikerad `updateSingleLesson`-funktion.

## Frontend
- **Tech Stack:** React Native (Expo 54), NativeWind, Zustand, TanStack Query.
- **Dependencies:** Använder `react-native-reanimated@4.1.1` för kompatibilitet med Expo 54/React 19.
- **Miljöhantering (.env):** Expo kräver att miljövariabler börjar med prefixet `EXPO_PUBLIC_` (t.ex. `EXPO_PUBLIC_API_URL`) för att de ska inkluderas i JavaScript-bundlen. Vi använder en central `src/config/api.ts` för att hantera API-URL:en (DRY), vilket underlättar växling mellan lokala IP-adresser och produktion. Vid ändring krävs ofta `npx expo start -c`.
- **Route-namngivning:** Expo Router kräver att startfilen i en mapp heter `index.tsx` för att agera som root-vy. Om dashboarden döps om till t.ex. `dashboard.tsx` inuti `(tabs)`-mappen uppstår ett "Unmatched Route"-fel.
- **Datumhantering:** Jämförelser sker mot `new Date().toISOString().split('T')[0]` för att undvika tidszonsförskjutningar vid midnatt.
- **Onboarding-navigering (Register -> Instruments -> Dashboard):** Navigeringen efter registrering styrs av auth-guarden i `app/_layout.tsx` via flaggan `needsOnboarding` i Zustand-store — **inte** via direkt `router.replace` i `useRegister`-hooken. Detta löser en race condition där auth-guarden (som reagerar på `isAuthenticated`-ändringen) och hook-navigeringen tävlade om att navigera användaren, vilket ledde till att Dashboard visades direkt istället för instrumentvalet. Flödet: `useRegister` sätter `needsOnboarding: true` → anropar `loginToStore` → auth-guard ser `isAuthenticated && needsOnboarding` → navigerar till `/(auth)/onboarding/instruments` → vid avslutad profilsparning sätts `needsOnboarding: false` och navigering sker till Dashboard.
- **Stale State Management (Cachning):** För att undvika onödiga API-anrop till Airtable använder vi `staleTime` (t.ex. 2 minuter) i React Query. Detta, kombinerat med `useFocusEffect` och `RefreshControl` (Pull-to-refresh), minimerar "blinkande" gränssnitt och UX-glitchar vid sidnavigering, samtidigt som appen förblir skalbar för tusentals lärare utan att bryta Airtables hastighetsbegränsningar (5 requests/sek).
- **Filtrering av genomförda lektioner:** Dashboarden filtrerar nu `allLessons` baserat på `isCompleted`-flaggan. Genomförda lektioner exkluderas från "Försenad"-listan och visas istället i "Senaste"-tabben.

## Frontend: Stabilitet & Renderingsfel
- **Unika Nycklar (Composite Keys):** För att undvika krascher i listor där data kan ha dubbletter (t.ex. vid mass-genererade lektioner), används **Composite Keys**. 
    - **Mönster:** ``key={`${lesson.student.id}-${lesson.date}-${lesson.time}-${index}`}``. Detta garanterar stabilitet även vid kantfall (Edge cases).
- **NativeWind & Navigation Context:** Ett vanligt fel (`Couldn't find a navigation context`) uppstår när NativeWind-klasser unmountas (raderas ur minnet) för snabbt under flikbyten (ternary operators). 
    - **Lösning:** Istället för `{tab === 'A' ? <A /> : <B />}` används `style={{ display: activeTab === 'A' ? 'flex' : 'none' }}`. Detta behåller komponenterna monterade men gömda, vilket eliminerar kraschen och ger snabbare flikbyten.
- **State Hydration Bug:** Om appen blir blank (endast visar laddning) beror det ofta på att `AsyncStorage` har en föråldrad `token` men saknar ett giltigt `user`-objekt (Zustand osynk). En "Emergency Reset"-logik (Tvinga utloggning) implementerades för att rensa korrupt state i simulatorer.

## Frontend: Dark Mode & Native UI
- **Native Theme Variant:** iOS-komponenter som `DateTimePicker` anpassar textfärg efter telefonens systeminställning (Dark/Light). Om appen har en hårdkodad vit bakgrund blir vit text osynlig i Dark Mode.
    - **Fix:** Använd `themeVariant="light"` direkt på `DateTimePicker` för att tvinga fram läsbar (svart) text oavsett telefonens globala inställning.
- **App-nivå:** `userInterfaceStyle: "light"` sattes i `app.json` för att låsa appen till ljust tema under MVP-fasen.

## Hantera Lektionsschema (Schedule Management UX)
- **Entry Card Pattern:** För att hålla appens bottenmeny ren och undvika kognitiv överbelastning, placerades "Hantera lektionsschema" som ett `ListHeaderComponent`-kort högst upp i Elever-listan. Detta skapar en tydlig och Apple-esque hierarki.
- **Deep Linking via Params:** Genom att använda `router.push` med objektet `params: { action: 'skapa', studentId: id }` kan användaren hoppa direkt från en Elevprofil till schemaläggaren med rätt elev förvald. Detta hanteras via `useLocalSearchParams` och `useEffect` i mål-vyn.
- **Bulk Update vs Single Update:** Tydlig separering av avsikter:
    - **Justera (Bulk):** Ändrar elevens återkommande schema för *resten av terminen*. Ett textblock har lagts till i UI:t för att minska risken för missförstånd.
    - **Boka om (Single):** Ligger kvar på individuell lektionsnivå inne på elevprofilen för att endast ändra *ett* specifikt tillfälle.
- **Skapa Lektion:** Stödjer både enstaka strö-lektioner och rullande lektioner. Vid rullande lektioner används lärarens `termEnd` (hämtas via `authStore`) för att veta hur långt fram schemat ska byggas.
- **Avsluta (Destructive Action):** Designad för att vara tydlig och oåterkallelig. Kräver att läraren bockar i en specifik bekräftelse-checkbox för att låsa upp "Ta bort"-knappen, samt visar en native iOS/Android `Alert` som en sista säkerhetsspärr innan radering.

## Empty State Dashboard
- **Villkorsstyrd Dashboard:** `app/(auth)/index.tsx` kontrollerar `students.length` efter att `useStudents` har laddat klart. Om läraren saknar elever renderas `EmptyStateDashboard` istället för den vanliga dashboarden.
- **Komponent:** `src/components/dashboard/EmptyStateDashboard.tsx` — en fristående vy med välkomsthälsning, profilstatus, hero card med CTA och tomt schema-placeholder.
- **Navigation:** CTA-knappen "Hitta elever" navigerar via `router.push("/(auth)/find-students")` till kartfliken.
- **Laddningstillstånd:** En centrerad `ActivityIndicator` visas medan studentdata hämtas, innan villkoret avgör vilken vy som renderas.

## UI & Styling Strategy
- **Källa:** Figma Design (gratisversionen).
- **System:** NativeWind (Tailwind CSS) används för all styling.
- **Glassmorphism:** Vi använder en kombination av `bg-white/70` och `border-2 border-white` för att skapa en "frosted glass"-effekt på kort. Detta gör att bakgrunds-vektorer kan anas genom komponenten för en premium-känsla.
- **Shadow Clipping Fix:** För att förhindra att skuggor klipps i kanterna (clipping) i React Native används en `shadowWrapper` (en `View` med specifika `StyleSheet`-skuggor) som omsluter `TouchableOpacity`. Inga `overflow: hidden` används på containern med skugga.
- **Konsistens:** Allt från Dashboard-kort till `ScheduleEntryCard` följer samma `rounded-[32px]` och skugg-standard för att skapa en enhetlig visuell identitet.
- **Komponenter:** PascalCase (t.ex. `NextLessonCard.tsx`) och funktionsbaserade komponenter.
- **Grid-layout:** För listvyer med få element (t.ex. 2-3 elever) används `numColumns={2}` i `FlatList` för att skapa en "galleri"-känsla istället för en gles vertikal lista.
- **Animerade komponenter:** Vi använder `LayoutAnimation` (React Native) inkapslat i en `AccordionItem`-komponent för smidiga expand/collapse-effekter (60fps) utan behov av tunga tredjepartsbibliotek.
- **Native Formulärkomponenter:** För att efterlikna Apples och Garmins nativa UI-känsla undviker vi fullskärmsmodaler för enkla val.
    - `SelectField` använder `@react-native-picker/picker` för nativa inbyggda rullhjul som expanderar "inline".
    - `TimePickerField` och `DatePickerField` använder `@react-native-community/datetimepicker` som utnyttjar iOS inbyggda "spinner" respektive "inline" kalender. För att inte bryta appens flow används transparent bakgrund (inte dimmad svart) med subtila skuggor (`shadow-lg`) för action-sheet-visningen.
- **Navigation:** Bottenmenyn (Tabs) är synlig även på detaljvyer (t.ex. Elevprofil) för att underlätta snabb navigering, till skillnad från standard "Stack"-beteende där menyn döljs.
- **Tab State Management:** För att återställa accordion-menyer och rensa temporära fält vid flikbyte (Tab-switching) används `useFocusEffect` kombinerat med en `resetKey` på huvudcontainern. Detta tvingar en "Remount" av vyn varje gång användaren återvänder till fliken, vilket ger en fräsch start.

## Avancerade UI-Animationer (Karusell)
- **Verktyg:** Efter stabilitetstester föll valet tillbaka på `react-native-reanimated-carousel` för att bygga notifikationsstacken (`NotificationStack`).
- **Strategi:** Istället för att bygga anpassade worklets eller komplexa `PanResponder`-gestures som krockade fatalt med Dashboardens nativa vertikala `ScrollView`, utnyttjar vi karusellens inbyggda `mode="parallax"`.
- **Konfiguration:**
    - Vertikal orientering kopplad till en exakt `CARD_HEIGHT`.
    - `overflow: "visible"` tillåter korten bakom (offset) att visas utanför huvudcontainern.
    - Avstängd `loop` och `overscrollEnabled={false}` ger känslan av en fysisk, begränsad kortlek utan studs ("rubber-banding").
    - Anpassning av `parallaxScrollingScale` och `parallaxScrollingOffset` ger exakt rätt överlappning enligt Figma-design.
- **Bredd-synk:** Karusellen är dynamiskt breddanpassad till `width - 40` för att linjera med övriga element inuti en `px-5`-wrapper, och varje kort har lagts till med `w-full` för att undvika ihoptryckt innehåll.
- **Fallback för enstaka element:** Karusellen kraschar animeringsmässigt om den bara har ett element. Vi implementerade en specifik "bypass" som renderar ett statiskt kort (`length === 1`) för att bevara UI-stabilitet.

## Autentisering & Säkerhet
- **Token-lagring:** JWT-tokens sparas i `expo-secure-store` (iOS Keychain / Android Keystore) och ALDRIG i AsyncStorage.
- **State Persistence:** Användarens grunddata (namn, e-post, termEnd) sparas via Zustands `persist`-middleware i `AsyncStorage` för att möjliggöra omedelbar rendering av UI vid start.
- **Routing:** Vi använder `useSegments` och `router.replace` i root-layouten för att hantera autentiserings-boarding.
- **Lösenordshantering:** Lösenord hashas med `bcrypt` i controllern *innan* de skickas till Airtable. Vi lagrar aldrig klartextlösenord.
- **Registreringsflöde:** Vid lyckad registrering genereras en JWT-token omedelbart (Auto-login) så användaren slipper logga in separat direkt efter.
- **Backend Types:** `Teacher.types.ts` har utökats med DTO:er (`CreateTeacherData`) för att strikt typa inkommande data vid registrering.

## Strategi för Elevprofil
- **Data-fetching:** Använd `useQuery` med `id` från URL:en för att hämta Student, Vårdnadshavare och Lektioner i en samlad logik.
- **Säkerhet:** Verifiera att `teacherId` i JWT matchar elevens kopplade lärare innan personuppgifter visas.
- **Komponentstruktur:**
    - `src/components/students/GuardianCard.tsx`
    - `src/components/lessons/ExpandableLessonCard.tsx`
    - `src/components/ui/TabToggle.tsx` (Återanvändbar komponent för båda toggle-nivåerna).
- **Prestanda:** Använd `FlatList` eller `FlashList` för lektionslistor då dessa kan bli långa (>50 poster).

## Elevprofil: Data-mappning
- **Senaste anteckningar:** Mappas till Airtable-fältet `Kommentar` i tabellen `Elev`.
- **Terminsmål:** Mappas till Airtable-fältet `Terminsmål` i tabellen `Elev`.
- **Spara-logik:** Använder `PATCH /api/students/:id`. Backend verifierar att `teacherId` äger eleven innan uppdatering sker.

## Navigation Architecture (Refactor)
- **Stack over Tabs:** Vi använder en "Stack over Tabs"-arkitektur för att lösa navigeringshistoriken.
    - **Struktur:** Huvudlayouten (`app/(auth)/_layout.tsx`) är en `Stack`. Inuti denna stack ligger en `Tabs`-grupp (`app/(auth)/(tabs)/_layout.tsx`).
    - **Detaljvyer:** Detaljsidor som `student/[id]` och `notification/[id]` ligger som syskon till `(tabs)` i den yttre Stacken.
    - **Transition Fix:** För att undvika att dashboarden "lyser igenom" vid slide-animationer måste detaljsidor ha en solid bakgrundsfärg (`bg-brand-bg`). Detta ger en renare övergång än att behålla transparensen hela vägen.
    - **Beteende:** När man navigerar från en lista (i en Tab) till en detaljvy, pushas detaljvyn *ovanpå* hela tabb-layouten. Detta gör att "Tillbaka"-knappen (native back eller `navigation.goBack()`) korrekt "poppar" vyn och återgår till listan, istället för att återställa till start-tabben.
    - **Expo Router Groups:** Mappen för tabbar döptes om till `(tabs)` (med parenteser) för att agera som en "Group" som inte påverkar URL-strukturen, vilket säkerställer att `index` inuti gruppen fortfarande är root (`/`).

## Maps & Geospatial Architecture
- **Backend-styrd logik:** Vi beräknar avstånd och filtrering i backend (Node.js) istället för att hämta alla elever till klienten. Detta sparar bandbredd och gör appen skalbar.
- **Airtable-egenheter (Geo):** Fält som `Ort` och `Latitude` returneras ofta som arrayer (Lookups). Vi hanterar detta genom att "platta till" dem i backend (`record.fields.Latitude?.[0]`) och använda `SEARCH()`-formler istället för strikt likhet (`=`) vid filtrering.
- **Kart-leverantör:** Vi använder plattformens standardkarta (Apple Maps på iOS, Google Maps på Android) för MVP. Detta minimerar konfiguration (API-nycklar) och ger bäst prestanda på respektive plattform.
- **Native Modules i Expo:** Installation av bibliotek som `react-native-maps` kräver en omstart av simulatorn/appen (delete app + `npx expo start --clear`) för att ladda in native-koden korrekt.
- **State Management (Karta):** All kartlogik (vilken elev som är vald, var användaren är, filter) ligger i `findStudentsStore` (Zustand). Vyn `find-students.tsx` är endast ansvarig för rendering, inte logik.
    - **Geocoding & City Search:** Vi använder `expo-location` för att konvertera stadssökningar ("Malmö") till koordinater. Store sparar `searchLocation` separat från `userLocation` för att möjliggöra filtrering på vald plats.
    - **Smart Zoom:** `fitToCoordinates` undviker maximal inzoomning vid enstaka träffar genom att använda `animateToRegion` med fast delta (0.08) för "City View".
    - **"Sök i det här området":** Implementerat en "Google Maps"-liknande knapp som dyker upp när användaren panorerar bort från den ursprungliga sökplatsen. Detta möjliggör fri utforskning utan konstanta API-anrop.
    - **Kontext-baserad Radie:** Sökning på stad tvingar en mindre radie (10-20km) för att exkludera grannstäder, medan GPS-sökning använder en större radie (30km).
- **Prestanda (Markers):** För att undvika lagg vid rendering av många markörer använder vi `tracksViewChanges={false}` på `<Marker />` och enkla `View`-komponenter istället för tunga bilder.

## Moderniserad Kartsökning ("Search in this area" - Fas 7)
- **Radieberäkning (Zoom → km):** Sökradien beräknas dynamiskt från kartans `latitudeDelta` via formeln: `Radius (km) = (latitudeDelta * 111) / 2`. Exempel: `latitudeDelta = 0.36` → `(0.36 * 111) / 2 ≈ 20 km` radie.
- **Tröskelvärden (UX Flickering Prevention):** Knappen "Sök i det här området" visas INTE vid varje liten rörelse. Två trösklar används parallellt:
    - **Avstånd:** Mittpunkten måste flyttas >500m (beräknat via förenklad Haversine med `cos(lat)` korrektion).
    - **Zoom:** `latitudeDelta` måste ändras >20% relativt `lastSearchRegion`.
- **Smart Start (Initial Position):** Vid mount körs GPS-hämtning. Succé → center med `latitudeDelta: 0.36` (~20km diameter). Fallback → Stockholm (59.3293, 18.0686). Båda triggar automatisk `fetchStudents`.
- **Store-arkitektur:** `searchQuery`, `setSearchQuery` och geocoding-logik har tagits bort. Ersatt med `mapRegion` (aktuell kartposition), `lastSearchRegion` (senaste sökpositionen) och `showSearchButton` (boolean). `searchInArea` action beräknar radie och anropar API.
- **Namngivning:** Följer `PascalCase` för komponenter och `camelCase` för store-actions/state, i enlighet med projektstandard.

## Filter & Sök (Karta Fas 2)
- **Debounce-strategi:** Sökfältet (text) använder en 1000ms debounce via `setTimeout` i Zustand-storen för att förhindra överflödiga API-anrop, och tillåter geocoding att hinna klart. Filter-chips triggar omedelbar refetch.
- **Modul-level timer:** Debounce-timern (`debounceTimer`) lever utanför Zustand-storen som en modul-variabel. Detta undviker att timern nollställs vid varje state-uppdatering och fungerar korrekt med Zustandss `set/get`-mönster.
- **Safe Area Overlay:** `FilterBar` använder `useSafeAreaInsets` från `react-native-safe-area-context` och positioneras absolut med `top: insets.top + 4` för att respektera notch/dynamic island på alla enheter.
- **Backend-koppling (city):** Vi skickar inte längre `city`-strängen till backend. Istället geocodar vi staden i frontend och skickar de nya koordinaterna. Detta ger en renare geografisk sökning.

## Lista & Interaktion (Karta Fas 3 & 4)
- **High Fidelity Google Maps UX:** Vi bytte från en enkel lista till en fullfjädrad `@gorhom/bottom-sheet` implementation.
- **Interaktionsflöde:**
    1.  **Startläge:** Kartan visar alla elever och listan ligger som en "Sheet" (Snap point 15% och 45%).
    2.  **Val av elev (Lista):** Klick i listan → Centrerar kartan (med offset) och öppnar Detalj-sheetet.
    3.  **Val av elev (Markör):** Klick på markör → Centrerar kartan (med offset) och öppnar Detalj-sheetet direkt (ingen modal).
- **Snap Points & Scroll:**
    - **Lista:** 15% (Peek), 45% (Halv), Dynamisk Topp (ScreenHeight - SafeArea - 70px).
    - **Detaljvy:** 25% (Peek - visar namn/betyg), 90% (Full - visar hela profilen).
- **Camera Offset:** För att markören inte ska gömmas bakom sheetet när man klickar på den, förskjuter vi kartans kamera "söderut" (`latitude - delta * 0.15`), vilket visuellt placerar markören i det lediga utrymmet ovanför sheetet.
- **Design:** Listan följer Google Maps "Tile"-design: Vit bakgrund, ingen border, subtil grå separator (`mb-1.5`), och ren typografi utan onödiga ikoner.

## Karta Fas 6: Ansökningsflöde (Request to Teach)
- **Semantik:** Valde namngivningen `request-to-teach` (snarare än `apply`) för att matcha Airtables `Önskar`-fält och tydliggöra att det handlar om en "Connection request" till en specifik elev, inte en jobbansökan i allmänhet.
- **Hantering av Airtable Arrays (Linked Records):** Eftersom fältet `Önskar` kan innehålla ID:n från flera olika lärare, gjordes backend robust genom att *först* hämta den befintliga arrayen, pusha in det nya ID:t (`[...current, newId]`), och sedan utföra en `PATCH`. En direkt uppdatering utan att hämta först hade skrivit över tidigare lärares ansökningar. Formatering av meddelanden i `ÖnskaKommentar` sparades med dynamisk `[YYYY-MM-DD]` timestamp.
- **Duplicate Prevention:** Backend utvärberar direkt om en lärare redan finns i `Önskar`-arrayen. Om så är fallet avbryts requesten och kastar en exakt `400 Bad Request` med ett tydligt felmeddelande för att förhindra spam/dubbletter i databasen.
- **Frontend Error Handling:** Vi nyttjar att Axios per automatik kastar fel för 4xx/5xx-koder. TanStack Querys `onError`-block snappar upp detta och presenterar backendens felmeddelande i en native `Alert`, vilket hindrar appen från att krascha vid dubbla klick.
- **Premium UX (hasApplied-flagga):** För att förhindra att läraren ens försöker ansöka på nytt, extraheras inloggad `teacherId` från JWT-token och skickas med i kartans `GET /search`-anrop. Backend returnerar då `hasApplied: true` ifall läraren redan ansökt om eleven. Detta genererar ett omedelbart state i modulen där knappen gråas ut och textfältet inaktiveras med texten "ANSÖKAN SKICKAD".
- **Cache Invalidation:** Vid lyckad ansökan via `useMutation` invalideras automatiskt `["search-students"]`-cachen. Detta triggar en tyst uppdatering i bakgrunden så att modulen direkt går in i `hasApplied`-läget utan att användaren behöver stänga/öppna den.

## Push-notifikationer & Webhook Arkitektur
- **Tre-parts system:** För att skicka push-notiser från Airtable till en specifik enhet krävs en kedja bestående av tre delar: Frontend (Hämta & Skicka Token), Backend (Lagring & Webhook), och Airtable (Triggers & Action).
- **Frontend (Expo EAS):** Integration med `expo-notifications` kräver ett officiellt `projectId` i `app.json` genererat via `eas-cli`. Tokens kan enbart genereras på fysiska enheter, ej simulatorer. Token genereras on-login och skickas tyst till backend via `POST /api/profile/push-token`.
- **Backend (Webhook & Säkerhet):** Vi introducerade `POST /api/notifications/push-webhook`. Ett avgörande säkerhetsbeslut här var att **inte** använda `validateAccessToken` (JWT) för denna route. Airtable kan inte generera våra JWTs, så webhooken skyddas istället av en `x-webhook-secret` header satt via `.env`. Själva push-logiken hanteras av biblioteket `expo-server-sdk` som formaterar och skickar till Apple/Google.
- **Airtable (Automation):** Vi byggde en Automation som lyssnar på tabellen `Notifications`. När en record matchar villkoret `Status is active` körs ett anpassat JavaScript (`Run a script`). Koden extraherar lärarens `teacherId` (Kritiskt: detta måste extraheras som *Record ID*, ej namn, för att backend ska kunna slå upp användaren) och skickar en HTTP POST-request direkt till backend.
- **Utveckling vs Produktion:** För att Airtables servrar ska kunna nå vår lokala Node-miljö under utveckling använde vi en tillfällig tunnel (`npx localtunnel`). Ett vanligt problem med locatunnel är 408 Timeouts orsakade av deras "Anti-phishing"-skärm. Detta löstes genom att injicera headern `"Bypass-Tunnel-Reminder": "true"` i Airtable-scriptet. Vid övergång till produktionsserver (t.ex. Render eller Railway) uppdateras webhook-URL:en i Airtable en sista gång till den permanenta domänen, varefter systemet blir 100% underhållsfritt.
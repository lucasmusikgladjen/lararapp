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
- **Airtable Skriv-operationer:** Vi har utökat `airtable.ts` med en generisk `post`-metod för att kunna skapa nya poster (t.ex. vid registrering).
- **Instrument-hantering:** Backend hanterar instrument som en array av strängar (`string[]`) för frontend, men mappar om detta till en kommaseparerad sträng ("Piano, Gitarr") för Airtable i databasen. Vid uppdatering (`PATCH`) konverteras inkommande textsträngar via `.split(',').map(i => i.trim())`.
- **Säker Profiluppdatering:** `updateProfile`-controllern ignorerar `id` i URL-parametrar och använder istället strikt `req.user.id` från JWT-token.
- **Clean Controllers:** Vi använder `matchedData` från `express-validator` i controllers för att garantera att endast validerad och sanerad data hanteras.
- **Asynkron Validering:** Unikhetskontroller görs direkt i valideringslagret via custom validators.

## Backend: Geospatial Sökning & DTO
- **Anonymiserad DTO:** `StudentPublicDTO` har utökats för att stödja anonymiserad visning på kartan.
    - **Födelseår:** Inkluderas för att frontend ska kunna beräkna ålder utan att exponera födelsedata.
    - **NummerID:** Vi mappar Airtables interna Auto-number (`NummerID`) till DTO:n för att ge varje elev en unik publik referens (t.ex. "Elev #479") då namn och avatar döljs för oinloggade/ej matchade lärare.
- **Filtrering:** Sökradie beräknas i backend via Haversine-formeln. Backend returnerar endast elever som matchar lärarens valda instrument och geografiska område.

## Backend: Teacher Profile & Settings
- **Säkerhet (Read-only):** Fält som `Timlön`, `Skattesats` och `Status` (Aktiv/Slutat) kan inte uppdateras via API:et. Service-lagret (`teacher_service.ts`) använder en strikt "allow-list" och ignorerar tyst försök att ändra dessa fält.
- **Personnummer:** Fältet har låsts upp i både backend (validering + service) och frontend för att lärare ska kunna komplettera sina uppgifter. Det mappar till kolumnen `Personnummer` i Airtable.
- **Dokument-säkerhet:** `Avtal`, `Jämkning` och `Belastningsregister` mappas till frontend. Tidigare filtrerades belastningsregistret bort, men det har nu låsts upp för att lärare ska kunna verifiera sin status.
- **Dokumentradering (Clear Logic):** Implementerat `clearDocument` i `UpdateTeacherData`. Genom att skicka en tom array `[]` till Airtables attachment-fält kan vi nu radera dokument (Avtal, Jämkning etc.) direkt från appen med en Confirm-pattern.
- **Lösenords-hantering:** Vi måste explicit inkludera `password` i `mapAirtableToTeacher` för att `auth_controller` ska kunna verifiera inloggningen. Däremot tar `profile_controller` bort lösenordet från svaret innan det skickas till klienten.
- **Smart Email-validering:** Vid uppdatering (`PATCH`) tillåter validatorn att man behåller sin *egen* e-postadress, men blockerar om man försöker byta till en adress och ägs av en *annan* användare.
- **Airtable fälttyper (Datum/Länkar):** Vissa fält (t.ex. `Terminsslut` eller `Önskar`) kan returneras som arrayer från Airtable. Tjänsten hanterar nu detta genom att mappa länkade Record IDs (från fältet `Önskar`) till `pendingStudentIds` för att möjliggöra statistik i frontend.

## Backend: Autentisering & Lösenordsåterställning
- **Ny Endpoint:** `POST /reset-password` implementerad i `auth_controller.ts`.
- **Säkerhetslogik:** - Verifierar användarens e-post mot en manuellt satt `Återställningskod` i Airtable.
    - Vid matchning hashas det nya lösenordet med `bcrypt`.
    - `Återställningskod` töms automatiskt efter lyckad återställning för att förhindra återanvändning.
- **Fältmappning:** `Återställningskod` (Airtable) <-> `resetCode` (Backend/Frontend).

## Backend: Notifikationssystem Arkitektur
- **Modulär design:** Notifikationssystemet bygger på en tvådelad arkitektur. `NotificationTemplates` definierar standardvärden medan `Notifications` representerar individuella utskick som kan ärva eller överstyra mallens data.
- **Filtreringslogik:** Notiser filtreras i backend via JavaScript `includes(teacherId)` för att hantera Airtables begränsningar gällande länkade poster i API-formler.
- **Prioritering och Sortering:** Fältet `Severity` poängsätts i backend: `critical` (3), `warning` (2) och `info` (1) för att styra sorteringsordningen i frontend.

## Backend: Lektionshantering & Schemaläggning (Transaktions-metoden)
- **Designmönster:** En transaktionsbaserad modell används där sanningen enbart ligger i tabellen `Lektioner`, vilket eliminerar behovet av datasynkronisering mellan tabeller.
- **Batch-operationer:** För att respektera Airtables API-gräns (max 10 rader per request) används en "chunking"-strategi i `lesson_service.ts` där anrop delas upp i grupper om 10.
- **Tidszons-hantering (UTC):** För att undvika buggar vid sommartid/vintertid används strikt `setUTCDate` vid loopar för återkommande lektioner.
- **Sökning med Linked Records:** Sökning sker på textfältet `Elev Namn` istället för Record ID för att undvika problem med maskerade ID:n i Airtables API.
- **Enskilda Lektionsåtgärder:** Specifika endpoints (`PATCH /:id/complete`, `PATCH /:id/reschedule`, `PATCH /:id/cancel`) används för att ge tydligare intent.
- **Historikbevarande (Ansökningar):** Vid inskick av ny elevansökan via `requestToTeachStudent` bevaras historik i Airtable-kolumnen `Egen anteckning` genom att den nya texten läggs till sist med en tydlig header: `--- Elevansökan: [Namn] ([Datum]) ---`.

## Backend: Airtable Array Collapse & "The Payload Trick"
- **Problemet:** Airtable raderar tomma värden i Lookup-arrayer (t.ex. om en lektion saknar läxa). Detta förstör index-baserad mappning av länkade records, vilket resulterar i att fel data visas på fel plats i frontend.
- **Lösningen ("The Payload Trick"):** Istället för separata Lookups skapades ett formelfält i Airtable (`API_Payload`) som slår ihop lektionens ID, status och text till en säker sträng separerad med `|||`.
- **Fördel:** Frontend och Backend kan nu packa upp datan säkert via ett Map-objekt (kopplat till Record ID). Detta löser både synk-problemet och förhindrar dyra N+1 anrop, eftersom all lektionsdata följer med direkt i `/students`-anropet.

## Backend: Filhantering & Bilagor (Airtable Bridge)
- **Airtable URL Bridge:** Eftersom Airtables API inte tar emot binär fildata direkt, används en "bro-arkitektur". Backend tar emot en offentlig URL (från Firebase) och skickar den som ett attachment-objekt: `[{ url: "https://..." }]`. Airtable hämtar sedan filen asynkront från länken och sparar den internt.
- **Utökad Validering:** `updateProfileRules` i `teacher_validation.ts` har utökats med strikt URL-validering (`isURL()`) för fälten `profileImageUrl`, `contractUrl`, `taxAdjustmentUrl` och `criminalRecordUrl`.
- **Sanering med MatchedData:** Controllern använder uteslutande `matchedData(req)` för att säkerställa att endast validerade URL-strängar skickas vidare till databasen, vilket förhindrar att oönskad data injiceras i `PATCH`-anropet.

## Frontend
- **Tech Stack:** React Native (Expo 54), NativeWind, Zustand, TanStack Query.
- **Dependencies:** Använder `react-native-reanimated@4.1.1` för kompatibilitet med Expo 54.
- **Miljöhantering (.env):** Prefixet `EXPO_PUBLIC_` krävs för att variabler ska inkluderas i bundlen. Central API-konfiguration hanteras i `src/config/api.ts`.
- **Route-namngivning:** Expo Router kräver att startfilen i en mapp heter `index.tsx`.
- **Onboarding-navigering:** Styrs av flaggan `needsOnboarding` i Zustand-store för att undvika race conditions mellan auth-guarden och hooks.
- **Stale State Management (Cachning):** Använder `staleTime` (t.ex. 2 minuter) i React Query kombinerat med `useFocusEffect` för att minimera onödiga refetches.
- **Filtrering av genomförda lektioner:** Dashboarden filtrerar `allLessons` baserat på `isCompleted`-flaggan.

## Frontend: UI-estetik & "Musikglädjen"-Retro
- **70-tals Signature Style:** Appen använder en kurerad retro-palett: **Mustard Gold** (#F59E0B), **Terracotta/Rust** (#B45309) och **Muted Teal** (#0D9488) mot en krämvit bas (#FFFBEB).
- **SVG Bakgrunder:** Vi använder komplexa `react-native-svg`-komponenter (`MainBackground`, `SettingsBackground`) för att skapa mjuka kurvor ("The S-Groove", "The Vinyl Radar") som ger appen en unik analog känsla.
- **Lager-konflikter (Z-index):** För att SVG-bakgrunder ska synas måste överliggande containers (som `SafeAreaView` eller `ScrollView`) ha genomskinliga bakgrunder. Att inkludera `bg-brand-bg` eller liknande klasser på dessa blockerar bakgrunds-lagret helt.
- **Typografi & Professionalism:** Vi undviker UPPERCASE på frågor och instruktionstexter för att bibehålla en premium känsla. Placeholders har förenklats från exempel ("T.ex...") till direkta instruktioner ("Skriv din motivering här...").
- **iOS-liknande Notifikationstack:** `NotificationStack.tsx` använder `react-native-reanimated-carousel` med en `customAnimation` som morphar korten från en ihoptryckt stack (Y-offset, scaling) till en rak vertikal lista vid expansion. Detta bevarar scroll-funktionalitet i stängt läge samtidigt som det ger en "buttersmooth" iPhone-känsla och spatial kontinuitet vid utfällning.

## Frontend: Modulär Design (Hub-konceptet)
- **Enhetligt Hub-system:** Både elevprofilen och lärarprofilen (Inställningar) har omstrukturerats till modulära "hubbar" med micro-sidor.
- **Hero Card Navigering:** Toppen av dessa sidor innehåller ett Hero-kort med profilbild och färgkodade navigerings-tags (piller). För läraren inkluderar detta även en biografisk sammanfattning direkt i huvudvyn.
- **Standardiserade Lektionskort:** `ScheduleCard` har implementerats som den gemensamma standarden. Den använder en modern asymmetrisk layout där den primära åtgärden (Genomförd) tar störst plats.
- **Dokumentgruppering:** Dokument visas i logiska grupper (Avtal, Jämkning, Belastningsregister) med tillhörande uppladdnings-placeholders (dashed borders) om filen saknas.

## Frontend: UX-principer & "Lösenordsåterställning"
- **Apple-Style FormSheet:** Modalen för återställning använder `presentationStyle="formSheet"` (iOS) för en naturlig känsla.
- **Sticky Bottom Action:** Använder `flex-1` mellan sista input-fältet och knappen för att trycka ner bekräftelseknappen till botten av modalen. Detta skapar en tydlig visuell ram och förbättrar åtkomligheten.
- **Header Design:** Implementerat en rubrik med ett tydligt cirkulärt stäng-kryss (Ionicons `close`), vilket eliminerar behovet av textbaserade "Avbryt"-knappar.

## Frontend: UX-principer & "iPhone-First" Form-logic
- **Eliminering av Placeholders:** I moderna mobila flöden skippar vi "-- Välj --" eller tomma states. 
    - **Auto-select:** `SelectField` förväljer automatiskt första tillgängliga alternativ så fort data laddats via en `useEffect`.
    - **Initial Time:** `TimePickerField` öppnas med enhetens exakta nuvarande tid som standard istället för en statisk placeholder.
- **iOS Spinner-fix (The Confirmation Pattern):** Eftersom iOS-pickers inte alltid triggar `onChange` om användaren inte snurrar på hjulet, använder vi ett `tempDate`-state i modalen. När användaren trycker på "Klar" sparas det temporära värdet.
- **Inline Accordion UX:** För enkla val föredras en inline-accordion (expand/collapse) framför Bottom Sheets för att minimera antalet animationer och behålla användarens fokus.
- **Textbaserad Instrumenthantering:** Istället för komplexa multi-select grids hanteras instrument nu som ett vanligt `InputGroup`-textfält i `PersonalSection`. Användaren skriver instrument separerade med komma, vilket sedan mappas om till en array i `handleSave`. Detta förenklar både UI och state-hantering.
- **Hjälp & Information:** `PageHeader` innehåller en interaktiv hjälpsymbol (`help-circle`) som öppnar en Modal. Denna modal använder företagets logotyp (`musikgladjen.png`), `text-justify` för biografi och klickbara kontaktlänkar via `Linking`-API:et för webb, e-post och telefon.
- **Dokumenthantering (CRUD):** Implementerat radering av dokument med en dedikerad röd soptunne-knapp (`w-[68px]` kvadrat). Använder native `Alert` för bekräftelse innan API-anropet triggas.

## Frontend: Firebase Storage & Media Integration
- **Storage Integration:** Implementerat `firebase/storage` via en central konfigurationsfil `firebase.ts`. Miljövariabler (`EXPO_PUBLIC_`) används för att dölja känsliga API-nycklar i källkoden.
- **Binary Conversion (Blobs):** På grund av begränsningar i mobilmiljöer konverterar `uploadService.ts` lokala fil-URI:er till binära `Blobs` via `fetch` API:et innan de laddas upp till Firebase.
- **Unik Filnamnsstrategi:** Filer sparas i logiska mappar (`avatars/`, `documents/`) med unika filnamn baserade på `userId` och `Date.now()`. Detta eliminerar risken för namnskonflikter och tvingar Airtable att uppdatera bilagan när en ny fil laddas upp (cache-busting).
- **Media Pickers:** - `expo-image-picker` används för profilbilder med tvingad redigering (`allowsEditing: true`) och 1:1 aspekt-ratio.
    - `expo-document-picker` används för att hantera PDF-filer och övriga dokumenttyper i `DocumentsSection`.

## Frontend: Stabilitet & Renderingsfel
- **Unika Nycklar (Composite Keys):** För att undvika krascher i listor används Composite Keys (t.ex. ``key={`${studentId}-${date}-${time}-${index}`}``).
- **NativeWind & Navigation Context:** För att undvika kraschen `Couldn't find a navigation context` vid flikbyten, används `style={{ display: activeView === 'x' ? 'flex' : 'none' }}` istället för villkorsstyrd rendering (`&&`). Detta behåller komponenterna monterade men gömda.
- **Hybrid Styling-strategi:** Dynamiska ändringar av Tailwind-klasser i `className` kan få NativeWind att tappa bort navigations-trädet. 
    - **Lösning:** Håll `className` statisk för grundlayouten. Använd React Natives inbyggda `style`-prop med HEX-koder för dynamiska visuella ändringar (t.ex. bakgrundsfärg på en aktiv tag).
- **Emergency Reset (Nödbroms):** Vi har identifierat att `AsyncStorage` kan hamna i osynk med Zustand-storen (token finns men user-objektet saknas). En nödutloggnings-knapp ("Tvinga utloggning") har implementerats på både **Dashboard** och **Inställningssidan** för att möjliggöra för användare att rensa korrupt state och logga in på nytt.
- **Zustand Type Fix:** För att hantera fält som transformeras under redigering (t.ex. `instruments` som går från `string[]` till `string`) används explicit typ-casting i `useState`: `(user?.instruments || []) as string[] | string`.
- **Synkroniserings-delay (Airtable Sync):** Eftersom Airtables Lookup-fält i bakgrunden kan ta upp till 1 sekund på sig att räkna om, har en `setTimeout` på 1000ms lagts till i alla lektionsmutations (complete, reschedule, cancel) innan `refetchStudents()` anropas. Detta säkerställer att UI:t visar korrekt data direkt efter en handling.
- **Logik för Inställda Lektioner:** `lessonHelpers.ts` filtrerar nu bort lektioner där `isCancelled` är sant. Denna data hämtas från en dedikerad Lookup-kolumn `Lektioner Inställda` i Airtable för att garantera att "soft-deleted" lektioner inte syns i schemat.

## Frontend: Dark Mode & Native UI
- **Native Theme Variant:** iOS-komponenter (såsom `DateTimePicker`) tvingas använda `themeVariant="light"` och explicit `textColor="#0f172a"`. Detta förhindrar vit-text-på-vit-bakgrund problematik när telefonen är i systemomfattande Dark Mode.
- **Global Bakgrund:** `RootLayout` (`_layout.tsx`) har tvingats till `backgroundColor: "#ffffff"` i den yttersta containern (`GestureHandlerRootView`). Detta åtgärdar felet där användare såg en svart skärm med orange laddningshjul vid uppstart om Dark Mode var aktiverat.
- **App-nivå:** Appen är låst till `light` tema i `app.json`.

## Frontend: Moderniserad Kartsökning (Google Maps Style)
- **Radieberäkning:** Sökradien beräknas dynamiskt från kartans zoomnivå via formeln: `Radius (km) = (latitudeDelta * 111) / 2`.
- **Tröskelvärden:** För att undvika flimmer (flickering) visas "Sök i området"-knappen endast om kartan flyttats >500m eller om zoomnivån ändrats >20%.
- **Smart Start:** Appen försöker hämta GPS vid start för att centrera kartan (20km radie), med Stockholm som fallback.
- **Instrument-specifika Markörer:** Kartmarkörer använder en hybrid-lösning av `MaterialCommunityIcons` och `FontAwesome5` (t.ex. `drum` för trummor) för att visuellt representera elevens instrument direkt på kartan via en färgkodad ikonografi.

## Frontend: StudentDetailModal (Fas 8 - High Fidelity Refactor)
- **Visuell Konsistens:** `MainBackground` används som `backgroundComponent` i `BottomSheet` med `overflow: "hidden"` för att klippa mönstret efter modalens rundade hörn.
- **Anonymisering & Integritet:** Elevens namn och profilbild har tagits bort från kartsökningen för att skydda integriteten. Eleven identifieras via en rubrik med sitt NummerID (t.ex. **"Elev #{NummerID}"**).
- **Information Grid:** "Om eleven"-sektionen använder en 2-kolumns layout för Instrument och Ålder.
- **Utökat Formulär:** Ersatt den tidigare textrutan med fyra specifika fält: Erfarenhet, Tillgänglighet, Föreslaget pris och Övrig information.
- **UX Trygghet:** En numrerad steg-för-steg sektion förklarar matchningsprocessen för att minska osäkerhet.
- **Textbalans:** Använder `flex-1` och generös höger-padding (`pr-6`) på text-element för att förhindra att text nuddar skärmkanten.

## Hantera Lektionsschema (Schedule Management UX)
- **Entry Card Pattern:** Placerat som en `ListHeaderComponent` i elevlistan för en ren Apple-esque hierarki.
- **Deep Linking:** Använder och skickar URL-parametrar för att förifylla elevdata i schemaläggaren.
- **Säkerhetsspärrar:** Destruktiva handlingar kräver både en bekräftelse-checkbox och en native `Alert`.

## UI & Styling Strategy
- **Standard Card Design:** Alla huvudkomponenter (ScheduleCard, StudentCard, SettingsSections) använder nu en enhetlig profil: `bg-white rounded-3xl p-5 border border-slate-100 shadow-sm`.
- **Typografi & Luft:** För att undvika "cramped" UI används `leading-tight` och naturliga radbrytningar. Använder `{"\n"}` i JSX för att styra radbrytningar i instruktionstexter manuellt (t.ex. i Tips-boxar). 
- **Statistik-hantering:** Räknare för "Nuvarande" och "Pågående" elever i inställningsvyn hämtas dynamiskt via `user.studentIds.length` och `user.pendingStudentIds.length`.
- **Affordance & Interaktivitet:** Högerpilar (chevrons) visas endast på element med aktiva åtgärder. Ikoner har ofta en mjuk rund bakgrundsfärg (t.ex. `bg-orange-100`) för att signalera kategori.
- **UX-optimering i formulär:** I åtgärdsformulär (t.ex. `CancelLessonSheet`) placeras det mest sannolika standardvalet (t.ex. "Vårdnadshavaren") till vänster och sätts som förvalt värde.
- **Animerade komponenter:** `LayoutAnimation` används för smidiga expand/collapse-effekter.
- **Native Layouts:** Använder `@react-native-picker/picker` och native datumväljare för att efterlikna systemets inbyggda känsla.

## Infrastruktur: Molnbaserad Lagring
- **Regional Policy:** Firebase Storage är konfigurerat i regionen **EU** (Multi-regional) för att minimera latens och efterleva GDPR-principer gällande personuppgifter (profilbilder).
- **Säkerhetsregler (Security Rules):** Reglerna i Firebase Storage är inställda på `allow read, write: if true`. Detta krävs för att Airtables servrar ska kunna läsa filerna när de synkroniseras via URL-bryggan.

## Airtable: Dataintegritet & Filtering
- **Lookup Filtering:** För att förhindra att inställda lektioner "spökar" i appens UI har filter lagts på Lookup-fälten i tabellen **Elev**. Filter-villkoret är `Where Inställd is empty`. Detta gäller fälten `Bokade lektioner`, `Lektionstider`, `Lektioner` och `Lektioner Genomförda`.
- **Säkerhet vid beroenden:** Genom att filtrera i Lookup-ledet säkerställer vi att även fält som `Sista bokade lektion` (på Vårdnadshavare) förblir korrekta och endast räknar med faktiska, aktiva lektionstillfällen.

## Push-notifikationer & Webhook Arkitektur
- **Tre-parts system:** Kedja mellan Frontend (Token-hämtning), Backend (Lagring/Webhook) och Airtable (Automation).
- **Säkerhet:** Webhook-routen (`/push-webhook`) skyddas av en statisk `x-webhook-secret` header istället för JWT, då anropet kommer direkt från Airtables servrar.
- **Airtable Automation:** Trigger vid `Status is active`. Scriptet skickar lärarens **Record ID** för att säkerställa korrekt användar-lookup i backend.
- **Utveckling:** Använder `localtunnel` med headern `"Bypass-Tunnel-Reminder": "true"` för att möjliggöra kommunikation under lokal utveckling.
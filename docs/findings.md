# Findings & Architecture Notes

## Backend
- **Namngivning:** Alla filer i `/src/controllers` och `/src/services` använder `snake_case` (t.ex. `student_controller.ts`).
- **Felhantering:** `try-catch` ska endast finnas i Controllers. Services kastar fel uppåt för korrekt statuskod-mappning (404 vs 500).
- **Airtable-koppling:** Tabellen "Elev" hämtar klockslag via en Lookup-kolumn `Lektionstider` från tabellen "Lektioner".

## Backend: Validering & Utility
- **Airtable Utility:** `airtable.ts` har nu stöd för `PATCH` via en generisk metod som tar emot `Record<string, any>` för fälten.
    - **Pagination:** `getAllRecords` har implementerats för att hämta ALL data från Airtable genom att automatiskt loopa igenom sidor via `offset`. Detta löser problemet där sökningar endast returnerade de första 100 posterna.
- **Valideringsmönster:** Vi använder `express-validator` med en inkapslad `validate`-funktion direkt i reglernas array (t.ex. `updateStudentRules`) för att hålla routen ren (DX).
- **Fältmappning (Elev):**
    - `notes` (Frontend) <-> `kommentar` (API) <-> `Kommentar` (Airtable).
    - `goals` (Frontend) <-> `terminsmal` (API) <-> `Terminsmål` (Airtable).
    - **Data-plattning (Lookup):** För att minimera antalet API-anrop använder vi "Lookup"-fält i Airtable (t.ex. `Vårdnadshavare Namn` direkt på `Elev`-tabellen) istället för att göra separata `GET`-anrop till relaterade tabeller.
- **Airtable Skriv-operationer:** Vi har utökat `airtable.ts` med en generisk `post`-metod för att kunna skapa nya poster (t.ex. vid registrering).
- **Instrument-hantering:** Backend hanterar instrument som en array av strängar (`string[]`) för frontend, men mappar om detta till en kommaseparerad sträng ("Piano, Gitarr") för Airtable. Detta möjliggör flerval utan att bryta datamodellen.
- **Säker Profiluppdatering:** `updateProfile`-controllern ignorerar `id` i URL-parametrar och använder istället strikt `req.user.id` från JWT-token. Detta förhindrar att en inloggad användare råkar (eller illvilligt) uppdatera någon annans profil.

- **Clean Controllers:** Vi använder `matchedData` från `express-validator` i controllers för att garantera att endast validerad och sanerad data hanteras. Detta minskar risken för "mass assignment"-sårbarheter och håller controllern fri från valideringslogik.

- **Asynkron Validering:** Unikhetskontroller (t.ex. att e-post inte redan finns) görs direkt i valideringslagret via custom validators (`custom(validateEmailDoesNotExist)`), vilket separerar affärsregler från request-hantering.

- **Språkstandard:** Alla valideringsmeddelanden och loggar i backend är standardiserade till engelska.

## Frontend
- **Tech Stack:** React Native (Expo 54), NativeWind, Zustand, TanStack Query.
- **Dependencies:** Använder `react-native-reanimated@4.1.1` för kompatibilitet med Expo 54/React 19.
- **Datumhantering:** Jämförelser sker mot `new Date().toISOString().split('T')[0]` för att undvika tidszonsförskjutningar vid midnatt.
- **Onboarding-navigering (Register -> Instruments -> Dashboard):** Navigeringen efter registrering styrs av auth-guarden i `app/_layout.tsx` via flaggan `needsOnboarding` i Zustand-store — **inte** via direkt `router.replace` i `useRegister`-hooken. Detta löser en race condition där auth-guarden (som reagerar på `isAuthenticated`-ändringen) och hook-navigeringen tävlade om att navigera användaren, vilket ledde till att Dashboard visades direkt istället för instrumentvalet. Flödet: `useRegister` sätter `needsOnboarding: true` → anropar `loginToStore` → auth-guard ser `isAuthenticated && needsOnboarding` → navigerar till `/(auth)/onboarding/instruments` → vid avslutad profilsparning sätts `needsOnboarding: false` och navigering sker till Dashboard.

## Empty State Dashboard
- **Villkorsstyrd Dashboard:** `app/(auth)/index.tsx` kontrollerar `students.length` efter att `useStudents` har laddat klart. Om läraren saknar elever renderas `EmptyStateDashboard` istället för den vanliga dashboarden.
- **Komponent:** `src/components/dashboard/EmptyStateDashboard.tsx` — en fristående vy med välkomsthälsning, profilstatus, hero card med CTA och tomt schema-placeholder.
- **Navigation:** CTA-knappen "Hitta elever" navigerar via `router.push("/(auth)/find-students")` till kartfliken.
- **Laddningstillstånd:** En centrerad `ActivityIndicator` visas medan studentdata hämtas, innan villkoret avgör vilken vy som renderas.

## UI & Styling Strategy
- **Källa:** Figma Design (gratisversionen).
- **Metod:** Visuell uppskattning och manuell kontroll av värden (färgkoder, avstånd, hörnradie) i Design-tabben då Dev Mode ej används.
- **System:** NativeWind (Tailwind CSS) används för all styling.
- **Konsistens:** När stylingen är satt för Dashboard, låser vi den i `docs/style_guide.md` för att säkerställa visuell identitet i framtida vyer.
- **Komponenter:** PascalCase (t.ex. `NextLessonCard.tsx`) och funktionsbaserade komponenter.
- **Navigation:** Bottenmenyn (Tabs) är synlig även på detaljvyer (t.ex. Elevprofil) för att underlätta snabb navigering, till skillnad från standard "Stack"-beteende där menyn döljs.
- **Globala Komponenter:** `PageHeader.tsx` i `/src/components/ui` ersatte `DashboardHeader`. Den används som en enhetlig rubrikmodul för alla huvudflikar (Dashboard, Elever, Inställningar) och tar emot en `title`-prop för att vara dynamisk men bibehålla visuell konsistens.

## Autentisering & Säkerhet
- **Token-lagring:** JWT-tokens sparas i `expo-secure-store` (iOS Keychain / Android Keystore) och ALDRIG i AsyncStorage.
- **State Persistence:** Användarens grunddata (namn, e-post) sparas via Zustands `persist`-middleware i `AsyncStorage` för att möjliggöra omedelbar rendering av UI vid start.
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
    - **Detaljvyer:** Detaljsidor som `student/[id]` ligger som syskon till `(tabs)` i den yttre Stacken.
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
# Progress Tracker

## Genomfört ✅
- [x] Backend-filtrering (Lärare ser egna elever).
- [x] Airtable Lookup för lektionstider.
- [x] Pixel Perfect Dashboard UI med `style_guide.md`.
- [x] Hantering av versionskonflikter och installation av `@react-native-async-storage/async-storage`.
- [x] Stabilisering av inloggningsflöde (Hydration/Auth persistence).
- [x] Backend-stöd för uppdatering av elevprofil (Notes/Goals) med validering.
- [x] Robust felhantering och typning i Airtable-tjänsten.
- [x] Komplett Elevprofil-vy (`app/(auth)/student/[id].tsx`):
    - [x] Header med vinyl-logotyp, titel och tillbaka-knapp
    - [x] Elevinfo med namn och profilbild
    - [x] GuardianCard för vårdnadshavarens information
    - [x] Återanvändbar TabToggle-komponent (pill/underline variants)
    - [x] Översikt-flik med nästa lektion, anteckningar och terminsmål
    - [x] NoteCard med textarea och Spara-knapp (useMutation)
    - [x] Lektioner-flik med Kommande/Senaste under-toggles
    - [x] ExpandableLessonCard med animerad expandering och actions (Genomförd, Boka om, Ställ in)
    - [x] StaticLessonCard för tidigare lektioner
    - [x] FlatList för prestandaoptimerad rendering
    - [x] Fast "Boka lektion" CTA-knapp
- [x] Navigation från Dashboard till Elevprofil
- [x] Implementering av Lookups för Vårdnadshavare-info i Backend & Airtable.
- [x] UX-förbättring: "Kommande" på Elevprofil expanderar direkt istället för redirect.
- [x] Omstrukturering av Bottenmeny (Ny ordning + Inställningar-flik + Karta-ikon).
- [x] Backend: Generisk `POST`-metod i Airtable-servicen.
- [x] Backend: Endpoint `POST /register` med validering, hashning och JWT-generering.
- [x] Backend: Stöd för `PATCH /profile` med `instruments`-array som uppdaterar Airtable.
- [x] Backend: `POST /register` fungerar nu med fullständig data (adress, födelseår etc).
- [x] Backend Refactoring: Implementerat `matchedData` och robust valideringslogik med custom validators för Auth.
- [x] Frontend Onboarding Fas 1: `ProgressBar` och `InstrumentCard` komponenter i `src/components/onboarding/`.
- [x] Frontend Onboarding Fas 2: Registreringsformulär (`app/(public)/register.tsx`) med Zod-validering och `POST /register`.
- [x] Frontend Onboarding Fas 3: Instrument-val (`app/(auth)/onboarding/instruments.tsx`) med 2-kolumns grid, chip-tags, custom-input och `PATCH /profile`.
- [x] Auth Layout: Tab-bar dold på onboarding-rutten via `tabBarStyle: { display: "none" }` och `href: null`.
- [x] Fixat bugg i onboarding-flödet: Navigering går nu korrekt till Instrument-val efter registrering. Orsak: race condition mellan auth-guard och `useRegister`-hook. Lösning: `needsOnboarding`-flagga i Zustand-store som auth-guarden läser för att välja rätt redirect-mål.

- [x] Empty State Dashboard för nya användare utan elever (`EmptyStateDashboard.tsx`):
    - Välkomstmeddelande med lärarens namn
    - Profilstatus-banner (100% klar)
    - Hero Card med CTA "Hitta elever" som navigerar till find-students-tabben
    - Tomt schema-placeholder med streckad border
    - Villkorsstyrd rendering i `app/(auth)/index.tsx` baserat på `students.length`
    
- [x] **Frontend - Dashboard:**
    - Implementerat en interaktiv vertikal karusell (`NotificationStack`) för notiser som ersätter statisk banner.
    - Designad matchande Figma med starka signalfärger (alert/success/info).
    - Utnyttjade stabil `react-native-reanimated-carousel` med `mode="parallax"` för en 3D-stackad känsla utan gesture-konflikter med Dashboardens `ScrollView`.
    - Justerade bredder (`width - 40` + `w-full` på kort) för konsekvent linjering med övrig UI.
    
- [x] Backend: Implementerat geospatial sökning (`GET /api/students/search`) med Haversine-formel och filtrering på "Söker lärare".

- [x] **Backend - Geospatial Sökning:**
    - Implementerat `GET /api/students/search` med Haversine-formel för avståndsberäkning.
    - Avancerad filtrering i Airtable (`SEARCH`-formler) för att hantera "Söker lärare" och array-fält (`Ort`).
    - Typsäker DTO (`StudentPublicDTO`) för att skydda elevdata.
    - **FIX:** Implementerat paginering (`getAllRecords`) i Airtable-servicen för att säkerställa att ALLA elever hämtas, inte bara de första 100.
    
- [x] **Frontend - Karta (Fas 1):**
    - Installation och konfiguration av `react-native-maps` och `expo-location` i `app.json`.
    - Implementerat `findStudentsStore` (Zustand) för att hantera kart-state (elever, plats, filter).
    - Skapat kartvyn i `app/(auth)/find-students.tsx` med hantering av rättigheter och fallback till Stockholm.
    - Kopplat frontend mot backend via `student.service.ts` med korrekt Auth-header.
    - Prestandaoptimering av markörer (`tracksViewChanges={false}`) och färgkodning baserat på instrument.

- [x] **Frontend - Karta (Fas 2): Filter & Sök:**
    - Uppdaterat `student.service.ts` med objekt-parametrar för säkrare anrop.
    - Utökat `findStudentsStore` med `searchQuery`-state och geocoding-logik via `expo-location`.
    - Implementerat "Smart Zoom": Använder `animateToRegion` för enstaka träffar (City View) och `fitToCoordinates` för flera.
    - Implementerat "Kontext-baserad Radie": 10-20km radie vid stadssökning, 30km vid GPS-sökning.
    - Löst bugg där kartan återställdes till GPS vid filterbyte genom att införa `searchLocation` i store.
    - Fixat UX-bugg där kartan flyttades vid rensning av sökfältet (X-knapp).
    - Skapat `FilterChip`-komponent (`src/components/ui/FilterChip.tsx`) med pill-design.
    - Skapat `FilterBar`-komponent (`src/components/find-students/FilterBar.tsx`) med sökfält + horisontell chip-scroll.

- [x] **Frontend - Karta (Fas 3): Lista & Interaktion (High Fidelity):**
    - Implementerat `@gorhom/bottom-sheet` för äkta native-känsla med gestures (flick, snap).
    - **Snap Points:** 15% (Peek), 45% (Sök), och dynamisk topp-punkt (låst under sökfältet).
    - **Låst Scroll:** `enableOverDrag={false}` och beräknad `topInset` förhindrar att listan täcker hela skärmen; innehållet scrollar inuti sheetet.
    - **Google Maps-liknande Markörer:** Custom `Marker`-komponent byggd med lager av `View`s (vit border, instrumentfärg, triangel-svans) och ikoner (`musical-notes`).
    - **Typsäkerhet:** Generisk typning av `BottomSheetFlatList<StudentPublicDTO>` för att lösa TS-varningar.
    - Visuell markering av vald elev med lila border.
    - Skapat `StudentInfoCard`-komponent (`src/components/find-students/StudentInfoCard.tsx`) för marker-klick overlay.        

- [x] **Frontend - Karta (Fas 4): Detaljvy & Ansökan (Google Maps Style):**
    - Ersatte den gamla `Modal`-lösningen med en andra `BottomSheet` för detaljvyn (`StudentDetailModal`).
    - **Interaction Parity:** Klick på markör → öppnar detalj-sheet direkt (Peek 25% -> Full 90%).
    - **Smart Camera:** Vid val av elev (via lista eller markör) centreras kartan med en *offset* så att markören alltid syns ovanför sheetet.
    - **Design:** Uppdaterad list-design ("Tiles" med grå mellanrum) för att matcha Google Maps exakt.
    - Rensat bort överflödig kod (`StudentInfoCard.tsx` borttagen).

- [x] **Frontend - Karta (Fas 5): Fri Utforskning ("Search This Area"):**
    - Implementerat "Sök i det här området"-knapp som dyker upp när användaren panorerar bort från sökresultatet.
    - Utökat `findStudentsStore` med `searchInArea`-action som beräknar radie baserat på zoomnivå (delta).
    - Kopplat `onRegionChangeComplete` i kartvyn för att detektera rörelse och visa knappen.

- [x] **Karta Fas 6: Ansökningsflöde (Request to Teach)**
    - Backend: Implementerat `POST /api/students/:id/request` med deduplicering (`400 Bad Request`). Säker hantering av array-data för Linked Records i Airtable (append, ej overwrite).
    - Backend/Frontend: Skapat dynamisk `hasApplied`-flagga på `StudentPublicDTO` och returnerar i sökresultat.
    - Frontend: Byggt `useRequestToTeach`-hook med felhantering och cache-invalidering för omedelbar UI-uppdatering.
    - Frontend: Premium UX i `StudentDetailModal` där knappar och textfält gråas ut och inaktiveras om läraren redan ansökt ("ANSÖKAN SKICKAD").

- [x] **Frontend - Mina Elever & Navigation Refactor:**
    - Skapat sidan "Mina elever" (`app/(auth)/(tabs)/students.tsx`) som listar inloggad lärares elever.
    - Återanvänt `useStudents` hook och `StudentCard` komponent för DRY och konsistens.
    - Implementerat `FlatList` med `RefreshControl` (pull-to-refresh).
    - **Architecture Refactor:** Flyttat om navigeringsstrukturen till "Stack over Tabs". Skapade en `(tabs)`-grupp för Dashboard/Karta/Lista och flyttade `student/[id]` till den yttre stacken. Detta löste problemet med "Tillbaka"-knappen som alltid gick till Dashboard.

- [x] **Frontend - UI Refactor:**
    - Skapade `PageHeader.tsx` i `src/components/ui` för att ersätta hårdkodade headers.
    - Den är dynamisk via `title`-prop och används nu på Dashboard, Elever och Inställningar.

- [x] **Backend - Lärarprofil & Inställningar:**
    - Utökat `Teacher` types och DTO med nya fält (Telefon, Bio, Bank, mm).
    - Implementerat `GET /profile` som returnerar dokumentstrukturer men döljer `Belastningsregister`.
    - Implementerat `PATCH /profile` med strikt "allow-list" för vilka fält som får uppdateras.
    - **Säkerhet:** Read-only fält (Lön, Status) ignoreras tyst vid uppdateringsförsök.
    - **Validering:** "Smart check" för e-post (tillåter egen, blockerar andras) och validering av nya fält.
    - **Bugfix:** Åtgärdat inloggningsfel genom att inkludera lösenord i Airtable-mappningen.

- [x] **Frontend - Inställningar & Native UI:**
    - Omstrukturerad vy för Inställningar (`app/(auth)/(tabs)/settings.tsx`) till en iOS-inspirerad "Grouped List".
    - Uppdelning i mindre, hanterbara komponenter (`PersonalSection`, `SalarySection`, `BioSection`, `DocumentsSection`, `SettingsUI`) för mycket bättre kodstruktur och läsbarhet.
    - Implementerat `AccordionItem` med buttersmooth expandering (`LayoutAnimation`).
    - Hantering av "stale cache" med en tyst `useEffect` auto-refresh av profildata när inställningssidan laddas.
    - Fixat bugg med krasch vid tom `documents`-array genom säkra fallbacks (`documents || []`).

- [x] **Backend - Notifikationssystem (Dynamiska actionsidor):**
    - Uppdaterade Airtable-strukturen med `NotificationTemplates` (mallar) och `Notifications` (utskick).
    - Implementerade `GET /api/notifications` som automatiskt slår ihop mallar med individuella override-värden.
    - Byggde smart backend-sortering baserat på `Severity` (critical > warning > info) och skapelsedatum.
    - Skapade endpointen `PATCH /api/notifications/:id/resolve` som möjliggör för lärare att svara på formulär och arkivera notiser.

- [x] **Frontend - Notifikationssystem (Dynamiska actionsidor):**
    - Implementerade dynamiska Action-sidor i frontend baserat på notifikationsmallarna.
    - Konfigurerade React Query med `staleTime`, Pull-to-Refresh och `useFocusEffect` för snabb och skalbar uppdatering.
    - Löste render-buggar i karusellen för hantering av enstaka notiser (Bypass logik).
    - **UX Fix:** Optimerat övergången till notifikationssidan (`presentation: "card"`) och lagt till en solid bakgrund (`bg-brand-bg`) för att dölja dashboarden under slide-animationen.

- [x] **Backend - Schemaläggning & Hantering av Lektioner:**
    - Skapat `Lesson.types.ts` och robusta DTO:er för att validera inkommande data från läraren.
    - Byggt `lesson_service.ts` som implementerar "Chunking" (batch-operationer) mot Airtable för att respektera gränsen på 10 rader per request vid Bulk Updates.
    - **POST /lessons:** Logik för att loopa datumveckor (+7 dagar) och rulla ut hela terminer av lektioner tills `termEnd` nås, eller skapa enskilda instanser om repeat saknas.
    - **PATCH /lessons/adjust:** Endpoint för att "Justera" schema. Hittar alla framtida lektioner, sorterar dem i datumordning och applicerar ny tid/dag/upplägg utan att störa historik.
    - **DELETE /lessons/future:** Raderar lektioner för en elev från ett valt datum (perfekt vid uppehåll eller när en elev slutar).
    - Löst sökproblematik i Airtable API genom att tillämpa `SEARCH('{studentName}')` på ett dedikerad textfält i Lektioner-tabellen.

- [x] **Frontend - Hantera lektionsschema (Schedule Management UX):**
    - Skapat nytt "Entry Card" (`ScheduleEntryCard`) högst upp i Elever-listan som en `ListHeaderComponent` för ren hierarki.
    - Byggt dynamisk 3-vägs `TabToggle` för valen Justera, Skapa lektion, och Avsluta.
    - Implementerat native-känsla på formulärfält (`SelectField` inline, `TimePickerField` action sheet, `DatePickerField` inline kalender).
    - **Justera-flöde:** Väljer elev, upplägg, veckodag och tid. Visar tydlig info-ruta om att detta är en Bulk Update för hela terminen.
    - **Skapa-flöde:** Möjlighet att skapa enstaka lektioner eller rullande schema via en kryssruta. Appen hämtar automatiskt lärarens `termEnd` från `authStore` vid repetering.
    - **Avsluta-flöde:** Destructive action med röd varning, en bekräftelse-checkbox för att aktivera knappen, och en sista `Alert`-prompt.
    - **Integration:** Kopplat alla flöden till backend via TanStack Query (`useLessonMutation`) med automatisk cachenollställning (`invalidateQueries`) för att UI ska uppdateras blixtsnabbt.

- [x] **Backend - Enskilda Lektionsåtgärder (Single Lesson Actions):**
    - Skapat funktionen `updateSingleLesson` i `lesson_service.ts` för att rikta uppdateringar mot specifika Record ID:n.
    - Etablerat tre nya endpoints (`PATCH /:id/complete`, `PATCH /:id/reschedule`, `PATCH /:id/cancel`) med dedikerad affärslogik.
    - Implementerat strikt indata-validering via `express-validator` (t.ex. att `cancelledBy` måste vara "Läraren" eller "Vårdnadshavaren").
    - Byggt automatisk formatering av strängar i backend (t.ex. "Vårdnadshavaren ställer in: [anledning]") för att hålla frontend "dumb and beautiful".

- [x] **Frontend - Enskilda Lektionsåtgärder (Modaler):**
    - Implementerat Bottom Sheet-modaler för "Genomförd", "Boka om" och "Ställ in".
    - Löst komplex bugg gällande `NavigationContainer` och Portals genom att placera `BottomSheetModalProvider` korrekt i `app/(auth)/_layout.tsx`.
    - Löst NativeWind-krasch vid dynamisk styling inuti modaler genom att använda statiska `className` kombinerat med dynamisk `style`-prop.
    - Integrerat DatePicker och TimePicker (återanvända komponenter) i "Boka om"-modalen.
    - Byggt en native iOS-liknande Segmented Control (Läraren/Vårdnadshavaren) för "Ställ in"-modalen.
    - Kopplat allt till `useLessonMutation` för omedelbar cache-invalidering och UI-uppdatering.
    - **Buggfix (Airtable 422):** Korrigerat `student.types.ts` och backend-mappning för att skicka ner faktiska `lessonIds` från Airtable (Linked Records). Detta löste felet där fallback-ID:n skickades till Airtable.
    - **Data-integration:** Implementerat ett **Lookup-fält** ("Lektioner Genomförda") i Airtable som mappas till studentens lektionslista för att korrekt dölja genomförda lektioner från dashboarden.

- [x] **Push-notifikationer & Webhook Integration:**
    - **Frontend:** Konfigurerat `expo-notifications` och `expo-device`. Initierat EAS-projekt för att säkra ett `projectId`. Implementerat logik i `_layout.tsx` som vid inloggning ber om OS-behörighet, hämtar Push Token och skickar det tyst till backend.
    - **Backend (Token-lagring):** Adderat `PushToken` till typningarna och skapat `POST /api/profile/push-token` för att spara enhetens unika adress i Airtable ("Lärare"-tabellen).
    - **Backend (Webhook):** Byggt `POST /api/notifications/push-webhook` med `expo-server-sdk`. Validerar inkommande triggers via en statisk `x-webhook-secret` (frikopplad från JWT) och pushar meddelanden till Apple/Google.
    - **Airtable Automation:** Etablerat en Automation med villkoret `Status is active`. Konfigurerat "Run a script" för att skicka Record ID, titel och meddelande via POST till webhooken. Använt `localtunnel` med `Bypass-Tunnel-Reminder` header för att testa och bekräfta live-funktionalitet från databas till mobiltelefonens låsskärm.

- [x] **Buggfixar & UI-Polishing:**
    - **Routing Fix:** Bytt namn på `dashboard.tsx` till `index.tsx` inuti `(auth)/(tabs)` för att följa Expo Router-standard och lösa "Unmatched Route"-felet.
    - **Glassmorphism Design:** Implementerat en ny visuell profil med semi-transparenta kort (`bg-white/70`), vita ramar (`border-2 border-white`) och hörnradie `rounded-[32px]`.
    - **Shadow Clipping Fix:** Introducerat en `shadowWrapper` för att förhindra att skuggor klipps i sidled i React Native.
    - **Grid Layout:** Uppdaterat "Mina elever" till en 2-kolumns grid för bättre UX på enheter med få elever.
    - **Konsistens:** Uppdaterat `ScheduleEntryCard` till den nya glassmorphism-stilen för att matcha övriga listor.

- [x] **Arkitektur & Miljöhantering (.env):**
    - [x] Implementerat central API-konfiguration via `src/config/api.ts` för att följa DRY-principen.
    - [x] Infört `.env` stöd med `EXPO_PUBLIC_` prefix för att enkelt växla mellan hem- och kontorsnätverk.

- [x] **Stabilitet & Buggfixar (Session 2026):**
    - [x] **Dashboard-krasch:** Löst krasch i "Senaste"-vyn genom att införa Composite Keys (Student ID + Datum + Tid + Index) för unik renderingsidentitet.
    - [x] **Inställningar-bugg:** Fixat blank skärm i emulator genom att lägga till Emergency Logout-logik för att rensa korrupt state vid Zustand-osynk.
    - [x] **Dark Mode Fix:** Åtgärdat osynlig text i Picker-komponenter genom att tvinga `themeVariant="light"` på alla native iOS-datumväljare.
    - [x] **Navigation Fix:** Implementerat `resetKey` och `useFocusEffect` på inställningssidan för att automatiskt stänga accordions vid flikbyte.
    - [x] **Deep Linking:** Skapat direktlänk från Elevprofil ("Boka lektion") till schemaläggaren med vald elev förifylld via URL-parametrar och `useLocalSearchParams`.
    - [x] **Layout Fix:** Löst NativeWind-krasch i Elevprofil genom att ersätta villkorsstyrd rendering med `display: none/flex` för att bibehålla navigeringskontext.

- [x] **Moderniserad Kartsökning ("Search in this area"):**
    - **Store Refactor:** Tog bort textbaserad söklogik (`searchQuery`, `setSearchQuery`, debounce-timer) och geocoding från `findStudentsStore.ts`. Ersatte med `mapRegion`, `lastSearchRegion` och `showSearchButton` state.
    - **Ny action `searchInArea`:** Beräknar sökradie dynamiskt baserat på kartans zoom-nivå via formeln `Radius (km) = (latitudeDelta * 111) / 2`.
    - **Tröskellogik:** `updateShowSearchButton` jämför nuvarande kartposition mot `lastSearchRegion`. Knappen visas om mittpunkten flyttats >500m (approximerat avstånd) eller om zoom-nivån ändrats >20%.
    - **FilterBar Cleanup:** Tog bort `TextInput` och sökikoner. Komponenten visar nu enbart instrument-filter-chips med korrekt `SafeAreaInsets`.
    - **Smart Start (Fas 4):** Vid app-start försöker appen hämta GPS. Succé → center med `latitudeDelta: 0.36` (~20km radie). Fallback → Stockholm (59.3293, 18.0686). Automatisk sökning körs i båda fallen.
    - **Memoization:** Alla kart-callbacks (`onRegionChangeComplete`, `handleSearchInArea`) wrappade i `useCallback` för att förhindra onödiga re-renders vid panorering.

## Pågående 🚧
- [ ] 

## Kommande 📅
*(Listan är för närvarande tom. Dags att planera nästa stora funktion!)*
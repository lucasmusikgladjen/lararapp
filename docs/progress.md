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

- [x] **Frontend - Mina Elever & Navigation Refactor:**
    - Skapat sidan "Mina elever" (`app/(auth)/(tabs)/students.tsx`) som listar inloggad lärares elever.
    - Återanvänt `useStudents` hook och `StudentCard` komponent för DRY och konsistens.
    - Implementerat `FlatList` med `RefreshControl` (pull-to-refresh).
    - **Architecture Refactor:** Flyttat om navigeringsstrukturen till "Stack over Tabs". Skapade en `(tabs)`-grupp för Dashboard/Karta/Lista och flyttade `student/[id]` till den yttre stacken. Detta löste problemet med "Tillbaka"-knappen som alltid gick till Dashboard.

- [x] **Frontend - UI Refactor:**
    - Skapade `PageHeader.tsx` i `src/components/ui` för att ersätta hårdkodade headers.
    - Den är dynamisk via `title`-prop och används nu på Dashboard, Elever och Inställningar.

## Pågående 🚧
- [ ] Rapporteringsflöde för lektioner.

## Kommande 📅
- [ ] Push-notifikationer
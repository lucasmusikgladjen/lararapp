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
- [x] Backend Refactoring: Implementerat `matchedData` och robust valideringslogik med custom validators for Auth.
- [x] Frontend Onboarding Fas 1: `ProgressBar` och `InstrumentCard` komponenter i `src/components/onboarding/`.
- [x] Frontend Onboarding Fas 2: Registreringsformulär (`app/(public)/register.tsx`) med Zod-validering och `POST /register`.
- [x] Frontend Onboarding Fas 3: Instrument-val (`app/(auth)/onboarding/instruments.tsx`) med 2-kolumns grid, chip-tags, custom-input och `PATCH /profile`.
- [x] Auth Layout: Tab-bar dold på onboarding-rutten via `tabBarStyle: { display: "none" }` och `href: null`.
- [x] Fixat bugg i onboarding-flödet: Navigering går nu korrekt till Instrument-val efter registrering.

- [x] Empty State Dashboard för nya användare utan elever (`EmptyStateDashboard.tsx`):
    - Välkomstmeddelande med lärarens namn
    - Profilstatus-banner (100% klar)
    - Hero Card med CTA "Hitta elever" som navigerar till find-students-tabben
    - Tomt schema-placeholder med streckad border
    - Villkorsstyrd rendering i `app/(auth)/index.tsx` baserat på `students.length`
    
- [x] **Frontend - Dashboard:**
    - [x] Implementerat en interaktiv vertikal karusell (`NotificationStack`) för notiser.
    - [x] **Premium UX:** Refactor av `NotificationStack` med "Morphing animation" (Stack -> Lista) för en buttersmooth iPhone-känsla.
    - [x] Utnyttjade stabil `react-native-reanimated-carousel` med `customAnimation` för fysisk spatial continuity.
    - [x] **UX-stabilitet:** Implementerat en "Emergency Reset"-knapp (Tvinga utloggning) för att hantera korrupt state i `AsyncStorage`.
    
- [x] Backend: Implementerat geospatial sökning (`GET /api/students/search`) med Haversine-formel och filtrering på "Söker lärare".

- [x] **Backend - Geospatial Sökning & DTO-uppdatering:**
    - Implementerat `GET /api/students/search` med Haversine-formel för avståndsberäkning.
    - Avancerad filtrering i Airtable (`SEARCH`-formler) för att hantera "Söker lärare" och array-fält (`Ort`).
    - Typsäker `StudentPublicDTO` för att skydda elevdata.
    - **FIX:** Implementerat paginering (`getAllRecords`) i Airtable-servicen för att säkerställa att ALLA elever hämtas.
    - Utökat `StudentPublicDTO` med `birthYear` för åldersberäkning och `NummerID` för anonymiserad referens (t.ex. "Elev #479").
    
- [x] **Frontend - Karta (Fas 1):**
    - Installation och konfiguration av `react-native-maps` och `expo-location` i `app.json`.
    - Implementerat `findStudentsStore` (Zustand) för att hantera kart-state (elever, plats, filter).
    - Skapat kartvyn i `app/(auth)/find-students.tsx` med hantering av rättigheter och fallback till Stockholm.
    - Kopplat frontend mot backend via `student.service.ts` med korrekt Auth-header.
    - Prestandaoptimering av markörer (`tracksViewChanges={false}`) och färgkodning baserat på instrument.

- [x] **Frontend - Karta (Fas 2): Filter & Sök:**
    - Uppdaterat `student.service.ts` med objekt-parametrar för säkrare anrop.
    - Utökat `findStudentsStore` med `searchQuery`-state och geocoding-logik via `expo-location`.
    - Implementerat "Smart Zoom": Använder `animateToRegion` för enstaka träffar och `fitToCoordinates` för flera.
    - Implementerat "Kontext-baserad Radie": 10-20km radie vid stadssökning, 30km vid GPS-sökning.
    - Löst bugg där kartan återställdes till GPS vid filterbyte.
    - Fixat UX-bugg där kartan flyttades vid rensning av sökfältet.
    - Skapat `FilterChip`-komponent (`src/components/ui/FilterChip.tsx`) med pill-design.
    - Skapat `FilterBar`-komponent (`src/components/find-students/FilterBar.tsx`) med sökfält + chip-scroll.

- [x] **Frontend - Karta (Fas 3): Lista & Interaktion (High Fidelity):**
    - Implementerat `@gorhom/bottom-sheet` för äkta native-känsla med gestures.
    - **Snap Points:** 15% (Peek), 45% (Sök), och dynamisk topp-punkt.
    - **Låst Scroll:** `enableOverDrag={false}` och beräknad `topInset` förhindrar att listan täcker sökfältet.
    - **Google Maps-liknande Markörer:** Custom `Marker`-komponent med lager av `View`s och ikoner.
    - **Typsäkerhet:** Generisk typning av `BottomSheetFlatList<StudentPublicDTO>`.
    - Visuell markering av vald elev med lila border.

- [x] **Frontend - Karta (Fas 4): Detaljvy & Ansökan (Google Maps Style):**
    - Ersatte den gamla `Modal`-lösningen med en andra `BottomSheet` för detaljvyn (`StudentDetailModal`).
    - **Interaction Parity:** Klick på markör → öppnar detalj-sheet direkt (Peek 25% -> Full 90%).
    - **Smart Camera:** Centrerar kartan med en *offset* vid val av elev så att markören syns ovanför sheetet.
    - **Design:** Uppdaterad list-design ("Tiles" med grå mellanrum) exakt som Google Maps.

- [x] **Frontend - Karta (Fas 5): Fri Utforskning ("Search This Area"):**
    - Implementerat "Sök i det här området"-knapp vid panorering bort från sökresultatet.
    - Utökat `findStudentsStore` med `searchInArea`-action.
    - Kopplat `onRegionChangeComplete` i kartvyn för att detektera rörelse.

- [x] **Karta Fas 6: Ansökningsflöde (Request to Teach)**
    - Backend: Implementerat `POST /api/students/:id/request` med deduplicering och säker hantering av linked records.
    - Backend/Frontend: Skapat dynamisk `hasApplied`-flagga på `StudentPublicDTO`.
    - Frontend: Byggt `useRequestToTeach`-hook med felhantering och cache-invalidering.
    - Frontend: Premium UX i `StudentDetailModal` med inaktiverade fält vid befintlig ansökan.

- [x] **Karta Fas 8: Förbättrad Detaljvy & Ansökan:**
    - [x] Implementerat anonymiserat UI där eleven identifieras via sitt NummerID (t.ex. "Elev #479").
    - [x] Skapat 2-kolumns grid för tydlig visning av instrument och ålder.
    - [x] Utökat ansökningsformuläret till fyra specifika fält (Erfarenhet, Tillgänglighet, Pris, Övrigt).
    - [x] Lagt till steg-för-steg information om Musikglädjens matchningsprocess.
    - [x] Infört obligatorisk checkbox för matchningsgodkännande.
    - [x] Visuell integration av `MainBackground` i BottomSheet-bakgrunden med runda hörn.

- [x] **Frontend - Mina Elever & Navigation Refactor:**
    - Skapat sidan "Mina elever" (`app/(auth)/(tabs)/students.tsx`).
    - Återanvänt `useStudents` hook och `StudentCard` komponent för DRY.
    - Implementerat `FlatList` med `RefreshControl`.
    - **Architecture Refactor:** Flyttat om navigeringsstrukturen till "Stack over Tabs" för att lösa navigeringshistoriken.

- [x] **Frontend - UI Refactor:**
    - [x] Skapade `PageHeader.tsx` i `src/components/ui` för dynamiska headers på alla huvudvyn.
    - [x] **Informationshub:** Implementerat en Modal i headern som triggas av hjälp-ikonen. Visar företagets logotyp, biografi och klickbara kontaktlänkar (Webb, E-post, Telefon) via `Linking` API:et.

- [x] **Frontend - Elevprofil Refactor ("Elevhub"):**
    - [x] Omstrukturerat elevvyn till en modulär "Elevhub" med micro-sidor och navigeringstaggar.
    - [x] Fixat krascher vid flikbyten genom `display: none/flex` och hybrid-styling (statiska klasser + inline styles).
    - [x] Standardiserat lektionsvyn genom att använda den gemensamma komponenten `ScheduleCard`.
    - [x] Förbättrad Affordance: Tagit bort högerpilar och inaktiverat klick för statiska historiska lektioner.

- [x] **Backend - Lärarprofil & Inställningar:**
    - [x] Utökat `Teacher` types och DTO med nya fält (Telefon, Bio, Bank, mm).
    - [x] Implementerat `GET /profile` och `PATCH /profile` med strikt "allow-list" för fält.
    - [x] **Dynamisk Statistik:** Mappat Airtables `Önskar`-fält till `pendingStudentIds` i API-svaret.
    - [x] **Säkerhet:** Dokumenthantering upplåst för alla tre huvudtyper (Avtal, Jämkning, Belastningsregister).

- [x] **Frontend - Inställningar Refactor ("Lärarhub"):**
    - [x] Omstrukturerat Inställningar till samma Hub-layout som elevvyn för visuell konsistens.
    - [x] Implementerat Hero-kort med profilbild, namn och biografisk sammanfattning.
    - [x] **Instrument-redigering:** Integrerat textbaserad instrumentredigering direkt i `PersonalSection` med automatisk Array-konvertering.
    - [x] **Statistik:** Implementerat dynamisk räknare för "Pågående" elever (baserat på `pendingStudentIds`).
    - [x] UX-optimering: "Vårdnadshavaren" är nu standardval och placerad primärt till vänster i `CancelLessonSheet`.

- [x] **Frontend - Dokument & Uppladdning:**
    - [x] Implementerat logisk gruppering av dokument under tydliga sektionsrubriker.
    - [x] Skapat smarta placeholders med dashed-border som visas automatiskt om en fil saknas.
    - [x] Design-polish av `DocRow` med cirkulära ikoner och förbättrad kontrast.

- [x] **Backend - Notifikationssystem (Dynamiska actionsidor):**
    - Uppdaterade Airtable-strukturen med `NotificationTemplates` och `Notifications`.
    - Implementerade `GET /api/notifications` med backend-sortering baserat på `Severity`.
    - Skapade endpointen `PATCH /api/notifications/:id/resolve`.

- [x] **Frontend - Notifikationssystem (Dynamiska actionsidor):**
    - Implementerade dynamiska Action-sidor i frontend baserat på mallar.
    - Konfigurerade React Query med snabb auto-refresh.

- [x] **Backend - Schemaläggning & Hantering av Lektioner:**
    - Byggt `lesson_service.ts` med "Chunking" för bulk-operationer mot Airtable.
    - **POST /lessons:** Logik för att rulla ut hela terminer av lektioner.
    - **PATCH /lessons/adjust:** Endpoint för att justera framtida schema utan att störa historik.
    - **DELETE /lessons/future:** Raderar lektioner för en elev från ett valt datum.

- [x] **Frontend - Hantera lektionsschema (Schedule Management UX):**
    - Skapat nytt "Entry Card" (`ScheduleEntryCard`) högst upp i Elever-listan.
    - Byggt dynamiska flöden för att Justera, Skapa och Avsluta lektionsschema.
    - Implementerat native-känsla på formulärfält (`SelectField`, `TimePickerField`, `DatePickerField`).

- [x] **Backend - Enskilda Lektionsåtgärder (Single Lesson Actions):**
    - Skapat specifika endpoints för `PATCH /:id/complete`, `reschedule`, och `cancel`.
    - Implementerat strikt validering och automatisk formatering av statussträngar i backend.

- [x] **Frontend - Enskilda Lektionsåtgärder (Modaler):**
    - [x] **Standardisering:** Implementerat den nya High-Fidelity designen för `ScheduleCard` med asymmetrisk layout.
    - [x] **UX-polish:** Flyttat status-badgar (Försenad/Rapportera) till samma rad som elevens namn.
    - [x] **Interaktivitet:** Integrerat premium "dubbel-cirkel" ikonografi för genomförda lektioner.

- [x] **Push-notifikationer & Webhook Integration:**
    - **Frontend:** Konfigurerat `expo-notifications` och implementerat token-hämtning i `_layout.tsx`.
    - **Backend (Webhook):** Byggt `POST /api/notifications/push-webhook` skyddat med `x-webhook-secret`.
    - **Airtable Automation:** Konfigurerat Automationer som triggar push-notiser vid specifika händelser.

- [x] **Design & UX-polish (70-tals Retro):**
    - [x] Implementerat 70-talsinspirerad estetik med Mustard Gold, Terracotta och Muted Teal.
    - [x] Skapat avancerade SVG-bakgrunder (`The S-Groove`, `The Vinyl Radar`).
    - [x] Löst lager-konflikter (z-index) för att säkerställa att bakgrunden syns bakom innehållet.

- [x] **Formulär-optimering (iPhone-First):**
    - [x] `SelectField`: Implementerat Auto-select av första alternativet.
    - [x] `TimePickerField`: Nuvarande enhetstid sätts som default vid öppning.
    - [x] **iOS Picker Fix:** Implementerat "Confirmation Pattern" med `tempDate` och "Klar"-knapp.

- [x] **Buggfixar & UI-Polishing:**
    - [x] **Standard Card Design:** Alla huvudkomponenter (ScheduleCard, StudentCard, SettingsSections) använder nu en enhetlig profil: `bg-white rounded-3xl p-5 border border-slate-100 shadow-sm`.
    - [x] **Grid Layout:** Uppdaterat elevlistor till en 2-kolumns grid.

- [x] **Arkitektur & Miljöhantering (.env):**
    - [x] Implementerat central API-konfiguration via `src/config/api.ts`.
    - [x] Infört `.env` stöd med `EXPO_PUBLIC_` prefix.

- [x] **Stabilitet & Buggfixar (Session 2026):**
    - [x] **Dashboard-krasch:** Löst krasch i "Senaste"-vyn genom Composite Keys.
    - [x] **Dark Mode Fix:** Tvingat `themeVariant="light"` på Picker-komponenter.
    - [x] **Deep Linking:** Skapat direktlänk från Elevprofil till schemaläggaren via URL-parametrar.

- [x] **Moderniserad Kartsökning ("Search in this area"):**
    - [x] **Store Refactor:** Övergång från textbaserad sökning till region-baserad sökning.
    - [x] **Smart Start:** Automatisk GPS-hämtning och kartsökning vid app-start.
    - [x] **Ikonografi:** Implementerat instrument-specifika kartmarkörer med en hybrid av `MaterialCommunityIcons` och `FontAwesome5` (t.ex. trum-ikon för trummor).

## Pågående 🚧
- [ ] 

## Kommande 📅
*(Listan är för närvarande tom. Dags att planera nästa stora funktion!)*
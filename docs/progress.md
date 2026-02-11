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
    
- [x] **Frontend - Karta (Fas 1):**
    - Installation och konfiguration av `react-native-maps` och `expo-location` i `app.json`.
    - Implementerat `findStudentsStore` (Zustand) för att hantera kart-state (elever, plats, filter).
    - Skapat kartvyn i `app/(auth)/find-students.tsx` med hantering av rättigheter och fallback till Stockholm.
    - Kopplat frontend mot backend via `student.service.ts` med korrekt Auth-header.
    - Prestandaoptimering av markörer (`tracksViewChanges={false}`) och färgkodning baserat på instrument.

## Pågående 🚧
- [ ] Rapporteringsflöde för lektioner.

## Kommande 📅
- [ ] Elevkarta i FindStudents med Google Directions integration.
- [ ] Push-notifikationer.
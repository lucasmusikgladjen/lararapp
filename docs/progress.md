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

## Pågående 🚧
- [ ] Rapporteringsflöde för lektioner.

## Kommande 📅
- [ ] Elevkarta i FindStudents med Google Directions integration.
- [ ] Push-notifikationer.
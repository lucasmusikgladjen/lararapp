# Task Plan: Implementation av Elevprofil

## Mål
Skapa en prestandaoptimerad och pixel-perfekt Elevprofil (`app/(auth)/student/[id].tsx`) baserat på referensdesignen i `docs/references/StudentProfile/`.

## Definition of Done (DoD)
- [x] **Backend:** Implementera `PATCH /api/students/:id` med validering (Verifierat i Postman).
- [x] **Frontend Types:** Uppdatera `frontend/src/types/student.types.ts` med `notes` och `goals`.
- [x] **Frontend Service:** Skapa `updateStudentInfo` i `student.service.ts` och en `useMutation`-hook.
- [x] **Navigation:** Fungerande navigering från Dashboard till `/student/[id]` med swipe-back-stöd och bakåt-knapp i headern.
- [x] **Header & Info:** Visar "Elevprofil", elevens namn och rund profilbild.
- [x] **GuardianCard:** Informationskort med vårdnadshavarens namn, adress, e-post och telefon.
- [x] **Toggle-logik:**
    - Huvud-toggle: "Översikt" (default) / "Lektioner".
    - Under-toggle (för Lektioner): "Kommande" (aktiv med grön border) / "Senaste".
- [x] **Översikt-flik:**
    - Visar nästa lektion och centrerad separator.
    - Kort för "Senaste anteckningar" och "Terminsmål" med inputfält och fungerande Spara-knapp (persistent state).
- [x] **Lektioner-flik:**
    - Prestandaoptimerad rendering med `FlatList` för historik och framtid.
    - Expandera-logik för kommande lektioner (roterande pil + actions: Genomförd, Boka om, Ställ in).
    - Statiska (ej klickbara) kort för "Senaste" lektioner.
- [x] **Global CTA:** Permanent "Boka lektion"-knapp längst ner på båda flikarna.

## Implementerade filer

### Nya filer
- `frontend/src/hooks/useStudentMutation.ts` - useMutation hook för att uppdatera student
- `frontend/src/components/students/GuardianCard.tsx` - Vårdnadshavarens informationskort
- `frontend/src/components/students/NoteCard.tsx` - Antecknings-/målkort med textarea och spara-knapp
- `frontend/src/components/ui/TabToggle.tsx` - Återanvändbar toggle-komponent (pill/underline)
- `frontend/src/components/lessons/ExpandableLessonCard.tsx` - Expanderbart lektionskort med actions
- `frontend/src/components/lessons/StaticLessonCard.tsx` - Statiskt lektionskort för historik
- `frontend/src/components/lessons/OverviewLessonCard.tsx` - Kompakt lektionskort för översikt
- `frontend/app/(auth)/student/[id].tsx` - Huvudvy för elevprofil

### Modifierade filer
- `frontend/src/types/student.types.ts` - Lade till `notes`, `goals`, `Guardian`, `Lesson` types
- `frontend/src/services/student.service.ts` - Lade till `updateStudentInfo` och `getStudentById`
- `frontend/src/components/lessons/NextLessonCard.tsx` - Lade till `onPress` prop
- `frontend/app/(auth)/_layout.tsx` - Lade till student/[id] route (dold från tab-bar)
- `frontend/app/(auth)/index.tsx` - Lade till navigation till elevprofil
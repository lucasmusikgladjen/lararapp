# Task Plan: Implementation av Elevprofil

## Mål
Skapa en prestandaoptimerad och pixel-perfekt Elevprofil (`app/(auth)/student/[id].tsx`) baserat på referensdesignen i `docs/references/StudentProfile/`.

## Definition of Done (DoD)
- [x] **Backend:** Implementera `PATCH /api/students/:id` med validering (Verifierat i Postman).
- [ ] **Frontend Types:** Uppdatera `frontend/src/types/student.types.ts` med `notes` och `goals`.
- [ ] **Frontend Service:** Skapa `updateStudentInfo` i `student.service.ts` och en `useMutation`-hook.
- [ ] **Navigation:** Fungerande navigering från Dashboard till `/student/[id]` med swipe-back-stöd och bakåt-knapp i headern.
- [ ] **Header & Info:** Visar "Elevprofil", elevens namn och rund profilbild.
- [ ] **GuardianCard:** Informationskort med vårdnadshavarens namn, adress, e-post och telefon.
- [ ] **Toggle-logik:**
    - Huvud-toggle: "Översikt" (default) / "Lektioner".
    - Under-toggle (för Lektioner): "Kommande" (aktiv med grön border) / "Senaste".
- [ ] **Översikt-flik:**
    - Visar nästa lektion och centrerad separator.
    - Kort för "Senaste anteckningar" och "Terminsmål" med inputfält och fungerande Spara-knapp (persistent state).
- [ ] **Lektioner-flik:**
    - Prestandaoptimerad rendering med `FlatList` för historik och framtid.
    - Expandera-logik för kommande lektioner (roterande pil + actions: Genomförd, Boka om, Ställ in).
    - Statiska (ej klickbara) kort för "Senaste" lektioner.
- [ ] **Global CTA:** Permanent "Boka lektion"-knapp längst ner på båda flikarna.
# Task Plan: Implementation av "Empty State" Dashboard

## Mål
Skapa en välkomnande och drivande Dashboard-vy för nya lärare som precis avslutat onboarding men ännu inte har några elever.

## Arkitektur
Vi ska inte radera den nuvarande dashboarden. Istället ska vi implementera logik i `app/(auth)/index.tsx` som väljer vy baserat på användarens data:
* **Om läraren har elever:** Visa den vanliga Dashboarden (befintlig kod).
* **Om läraren INTE har elever:** Visa den nya `EmptyStateDashboard`-komponenten.

## Definition of Done (DoD)

### Fas 1: Komponent (`EmptyStateDashboard`)
- [ ] **Fil:** Skapa `src/components/dashboard/EmptyStateDashboard.tsx`.
- [ ] **Sektion 1 (Välkomst):** Visa "Välkommen, [Namn] 🎉".
- [ ] **Sektion 2 (Status):** Visa en ruta med "Profilen är 100% klar!".
- [ ] **Sektion 3 (Main Card):** Visa "Dags att komma igång" med CTA-knapp "Hitta elever".
- [ ] **Sektion 4 (Schema):** Visa en "Tomt schema"-placeholder med streckad/dotted border.
- [ ] **Styling:** Följ `docs/style_guide.md` (Brand Orange för CTA, korrekt typografi).

### Fas 2: Integration & Logik
- [ ] **Logik:** I `app/(auth)/index.tsx`, hämta student-listan (via `useStudents` eller liknande).
- [ ] **Villkor:** Om listan är tom (`length === 0`), rendera `EmptyStateDashboard`. Annars rendera standardvyn.
- [ ] **Navigation:** Koppla CTA-knappen "Hitta elever" till rutten `/find-students` (eller motsvarande tab).

### Fas 3: Dokumentation
- [ ] **Uppdatera:** `docs/progress.md` (bocka av uppgiften).
- [ ] **Uppdatera:** `docs/findings.md` (dokumentera att vi nu har en dedikerad vy för nya användare).
- [ ] **Markera:** Denna plan som klar.
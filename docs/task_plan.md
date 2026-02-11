# Task Plan: Backend - Sök & Filtrering av Elever

## Mål
Bygga endpoint `GET /api/students/search` som filtrerar elever baserat på stad, instrument och avstånd.

## Viktigt om Data
* **Airtable-struktur:** Fälten `Latitude`, `Longitude` och `Ort` returneras som arrayer (`number[]`, `string[]`) enligt `Student.types.ts`. Backend måste mappa ut första värdet (`[0]`) för att logiken ska fungera.

## Definition of Done (DoD)

### Fas 1: Typer
- [ ] **Fil:** Uppdatera `src/types/Student.types.ts`.
- [ ] **Action:** Lägg till `StudentPublicDTO` och `GetStudentsQuery` (utan att radera befintliga typer).

### Fas 2: Service (Logik)
- [ ] **Fil:** Uppdatera `src/services/student_service.ts`.
- [ ] **Funktion:** `findStudents`.
- [ ] **Logik:**
    - Hämta data från Airtable.
    - **Säker mappning:** `lat: record.fields.Latitude?.[0]`.
    - **Avståndsberäkning:** Haversine-formel.
    - **Filtrering:** Applicera `radius` i koden.

### Fas 3: API
- [ ] **Fil:** Skapa `searchStudents` i `src/controllers/student_controller.ts`.
- [ ] **Fil:** Lägg till route i `src/routes/studentRoutes.ts`.
    - **VIKTIGT:** Routen `/search` måste ligga FÖRE `/:id`.

### Fas 4: Dokumentation
- [ ] **Uppdatera:** `docs/progress.md` och `docs/findings.md` med info om den nya sök-arkitekturen.
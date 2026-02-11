# Task Plan: Frontend - "Hitta Elever" Karta & UI

## Mål
Implementera en Google Maps-inspirerad vy för att hitta elever. Vyn ska innehålla en interaktiv karta, filtrering på instrument, och en lista över elever i närheten.

## Design & Referenser
* **Huvudvy:** `docs/references/FindStudents/2_students_map.png` (Karta + Sökfält + Filterchips + Lista i botten).
* **Marker-klick:** `docs/references/FindStudents/3_student_info.png` (Liten info-ruta på kartan).
* **Detaljvy:** `docs/references/FindStudents/4_student_modal.png` (Fullskärms-modal/BottomSheet med "Ansök"-knapp).

## Arkitektur
* **Karta:** `react-native-maps` (Provider: Google/Native).
* **Plats:** `expo-location` för att centrera kartan på läraren.
* **State:** `findStudentsStore` (Zustand) för att hantera sökresultat, filter och vald elev.
* **UI Komponenter:**
    * `FindStudentsMap`: Wrapper för MapView.
    * `FilterBar`: Horisontell scroll-lista med chips (Piano, Gitarr, etc).
    * `StudentListSheet`: BottomSheet som visar "Elever i närheten".
    * `StudentDetailModal`: Modal för fullständig info och ansökan.

## Definition of Done (DoD)

### Fas 1: Grundstruktur & Karta
- [x] **Paket:** Installera `react-native-maps` och `expo-location`.
- [x] **Store:** Skapa `src/store/findStudentsStore.ts` (actions: `setStudents`, `setFilter`, `selectStudent`).
- [x] **Fil:** Skapa `app/(auth)/find-students.tsx`.
- [x] **Karta:** Implementera `MapView` som visar användarens position och hämtar elever via API (`/api/students/search`).
- [x] **Markers:** Visa custom markers för varje elev.

### Fas 2: Filter & Sök (Klar ✅)
- [x] **Service:** Uppdatera `student.service.ts` (`searchStudents`) för att ta emot `searchQuery` (string) och skicka det som `city` till backend.
- [x] **Store:** Uppdatera `findStudentsStore` med `searchQuery`-state och logik för att kombinera text + filter.
- [x] **Prestanda:** Implementera **Debounce** (fördröjning) i sökningen för att spara API-anrop.
- [x] **Komponent:** Skapa `FilterBar` (Sökfält + Instrument-chips).
- [x] **Design:** Matcha stilen i `2_students_map.png` (Lila/Gröna chips, rundat sökfält).
- [x] **Integrera:** Lägg `FilterBar` ovanpå kartan i `find-students.tsx`.
- [x] **Uppdatera:** `docs/progress.md`.
- [x] **Uppdatera:** `docs/findings.md`.

### Fas 3: Lista & Interaktion
- [ ] **Komponent:** Skapa `StudentListSheet` (Lista i botten).
- [ ] **Synk:** När kartan rör sig, uppdatera listan "Elever i närheten".
- [ ] **Klick:** Klick på lista -> Panorera till marker. Klick på Marker -> Öppna liten info-ruta (`3_student_info.png`).

### Fas 4: Detaljvy & Ansökan
- [ ] **Komponent:** Skapa `StudentDetailModal` (`4_student_modal.png`).
- [ ] **Innehåll:** Visa Elev-avatar, Instrument-ikon, Beskrivning och Textfält för hälsning.
- [ ] **Logik:** "ANSÖK"-knapp (Logik för detta kommer senare, men UI ska finnas).

### Fas 5: Dokumentation
- [ ] **Uppdatera:** `docs/progress.md`.
- [ ] **Uppdatera:** `docs/findings.md`.
- [ ] **Uppdatera:** `docs/task_plan.md`.
# Task Plan: Moderniserad Kartsökning ("Search in this area")

## Mål
Ersätta den traditionella textbaserade sökningen med en dynamisk "Sök i det här området"-knapp för att efterlikna moderna karttjänster (Google Maps). Förbättra den initiala användarupplevelsen genom att automatiskt visa elever inom 20 km radie från användaren eller fallback till Stockholm.

## Arkitektur
* **State Management:** `findStudentsStore.ts` (Zustand) utökas för att hantera kartans aktuella region, spåra om användaren har panorerat/zoomat, samt hantera sökning baserat på koordinater och deltas (zoom-nivå).
* **Frontend UI:**
    * `FilterBar.tsx`: Rensas från textinmatning men behåller filter-chips för instrument.
    * `find-students.tsx`: Implementerar en flytande knapp-komponent ("Sök här") och hanterar kartans livscykelhändelser (`onRegionChangeComplete`).
* **Location Services:** `expo-location` används för att sätta den initiala vyn och beräkna avstånd.

## Definition of Done (DoD)

### Fas 1: Store & Logik (Zustand) ✅
- [x] Ta bort `searchQuery` och all textbaserad söklogik från `findStudentsStore.ts`.
- [x] Lägg till state `mapRegion` för att hålla koll på var användaren befinner sig på kartan.
- [x] Lägg till state `lastSearchRegion` för att kunna jämföra om användaren har flyttat kartan tillräckligt mycket för att visa sökknappen.
- [x] Lägg till state `showSearchButton` (boolean).
- [x] Skapa action `searchInArea` som triggar ett API-anrop baserat på koordinaterna i mitten av den nuvarande vyn och beräknar radien baserat på kartans zoom-nivå (latitudeDelta).

### Fas 2: UI-uppdatering (FilterBar) ✅
- [x] Öppna `frontend/src/components/find-students/FilterBar.tsx`.
- [x] Ta bort `TextInput` och relaterade komponenter (sökikoner, rensa-knapp).
- [x] Justera layouten så att instrument-filter (chips) presenteras snyggt och tar upp den lediga platsen.
- [x] Säkerställ att komponenten fortfarande respekterar `SafeAreaInsets` för korrekt positionering under notch/dynamic island.

### Fas 3: "Sök i området"-knapp & Kart-interaktion ✅
- [x] Skapa en flytande sökknapp i `app/(auth)/(tabs)/find-students.tsx` som endast visas när `showSearchButton` är true.
- [x] Implementera `onRegionChangeComplete` på `MapView`.
    - [x] Beräkna om den nya regionen skiljer sig tillräckligt mycket från `lastSearchRegion`.
    - [x] Om ja: Sätt `showSearchButton` till true.
- [x] Vid klick på "Sök här":
    - [x] Kör `searchInArea()`.
    - [x] Sätt `showSearchButton` till false.
    - [x] Uppdatera `lastSearchRegion`.

### Fas 4: Initial Position & Default-vy (1b) ✅
- [x] Uppdatera logiken för app-start:
    - [x] Försök hämta användarens GPS-position.
    - [x] Om succé: Sätt initial region med en zoom-nivå (delta) som täcker ca 20 km radie.
    - [x] Om GPS saknas/nekas: Sätt initial region till Stockholm (Lat: 59.3293, Lon: 18.0686).
- [x] Trigga en automatisk sökning vid första laddning så att elever visas direkt utan input.

### Fas 5: Dokumentation & Uppföljning ✅
- [x] **Uppdatera:** `docs/progress.md`.
- [x] **Uppdatera:** `docs/findings.md` med anteckningar om hur radie beräknas baserat på `latitudeDelta`.
- [x] **Uppdatera:** `docs/task_plan.md`.

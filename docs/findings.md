# Findings & Architecture Notes

## Backend
- **Namngivning:** Alla filer i `/src/controllers` och `/src/services` använder `snake_case` (t.ex. `student_controller.ts`).
- **Felhantering:** `try-catch` ska endast finnas i Controllers. Services kastar fel uppåt för korrekt statuskod-mappning (404 vs 500).
- **Airtable-koppling:** Tabellen "Elev" hämtar klockslag via en Lookup-kolumn `Lektionstider` från tabellen "Lektioner".

## Frontend
- **Tech Stack:** React Native (Expo 54), NativeWind, Zustand, TanStack Query.
- **Dependencies:** Använder `react-native-reanimated@4.1.1` för kompatibilitet med Expo 54/React 19.
- **Datumhantering:** Jämförelser sker mot `new Date().toISOString().split('T')[0]` för att undvika tidszonsförskjutningar vid midnatt.

## UI & Styling Strategy
- **Källa:** Figma Design (gratisversionen).
- **Metod:** Visuell uppskattning och manuell kontroll av värden (färgkoder, avstånd, hörnradie) i Design-tabben då Dev Mode ej används.
- **System:** NativeWind (Tailwind CSS) används för all styling.
- **Konsistens:** När stylingen är satt för Dashboard, låser vi den i `docs/style_guide.md` för att säkerställa visuell identitet i framtida vyer.
- **Komponenter:** PascalCase (t.ex. `NextLessonCard.tsx`) och funktionsbaserade komponenter.
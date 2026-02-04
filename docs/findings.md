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

## Autentisering & Säkerhet
- **Token-lagring:** JWT-tokens sparas i `expo-secure-store` (iOS Keychain / Android Keystore) och ALDRIG i AsyncStorage.
- **State Persistence:** Användarens grunddata (namn, e-post) sparas via Zustands `persist`-middleware i `AsyncStorage` för att möjliggöra omedelbar rendering av UI vid start.
- **Routing:** Vi använder `useSegments` och `router.replace` i root-layouten för att hantera autentiserings-boarding.

## Strategi för Elevprofil
- **Data-fetching:** Använd `useQuery` med `id` från URL:en för att hämta Student, Vårdnadshavare och Lektioner i en samlad logik.
- **Säkerhet:** Verifiera att `teacherId` i JWT matchar elevens kopplade lärare innan personuppgifter visas.
- **Komponentstruktur:**
    - `src/components/students/GuardianCard.tsx`
    - `src/components/lessons/ExpandableLessonCard.tsx`
    - `src/components/ui/TabToggle.tsx` (Återanvändbar komponent för båda toggle-nivåerna).
- **Prestanda:** Använd `FlatList` eller `FlashList` för lektionslistor då dessa kan bli långa (>50 poster).
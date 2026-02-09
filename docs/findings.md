# Findings & Architecture Notes

## Backend
- **Namngivning:** Alla filer i `/src/controllers` och `/src/services` använder `snake_case` (t.ex. `student_controller.ts`).
- **Felhantering:** `try-catch` ska endast finnas i Controllers. Services kastar fel uppåt för korrekt statuskod-mappning (404 vs 500).
- **Airtable-koppling:** Tabellen "Elev" hämtar klockslag via en Lookup-kolumn `Lektionstider` från tabellen "Lektioner".

## Backend: Validering & Utility
- **Airtable Utility:** `airtable.ts` har nu stöd för `PATCH` via en generisk metod som tar emot `Record<string, any>` för fälten.
- **Valideringsmönster:** Vi använder `express-validator` med en inkapslad `validate`-funktion direkt i reglernas array (t.ex. `updateStudentRules`) för att hålla routen ren (DX).
- **Fältmappning (Elev):**
    - `notes` (Frontend) <-> `kommentar` (API) <-> `Kommentar` (Airtable).
    - `goals` (Frontend) <-> `terminsmal` (API) <-> `Terminsmål` (Airtable).
    - **Data-plattning (Lookup):** För att minimera antalet API-anrop använder vi "Lookup"-fält i Airtable (t.ex. `Vårdnadshavare Namn` direkt på `Elev`-tabellen) istället för att göra separata `GET`-anrop till relaterade tabeller.
    
- **Airtable Skriv-operationer:** Vi har utökat `airtable.ts` med en generisk `post`-metod för att kunna skapa nya poster (t.ex. vid registrering).
- **Instrument-hantering:** Backend hanterar instrument som en array av strängar (`string[]`) för frontend, men mappar om detta till en kommaseparerad sträng ("Piano, Gitarr") för Airtable. Detta möjliggör flerval utan att bryta datamodellen.
- **Säker Profiluppdatering:** `updateProfile`-controllern ignorerar `id` i URL-parametrar och använder istället strikt `req.user.id` från JWT-token. Detta förhindrar att en inloggad användare råkar (eller illvilligt) uppdatera någon annans profil.

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
- **Navigation:** Bottenmenyn (Tabs) är synlig även på detaljvyer (t.ex. Elevprofil) för att underlätta snabb navigering, till skillnad från standard "Stack"-beteende där menyn döljs.

## Autentisering & Säkerhet
- **Token-lagring:** JWT-tokens sparas i `expo-secure-store` (iOS Keychain / Android Keystore) och ALDRIG i AsyncStorage.
- **State Persistence:** Användarens grunddata (namn, e-post) sparas via Zustands `persist`-middleware i `AsyncStorage` för att möjliggöra omedelbar rendering av UI vid start.
- **Routing:** Vi använder `useSegments` och `router.replace` i root-layouten för att hantera autentiserings-boarding.
- **Lösenordshantering:** Lösenord hashas med `bcrypt` i controllern *innan* de skickas till Airtable. Vi lagrar aldrig klartextlösenord.
- **Registreringsflöde:** Vid lyckad registrering genereras en JWT-token omedelbart (Auto-login) så användaren slipper logga in separat direkt efter.
- **Backend Types:** `Teacher.types.ts` har utökats med DTO:er (`CreateTeacherData`) för att strikt typa inkommande data vid registrering.

## Strategi för Elevprofil
- **Data-fetching:** Använd `useQuery` med `id` från URL:en för att hämta Student, Vårdnadshavare och Lektioner i en samlad logik.
- **Säkerhet:** Verifiera att `teacherId` i JWT matchar elevens kopplade lärare innan personuppgifter visas.
- **Komponentstruktur:**
    - `src/components/students/GuardianCard.tsx`
    - `src/components/lessons/ExpandableLessonCard.tsx`
    - `src/components/ui/TabToggle.tsx` (Återanvändbar komponent för båda toggle-nivåerna).
- **Prestanda:** Använd `FlatList` eller `FlashList` för lektionslistor då dessa kan bli långa (>50 poster). 

## Elevprofil: Data-mappning
- **Senaste anteckningar:** Mappas till Airtable-fältet `Kommentar` i tabellen `Elev`.
- **Terminsmål:** Mappas till Airtable-fältet `Terminsmål` i tabellen `Elev`.
- **Spara-logik:** Använder `PATCH /api/students/:id`. Backend verifierar att `teacherId` äger eleven innan uppdatering sker.

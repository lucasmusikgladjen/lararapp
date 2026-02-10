# Task Plan: Implementation av Onboarding (Frontend)

## Mål
Implementera ett friktionsfritt, två-stegs onboarding-flöde för nya lärare. Flödet bygger vidare på befintlig mappstruktur i `frontend/`.

## Arkitektur & Flöde

### 1. Startskärm (Landningssida)
* **Fil:** `app/(public)/index.tsx` (Skapa denna fil).
* **Syfte:** Första sidan användaren ser.
* **Val:** "Börja nu" (Navigerar till Register) eller "Logga in" (Navigerar till `login.tsx`).
* *Notera: Om `app/(public)/onboarding/index.tsx` finns idag och inte används, bör den tas bort eller refaktoriseras.*

### 2. Steg 1: Registrering (Konto)
* **Fil:** `app/(public)/register.tsx` (Skapa denna fil).
* **Handling:** Användaren fyller i namn, e-post, lösenord, etc.
* **API:** `POST /register`.
* **Vid Succé:** 1. Spara JWT i SecureStore.
    2. Uppdatera Auth Context (Zustand).
    3. Navigera till Steg 2 (som ligger i Auth-stacken).

### 3. Steg 2: Välj Instrument
* **Fil:** `app/(auth)/onboarding/instruments.tsx` (Skapa mapp och fil).
* **Kontext:** Skyddad rutt (kräver token).
* **Layout-krav:** Denna skärm ligger i `(auth)`, men ska **INTE** visa botten-menyn (Tabs). Detta måste konfigureras i `app/(auth)/_layout.tsx` (`tabBarStyle: { display: 'none' }` eller `href: null`).
* **API:** `PATCH /profile` med `{ instruments: string[] }`.
* **Vid Succé:** Navigera till Dashboard (`app/(auth)/index.tsx`).

## Definition of Done (DoD)

### Fas 1: Komponenter & Struktur
- [ ] **Mappstruktur:** Skapa mappen `src/components/onboarding/`.
- [ ] **Komponent:** `src/components/onboarding/ProgressBar.tsx`
    -   Props: `step` (1/2), `total` (2).
    -   Design: Grön bar (`bg-brand-green`) som fyller bredden baserat på steg.
- [ ] **Komponent:** `src/components/onboarding/InstrumentCard.tsx`
    -   Design: Kort med ikon och text. Blå border vid `selected`.

### Fas 2: Steg 1 (Register UI & Logik)
- [ ] **Fil:** Skapa `app/(public)/register.tsx`.
- [ ] **Formulär:** Implementera fält för `CreateTeacherData` (Namn, E-post, Lösenord, Adress, Postnummer, Ort, Födelseår).
- [ ] **Validering:** Använd `zod` schema som matchar backend-reglerna.
- [ ] **API-anrop:** Använd `axios` för att posta till `/register`.
- [ ] **Felhantering:** Visa felmeddelande om e-posten är upptagen (409).

### Fas 3: Steg 2 (Instrument UI & Logik)
- [ ] **Fil:** Skapa `app/(auth)/onboarding/instruments.tsx`.
- [ ] **Auth-konfig:** Uppdatera `app/(auth)/_layout.tsx` för att dölja tab-baren på denna rutt.
- [ ] **Grid:** Visa instrument-val.
- [ ] **Logik:** "Spara"-knapp som kör `PATCH /profile`.

## UI/UX Krav
-   **Styling:** Använd `NativeWind` klasser enligt `docs/style_guide.md`.
-   **Keyboard:** Använd `KeyboardAvoidingView` för formulär.
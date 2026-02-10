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
* **Fil:** `app/(public)/register.tsx`.
* **Handling:** Användaren fyller i namn, e-post, lösenord, etc.
* **API:** `POST /register`.
* **Vid Succé:**
    1. Sätt `needsOnboarding: true` i Zustand-store.
    2. Spara JWT i SecureStore och uppdatera Auth Context (Zustand) via `loginToStore`.
    3. Auth-guarden i `app/_layout.tsx` upptäcker att användaren är autentiserad och `needsOnboarding === true`, och navigerar automatiskt till `/(auth)/onboarding/instruments`.
* **Viktigt:** Navigeringen sker via auth-guarden, **inte** via direkt `router.replace` i hook:en. Detta förhindrar race conditions mellan auth-guard och hook-navigering.

### 3. Steg 2: Välj Instrument
* **Fil:** `app/(auth)/onboarding/instruments.tsx`.
* **Kontext:** Skyddad rutt (kräver token).
* **Layout-krav:** Denna skärm ligger i `(auth)`, men ska **INTE** visa botten-menyn (Tabs). Konfigurerat i `app/(auth)/_layout.tsx` med `tabBarStyle: { display: 'none' }` och `href: null`.
* **API:** `PATCH /profile` med `{ instruments: string[] }`.
* **Vid Succé:**
    1. Sätt `needsOnboarding: false` i Zustand-store.
    2. Navigera till Dashboard (`/(auth)`) via `router.replace`.

## Definition of Done (DoD)

### Fas 1: Komponenter & Struktur
- [x] **Mappstruktur:** Skapa mappen `src/components/onboarding/`.
- [x] **Komponent:** `src/components/onboarding/ProgressBar.tsx`
    -   Props: `step` (1/2), `total` (2).
    -   Design: Grön bar (`bg-brand-green`) som fyller bredden baserat på steg.
- [x] **Komponent:** `src/components/onboarding/InstrumentCard.tsx`
    -   Design: Kort med ikon och text. Blå border vid `selected`.

### Fas 2: Steg 1 (Register UI & Logik)
- [x] **Fil:** Skapa `app/(public)/register.tsx`.
- [x] **Formulär:** Implementera fält för `CreateTeacherData` (Namn, E-post, Lösenord, Adress, Postnummer, Ort, Födelseår).
- [x] **Validering:** Använd `zod` schema som matchar backend-reglerna.
- [x] **API-anrop:** Använd `axios` för att posta till `/register`.
- [x] **Felhantering:** Visa felmeddelande om e-posten är upptagen (409).

### Fas 3: Steg 2 (Instrument UI & Logik)
- [x] **Fil:** Skapa `app/(auth)/onboarding/instruments.tsx`.
- [x] **Auth-konfig:** Uppdatera `app/(auth)/_layout.tsx` för att dölja tab-baren på denna rutt.
- [x] **Grid:** Visa instrument-val.
- [x] **Logik:** "Spara"-knapp som kör `PATCH /profile`.

## UI/UX Krav
-   **Styling:** Använd `NativeWind` klasser enligt `docs/style_guide.md`.
-   **Keyboard:** Använd `KeyboardAvoidingView` för formulär.
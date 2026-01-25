# Musikglädjen - Lärarappen

En React Native-app (Expo) för Musikglädjens instrumentlärare. Appen möjliggör lektionshantering, elevmatchning, lektionsrapportering och centraliserad kommunikation.

## Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| Framework | Expo (managed workflow) |
| Navigation | Expo Router |
| Språk | TypeScript |
| State Management | Zustand |
| Data Fetching | TanStack Query (React Query) |
| Formulär | React Hook Form + Zod |
| Styling | NativeWind (Tailwind CSS) |
| Push Notifications | Firebase Cloud Messaging |
| Kartor | react-native-maps + Google Directions API |
| Databas | Airtable (via backend proxy) |
| Backend | Express.js API (separat repo) |

## Miljövariabler

Skapa en `.env` fil i projektets rot:

```env
# Backend API (INTE direkt till Airtable - säkerhetsrisk!)
EXPO_PUBLIC_API_URL=https://api.musikgladjen.se

# Google Maps (endast för kartor i appen)
EXPO_PUBLIC_GOOGLE_MAPS_KEY=din_google_maps_key

# Firebase (för push notifications)
EXPO_PUBLIC_FIREBASE_API_KEY=din_firebase_api_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=musikgladjen-app
```

**OBS! Backend-miljövariabler (hanteras INTE i appen):**
```env
# Dessa finns endast i backend-servern
AIRTABLE_API_KEY=patXXXXXX
AIRTABLE_BASE_ID=app1l4NwAMtwlTIUC
JWT_SECRET=en_lång_hemlig_nyckel
```

---

## Projektstruktur

```
lararapp/
├── app/                          # Expo Router routes
│   ├── (auth)/                   # Autentiserade routes (skyddade)
│   │   ├── _layout.tsx           # Tab navigation layout
│   │   ├── index.tsx             # Dashboard (hem)
│   │   ├── find-students.tsx     # Elevkarta
│   │   ├── lessons.tsx           # Lektionshantering
│   │   ├── student/
│   │   │   └── [id].tsx          # Elevprofil (dynamisk route)
│   │   └── settings.tsx          # Inställningar/profil
│   │
│   ├── (public)/                 # Publika routes (ej inloggad)
│   │   ├── _layout.tsx           # Stack layout
│   │   ├── login.tsx             # Login-sida
│   │   └── onboarding/           # Onboarding-flöde
│   │       ├── index.tsx         # Steg 1: Skapa konto
│   │       ├── instruments.tsx   # Steg 2: Välj instrument
│   │       ├── profile.tsx       # Steg 3: Personuppgifter
│   │       ├── documents.tsx     # Steg 4: Belastningsregister
│   │       ├── agreement.tsx     # Steg 5: Avtal
│   │       └── bank.tsx          # Steg 6: Bankuppgifter
│   │
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Entry point (redirect)
│
├── src/
│   ├── components/               # Återanvändbara UI-komponenter
│   │   ├── ui/                   # Bas-komponenter
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Avatar.tsx
│   │   │
│   │   ├── notifications/        # Notifikationssystem
│   │   │   ├── NotificationBanner.tsx
│   │   │   ├── NotificationList.tsx
│   │   │   └── NotificationActionModal.tsx
│   │   │
│   │   ├── lessons/              # Lektionskomponenter
│   │   │   ├── LessonCard.tsx
│   │   │   ├── LessonList.tsx
│   │   │   ├── LessonReportForm.tsx
│   │   │   ├── RescheduleModal.tsx
│   │   │   └── CreateLessonModal.tsx
│   │   │
│   │   ├── students/             # Elevkomponenter
│   │   │   ├── StudentCard.tsx
│   │   │   ├── StudentMap.tsx
│   │   │   ├── StudentMarker.tsx
│   │   │   └── StudentApplicationModal.tsx
│   │   │
│   │   └── layout/               # Layout-komponenter
│   │       ├── Header.tsx
│   │       ├── TabBar.tsx
│   │       └── SafeAreaWrapper.tsx
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useAuth.ts            # Autentiseringslogik
│   │   ├── useNotifications.ts   # Push notifications
│   │   ├── useLessons.ts         # Lektionsdata
│   │   ├── useStudents.ts        # Elevdata
│   │   ├── useDirections.ts      # Google Directions
│   │   └── useLocation.ts        # Användarens position
│   │
│   ├── services/                 # API-lager
│   │   ├── api.ts                # Axios/fetch konfiguration
│   │   ├── auth.service.ts       # Autentisering
│   │   ├── lessons.service.ts    # Lektions-API
│   │   ├── students.service.ts   # Elev-API
│   │   ├── notifications.service.ts
│   │   └── directions.service.ts # Google Directions
│   │
│   ├── store/                    # Zustand stores
│   │   ├── authStore.ts          # Auth state
│   │   ├── notificationStore.ts  # Notifikationer
│   │   ├── lessonStore.ts        # Lektioner
│   │   └── filterStore.ts        # Filter (instrument, etc)
│   │
│   ├── types/                    # TypeScript types
│   │   ├── auth.types.ts
│   │   ├── lesson.types.ts
│   │   ├── student.types.ts
│   │   ├── teacher.types.ts
│   │   ├── notification.types.ts
│   │   └── api.types.ts
│   │
│   ├── utils/                    # Hjälpfunktioner
│   │   ├── constants.ts          # App-konstanter
│   │   ├── colors.ts             # Färgpalett (placeholder)
│   │   ├── formatters.ts         # Datum, tid, etc
│   │   ├── validators.ts         # Zod schemas
│   │   └── storage.ts            # AsyncStorage helpers
│   │
│   └── config/                   # Konfiguration
│       ├── firebase.ts           # Firebase setup
│       └── queryClient.ts        # TanStack Query setup
│
├── assets/                       # Bilder, fonter, etc
│   ├── images/
│   │   ├── logo.png
│   │   ├── mascot.png            # Husky-maskot
│   │   └── placeholder-avatar.png
│   └── fonts/
│
├── docs/                         # Dokumentation
│   ├── CLAUDE.md                 # LLM-instruktioner
│   ├── AIRTABLE_SCHEMA.md        # Databasschema
│   └── references/               # Design-mockups
│
├── app.json                      # Expo konfiguration
├── tailwind.config.js            # NativeWind/Tailwind
├── tsconfig.json                 # TypeScript
├── package.json
└── .env                          # Miljövariabler (gitignored)
```

---

## Sidöversikt & Funktionalitet

### 1. Login (`/login`)
**Syfte:** Autentisering för befintliga användare

**UI-element:**
- Logo/maskot överst
- E-post input
- Lösenord input
- "Glömt lösenordet?" länk
- "LOGGA IN" knapp (grön)
- "Skapa konto" länk → onboarding

**Flöde:**
1. Användare fyller i e-post + lösenord
2. POST till `/api/auth/login`
3. Backend validerar mot Airtable + returnerar JWT
4. Spara JWT i SecureStore
5. Navigera till Dashboard

---

### 2. Onboarding (`/onboarding/*`)
**Syfte:** Registrering av nya lärare

**Steg 1 - Skapa konto** (`/onboarding`)
- Förnamn, efternamn
- E-post
- Lösenord (min 8 tecken, 1 siffra, 1 versal)
- Bekräfta lösenord

**Steg 2 - Välj instrument** (`/onboarding/instruments`)
- Multi-select lista med instrument
- Minst 1 måste väljas
- Instrument: Piano, Gitarr, Bas, Trummor, Sång, Fiol, Cello, Trumpet, Saxofon, Klarinett, Tvärflöjt, Ukulele

**Steg 3 - Om dig** (`/onboarding/profile`)
- Profilbild (valfritt)
- Telefonnummer
- Adress (gata, nummer, postnummer, ort)
- Födelsedatum
- Personnummer (för skatteverket)

**Steg 4 - Belastningsregister** (`/onboarding/documents`)
- Information om varför det behövs
- Ladda upp foto (kamera eller galleri)
- Måste vara max 1 år gammalt

**Steg 5 - Avtal** (`/onboarding/agreement`)
- Visa avtal i scroll-vy
- Checkbox: "Jag har läst och godkänner avtalet"
- Digital signatur (valfritt: SignaturePad)

**Steg 6 - Bankuppgifter** (`/onboarding/bank`)
- Clearingnummer
- Kontonummer
- Bankens namn

**Efter slutförande:**
1. POST till `/api/auth/register` med all data
2. Backend skapar Lärare-post i Airtable
3. Lösenord hashas med bcrypt innan lagring
4. Skicka verifierings-mail (valfritt)
5. Logga in automatiskt

---

### 3. Dashboard (`/` eller `/(auth)`)
**Syfte:** Överblick och snabbåtgärder

**Layout (uppifrån och ner):**

**A. Header**
- Logo vänster
- Titel "Dashboard" center
- Notifikationsklocka höger (badge med antal olästa)

**B. Notifikationssektion**
- Horisontell scrollbar eller vertikal lista
- Max 5 synliga, "Visa alla" knapp
- Varje notis är klickbar → öppnar ActionModal

**C. Nästa lektion**
- Stort kort med:
  - Datum + tid
  - Elev-ID (t.ex. "Elev: 123-456-789")
  - Instrument
  - Adress
  - "Starta lektion" knapp (om inom 30 min)

**D. Toggle: Kommande / Senaste**
- Två tabs: "Kommande" | "Senaste"
- Lista med 5 lektioner
- Klick på lektion → StudentProfile eller rapporteringsmodal

---

### 4. FindStudents (`/(auth)/find-students`)
**Syfte:** Hitta och ansök om nya elever

**Layout:**

**A. Header med filter**
- Dropdown: Filtrera på instrument
- "Alla instrument" som default

**B. Kartvy**
- Google Maps med:
  - Stjärna: Lärarens position
  - Ploppar: Tillgängliga elever (status: "Söker lärare")
  - Klick på plopp → info-kort

**C. Elev-infokort (modal/bottom sheet)**
- Elev-ID (anonymiserat)
- Instrument
- Avstånd (fågelvägen)
- Pendlingstid (gång/cykel/kollektivt) - **max 10 beräkningar/24h**
- "ANSÖK" knapp

**D. Ansökningsflöde**
1. Lärare klickar "ANSÖK"
2. Lärare läggs till i elevens "Önskar"-fält (linked field)
3. Bekräftelse visas: "Din ansökan har skickats!"
4. Admin granskar och godkänner i Airtable
5. Vid godkännande: elev läggs till i lärarens "Elever"-fält

---

### 5. StudentProfile (`/(auth)/student/[id]`)
**Syfte:** Detaljerad vy för lärarens egna elever

**Tillgänglighet:** Endast för elever där läraren är kopplad i "Lärare"-fältet

**Layout:**

**A. Header**
- Tillbaka-knapp
- "Elevprofil" titel
- Notifikationsklocka

**B. Elevinfo**
- Avatar (placeholder-bild)
- Elev-ID

**C. Vårdnadshavare-kort**
- Namn
- Adress
- E-post
- Telefon

**D. Tabs: Översikt | Lektioner**

**Översikt-tab:**
- Kommande lektion (kort)
- Senaste anteckningar (textarea, redigerbar)
- Terminsmål (textarea, redigerbar)
- "Spara" knapp för varje

**Lektioner-tab:**
- Lista med alla lektioner (sorterade på datum)
- Expanderbar: klick visar detaljer
- Status: Genomförd ✓ / Inställd ✗ / Kommande ○

**E. Footer**
- "Boka lektion" knapp (grön, sticky)

---

### 6. LessonHandler (`/(auth)/lessons`)
**Syfte:** Fullständig lektionshantering

**Layout:**

**A. Header**
- Logo
- "Lektioner" titel
- Notifikationsklocka

**B. Tabs: Justera | Skapa lektion | Avsluta**

**Justera-tab:**
- Dropdown: Välj elev
- Lista med elevens kommande lektioner
- Klick på lektion → RescheduleModal
  - Ny datum-picker
  - Ny tid-picker
  - "Spara ändring" / "Avbryt"

**Skapa lektion-tab:**
- Dropdown: Välj elev
- Datum-picker
- Tid-picker
- Upplägg: 45-60 min / 90 min / 120 min
- Checkbox: "Återkommande lektion"
  - Om vald: Välj frekvens (varje vecka)
  - Välj slutdatum
- "Skapa lektion(er)" knapp

**Avsluta-tab:**
- Dropdown: Välj elev
- Varningsruta (röd): "Detta går inte att ångra. Alla framtida lektioner för eleven tas bort..."
- Checkbox: "Jag förstår att lektionerna tas bort permanent"
- "Ta bort kommande lektioner" knapp (röd)
- "Avbryt" knapp

---

## Notifikationssystem

### Notifikationstyper (konfigureras i Airtable)

| Typ | Meddelande | Action |
|-----|------------|--------|
| `UNREPORTED_LESSON` | "Du har glömt rapportera en lektion" | Öppna rapportformulär |
| `NEW_MATCH` | "Ny matchning till dig!" | Visa elevinfo + bekräfta |
| `NEW_STUDENT_NEARBY` | "Ny elev nära dig" | Öppna FindStudents |
| `MISSING_BELASTNINGSREGISTER` | "Du saknar aktuellt belastningsregister" | Öppna uppladdningsmodal |
| `SALARY_AVAILABLE` | "Din lön för [period] är tillgänglig" | Visa lönespecifikation |
| `LESSON_REMINDER` | "Du har en lektion om 1 timme" | Visa lektionsdetaljer |
| `GENERAL_MESSAGE` | [Anpassat meddelande från admin] | Visa meddelande |

### Notifikationsflöde (ActionModal)

```
Användare ser notis på Dashboard
        ↓
Klickar på notisen
        ↓
NotificationActionModal öppnas (overlay på Dashboard)
        ↓
Modal innehåller relevant formulär/info baserat på typ
        ↓
Användare utför action (t.ex. rapporterar lektion)
        ↓
Modal stängs, notis markeras som läst
        ↓
Användare är kvar på Dashboard
```

### Push Notifications (Firebase)

**Setup:**
1. Registrera device token vid login/startup
2. Spara token i Airtable (`Lärare.PushToken`)
3. Backend triggar notis via Firebase Admin SDK
4. App tar emot notis → visar i NotificationList + badge

---

## Autentiseringssystem (JWT)

### Flöde

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    App      │────>│   Backend   │────>│  Airtable   │
└─────────────┘     └─────────────┘     └─────────────┘
      │                    │                    │
      │  1. Login request  │                    │
      │  (email, password) │                    │
      │───────────────────>│                    │
      │                    │  2. Hämta lärare   │
      │                    │  (filterByFormula) │
      │                    │───────────────────>│
      │                    │                    │
      │                    │  3. Lärare-data    │
      │                    │<───────────────────│
      │                    │                    │
      │                    │  4. Verifiera      │
      │                    │  bcrypt.compare()  │
      │                    │                    │
      │  5. JWT token      │                    │
      │<───────────────────│                    │
      │                    │                    │
      │  6. Spara i        │                    │
      │  SecureStore       │                    │
```

### JWT Payload

```typescript
{
  id: string;           // Airtable record ID
  email: string;
  namn: string;
  instruments: string[];
  iat: number;          // Issued at
  exp: number;          // Expiration (7 dagar)
}
```

### Säkerhetsregler

1. **Lösenord:** Hashas med bcrypt (cost factor 12) innan lagring
2. **JWT Secret:** Minst 256 bitar, lagras endast i backend
3. **Token refresh:** Automatisk refresh om < 1 dag kvar
4. **SecureStore:** Använd expo-secure-store, INTE AsyncStorage för tokens

---

## Google Directions API

### Rate Limiting

- **Max 10 förfrågningar per användare per 24 timmar**
- Implementeras i backend med Redis/memory cache
- Lagra antal förfrågningar i Airtable (`Lärare.DirectionsCount`, `Lärare.DirectionsResetTime`)

### Implementation

```typescript
// services/directions.service.ts
async function getTravelTime(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  mode: 'walking' | 'bicycling' | 'transit'
): Promise<TravelTimeResult> {
  // 1. Kolla rate limit
  // 2. Om under limit: anropa Google Directions API
  // 3. Returnera tid i minuter
  // 4. Incrementa counter
}
```

---

## Airtable Schema-ändringar

**VIKTIGT:** Följande tabeller och fält måste skapas manuellt i Airtable innan implementation. Se `docs/AIRTABLE_SCHEMA.md` för fullständig specifikation.

### Nya tabeller att skapa

| Tabell | Syfte |
|--------|-------|
| `AppNotifikationer` | Notifikationer specifikt för appen |
| `PushTokens` | Device tokens för Firebase |
| `Läraransökningar` | Ansökningar från lärare till elever |

### Nya fält i befintliga tabeller

**Lärare-tabellen:**
| Fält | Typ | Beskrivning |
|------|-----|-------------|
| `PasswordHash` | Single line text | Bcrypt-hash (ersätter Lösenord) |
| `DirectionsCount` | Number | Antal Directions API-anrop idag |
| `DirectionsResetTime` | Date | När countern nollställs |
| `RefreshToken` | Single line text | JWT refresh token |
| `LastLogin` | Date | Senaste inloggning |

**Elev-tabellen:**
| Fält | Typ | Beskrivning |
|------|-----|-------------|
| `Önskar` | Link to Lärare | Lärare som ansökt om eleven |

---

## Utvecklingsfaser

### Fas 1: Projektsetup (Prio: KRITISK)
- [ ] Initiera Expo-projekt med TypeScript
- [ ] Konfigurera NativeWind/Tailwind
- [ ] Konfigurera Expo Router
- [ ] Sätta upp Zustand stores
- [ ] Sätta upp TanStack Query
- [ ] Skapa färgpalett (placeholders)
- [ ] Skapa bas-komponenter (Button, Input, Card, Modal)

### Fas 2: Backend API (Prio: KRITISK)
- [ ] Skapa Express.js-server
- [ ] Implementera Airtable-integration
- [ ] Implementera JWT-autentisering
- [ ] Skapa API-endpoints för:
  - [ ] Auth (login, register, refresh)
  - [ ] Lärare (profil, uppdatera)
  - [ ] Elever (lista, detaljer)
  - [ ] Lektioner (CRUD)
  - [ ] Notifikationer (lista, markera läst)
  - [ ] Directions (med rate limiting)

### Fas 3: Autentisering (Prio: KRITISK)
- [ ] Login-skärm
- [ ] Onboarding-flöde (alla 6 steg)
- [ ] JWT-hantering i appen
- [ ] Protected routes
- [ ] Auto-login vid app-start

### Fas 4: Dashboard (Prio: HÖG)
- [ ] Header med notifikationsklocka
- [ ] Notifikationslista
- [ ] Nästa lektion-kort
- [ ] Toggle kommande/senaste
- [ ] NotificationActionModal

### Fas 5: Lektionshantering (Prio: HÖG)
- [ ] LessonCard-komponent
- [ ] LessonList-komponent
- [ ] Rapporteringsformulär
- [ ] Ombokning-modal
- [ ] Skapa lektion (inkl. återkommande)
- [ ] Avsluta lektioner

### Fas 6: Elevprofil (Prio: MEDIUM)
- [ ] Profilvy med vårdnadshavare-info
- [ ] Lektionshistorik
- [ ] Anteckningar (redigerbar)
- [ ] Terminsmål (redigerbar)
- [ ] Boka lektion-knapp

### Fas 7: Hitta elever (Prio: MEDIUM)
- [ ] Google Maps-integration
- [ ] Visa lärarens position
- [ ] Visa elever på kartan
- [ ] Instrumentfilter
- [ ] Elev-infokort
- [ ] Ansökningsflöde
- [ ] Google Directions-integration (rate limited)

### Fas 8: Push Notifications (Prio: MEDIUM)
- [ ] Firebase-setup
- [ ] Registrera device tokens
- [ ] Ta emot notifikationer
- [ ] Badge-hantering

### Fas 9: Polish & Deploy (Prio: LÅGT)
- [ ] Error handling överallt
- [ ] Loading states
- [ ] Empty states
- [ ] App Store-förberedelse
- [ ] Google Play-förberedelse
- [ ] TestFlight/intern testning

---

## Kommandon

```bash
# Installera dependencies
npm install

# Starta utvecklingsserver
npx expo start

# Kör på iOS-simulator
npx expo run:ios

# Kör på Android-emulator
npx expo run:android

# Bygg för produktion
eas build --platform all

# Submita till stores
eas submit --platform ios
eas submit --platform android
```

---

## Design-tokens (Placeholder)

```typescript
// src/utils/colors.ts
export const COLORS = {
  // Primärfärger (PLACEHOLDER - byt ut)
  primary: '#4CAF50',      // Grön (från design)
  primaryDark: '#388E3C',
  primaryLight: '#C8E6C9',

  // Sekundärfärger
  secondary: '#FF9800',    // Orange (från design)
  secondaryDark: '#F57C00',

  // Semantiska färger
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Neutrala
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',

  // Övrigt
  white: '#FFFFFF',
  black: '#000000',
};
```

---

## Kontakt

**Musikglädjen AB**
- Webb: musikgladjen.se
- E-post: info@musikgladjen.se

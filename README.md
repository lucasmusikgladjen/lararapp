# Musikglädjen - Lärarappen

En React Native-app (Expo) för Musikglädjens instrumentlärare. Appen möjliggör lektionshantering, elevprofiler och centraliserad kommunikation.

> **⚠️ OBS för LLM-assistenter (Claude, GPT, etc.):**
> Detta README kan vara föråldrat. För aktuell och detaljerad projektinformation, se dokumenten i `docs/`-mappen:
> - `docs/CLAUDE.md` - Kodinstruktioner, konventioner och tech stack
> - `docs/AIRTABLE_SCHEMA.md` - Databasschema
> - `docs/findings.md` - Arkitekturbeslut och aktuella mönster
> - `docs/progress.md` - Implementeringsstatus
> - `docs/style_guide.md` - UI/styling-guide
>
> Vid konflikt mellan detta README och `docs/`-mappen ska `docs/` alltid prioriteras.

---

## Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| Framework | Expo (managed workflow) |
| Navigation | Expo Router |
| Språk | TypeScript |
| State Management | Zustand |
| Data Fetching | TanStack Query |
| Styling | NativeWind (Tailwind CSS) |
| Databas | Airtable (via backend proxy) |
| Backend | Express.js |

---

## Projektstruktur

```
lararapp/
├── frontend/                     # Expo React Native-app
│   ├── app/                      # Expo Router routes
│   │   ├── (auth)/               # Skyddade routes
│   │   │   ├── find-students.tsx
│   │   │   ├── lessons.tsx
│   │   │   └── student/[id].tsx  # Elevprofil
│   │   ├── (public)/             # Publika routes
│   │   │   ├── login.tsx
│   │   │   └── onboarding/
│   │   └── _layout.tsx
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/        # DashboardHeader, ScheduleCard, etc.
│   │   │   ├── lessons/          # NextLessonCard, ExpandableLessonCard, etc.
│   │   │   ├── students/         # GuardianCard, NoteCard, StudentCard
│   │   │   └── ui/               # TabToggle, etc.
│   │   ├── hooks/                # useAuth, useStudents, useStudentMutation
│   │   ├── services/             # auth.service, student.service
│   │   ├── store/                # authStore (Zustand)
│   │   ├── types/                # TypeScript-typer
│   │   └── utils/                # Hjälpfunktioner
│   │
│   ├── app.json
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                      # Express.js API
│   ├── src/
│   │   ├── controllers/          # auth, profile, student
│   │   ├── middlewares/          # JWT-autentisering
│   │   ├── routes/               # API-routes
│   │   ├── services/             # airtable, teacher, student
│   │   ├── validations/          # express-validator regler
│   │   ├── types/                # TypeScript-typer
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
│
├── docs/                         # Dokumentation (prioriterad källa)
│   ├── CLAUDE.md                 # LLM-instruktioner
│   ├── AIRTABLE_SCHEMA.md        # Databasschema
│   ├── findings.md               # Arkitekturnoteringar
│   ├── progress.md               # Implementeringsstatus
│   ├── style_guide.md            # UI-guide
│   └── references/               # Design-mockups
│
└── README.md
```

---

## Implementerad funktionalitet

### Backend
- JWT-autentisering med bcrypt
- Airtable-integration för Lärare, Elev och Lektioner
- Filtrering så lärare endast ser egna elever
- PATCH-stöd för uppdatering av elevprofil (anteckningar, terminsmål)
- Express-validator för request-validering

### Frontend
- Login med JWT-token i SecureStore
- Dashboard med schema-toggle (kommande/senaste)
- Elevprofil med vårdnadshavare-info, anteckningar och lektionshistorik
- Expanderbara lektionskort med actions
- NativeWind-styling enligt style_guide.md

### Pågående
- Rapporteringsflöde för lektioner

### Planerat
- Elevkarta med Google Directions
- Push-notifikationer

---

## Komma igång

### Förutsättningar
- Node.js 18+
- Expo CLI
- iOS-simulator / Android-emulator eller Expo Go

### Installation

```bash
# Backend
cd backend
npm install
cp .env.example .env  # Konfigurera miljövariabler
npm run dev

# Frontend (i separat terminal)
cd frontend
npm install
npx expo start
```

### Miljövariabler

**Backend (.env):**
```env
AIRTABLE_API_KEY=patXXXXXX
AIRTABLE_BASE_ID=appXXXXXX
JWT_SECRET=din_hemliga_nyckel
```

**Frontend (.env):**
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

---

## Dokumentation

Se `docs/`-mappen för detaljerad dokumentation:

| Fil | Innehåll |
|-----|----------|
| `CLAUDE.md` | Tekniska instruktioner, kodkonventioner, API-endpoints |
| `AIRTABLE_SCHEMA.md` | Databasstruktur och fältmappningar |
| `findings.md` | Arkitekturbeslut och implementeringsmönster |
| `progress.md` | Aktuell implementeringsstatus |
| `style_guide.md` | Färger, spacing och UI-komponenter |

---

## Kontakt

**Musikglädjen AB**
- Webb: musikgladjen.se
- E-post: info@musikgladjen.se

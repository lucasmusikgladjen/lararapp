# Task Plan: Dashboard UI Implementation

## Mål
Bygga om Dashboarden (`app/(auth)/index.tsx`) för att exakt matcha designen i referensbilderna med NativeWind.

## Definition of Done (DoD)
- [x] Header med logo, "Dashboard"-titel och notifikationsklocka.
- [x] Välkomstbox: "Välkommen tillbaka, [Namn]!".
- [x] Orange action-banner: "Glöm inte att rapportera!" med megaphone-ikon.
- [x] "Nästa lektion"-sektion med grön "IDAG"/"IMORGON"-badge och elevkort.
- [x] "Ditt schema"-sektion med en fungerande Toggle (Kommande/Senaste).
- [x] Scrollbar lista med elevkort som matchar designen (Avatar, Namn, Datum, Tid, Instrument).
- [x] All styling använder NativeWind och följer färgtemat i bilderna.
- [x] Style guide dokumenterad i `docs/style_guide.md`.

## Nya komponenter
- `src/components/dashboard/DashboardHeader.tsx`
- `src/components/dashboard/ReportBanner.tsx`
- `src/components/dashboard/SchemaToggle.tsx`
- `src/components/dashboard/ScheduleCard.tsx`

## Uppdaterade filer
- `src/components/lessons/NextLessonCard.tsx` – Omdesignad för att matcha referensbilden.
- `src/utils/lessonHelpers.ts` – Ny `getAllLessonEvents`-funktion.
- `app/(auth)/index.tsx` – Helt ombyggd Dashboard-vy.
- `app/(auth)/_layout.tsx` – Dold header, tab-ikoner.
- `tailwind.config.js` – Brand-färger tillagda.

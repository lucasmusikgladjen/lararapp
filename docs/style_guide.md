# Style Guide – Musikglädjen Lärarappen

Dokumentation av färger, spacings och komponentstilar baserat på Dashboard-designen.

---

## Färgpalett

### Brand-färger (definierade i `tailwind.config.js`)

| Token           | Hex       | Tailwind-klass     | Användning                                     |
| --------------- | --------- | ------------------ | ---------------------------------------------- |
| `brand-orange`  | `#F97316` | `bg-brand-orange`  | Rapport-banner, instrument-text i schema-kort  |
| `brand-green`   | `#34C759` | `bg-brand-green`   | IDAG/IMORGON-badge, aktiv toggle-knapp         |
| `brand-bg`      | `#F5F5F7` | `bg-brand-bg`      | Bakgrundsfärg för hela Dashboard-vyn           |

### Semantiska färger

| Kontext              | Tailwind-klass         | Hex       |
| -------------------- | ---------------------- | --------- |
| Primär text          | `text-slate-900`       | `#0F172A` |
| Sekundär text        | `text-slate-800`       | `#1E293B` |
| Subtil text          | `text-gray-400`        | `#9CA3AF` |
| Kort-bakgrund        | `bg-white`             | `#FFFFFF` |
| Kort-border          | `border-gray-100`      | `#F3F4F6` |
| Divider (schema)     | `border-gray-100`      | `#F3F4F6` |
| Toggle inaktiv bg    | `bg-gray-100`          | `#F3F4F6` |
| Toggle inaktiv text  | `text-gray-500`        | `#6B7280` |
| Banner text primär   | `text-white`           | `#FFFFFF` |
| Banner text sekundär | `text-white/70`        | `rgba(255,255,255,0.7)` |
| Tab aktiv            | —                      | `#F97316` |
| Tab inaktiv          | —                      | `#9CA3AF` |

---

## Typografi

| Element                     | Tailwind-klasser                      |
| --------------------------- | ------------------------------------- |
| Dashboard-titel (header)    | `text-xl font-bold text-slate-900`    |
| Välkomstmeddelande          | `text-lg font-semibold text-slate-800`|
| Sektionsrubrik              | `text-xl font-bold text-slate-900`    |
| Banner rubrik               | `text-base font-bold text-white`      |
| Banner undertext            | `text-sm text-white/70`               |
| Nästa lektion – datum       | `text-lg font-bold text-slate-900`    |
| Nästa lektion – detaljer    | `text-sm text-gray-400`               |
| Badge-text                  | `text-xs font-bold text-white`        |
| Schema-kort – namn          | `text-base font-bold text-slate-900`  |
| Schema-kort – datum/tid     | `text-sm text-gray-400`               |
| Schema-kort – instrument    | `text-sm font-semibold text-brand-orange` |
| Toggle-text aktiv           | `text-sm font-semibold text-white`    |
| Toggle-text inaktiv         | `text-sm font-semibold text-gray-500` |

---

## Spacing & Geometri

### Border Radius

| Komponent            | Tailwind-klass | Värde  |
| -------------------- | -------------- | ------ |
| Välkomstbox          | `rounded-2xl`  | 16px   |
| Rapport-banner       | `rounded-2xl`  | 16px   |
| Nästa lektion-kort   | `rounded-3xl`  | 24px   |
| Schema-container     | `rounded-3xl`  | 24px   |
| Badge (IDAG)         | `rounded-full` | 9999px |
| Toggle               | `rounded-full` | 9999px |
| Avatarer             | `rounded-full` | 9999px |
| Chevron-cirkel       | `rounded-full` | 9999px |

### Avatarstorlekar

| Plats                | Tailwind-klass | Storlek |
| -------------------- | -------------- | ------- |
| Nästa lektion        | `w-16 h-16`   | 64×64   |
| Schema-kort          | `w-14 h-14`   | 56×56   |
| Header-logotyp       | `w-10 h-10`   | 40×40   |

### Padding & Margins

| Komponent              | Klass(er)                |
| ---------------------- | ------------------------ |
| Vy-horisontell padding | `px-5` (20px)            |
| Välkomstbox            | `py-4 px-6`             |
| Rapport-banner         | `px-5 py-4`             |
| Nästa lektion-kort     | `p-5` (20px)            |
| Schema-kort            | `py-4 px-5`             |
| Mellanrum under banner | `mb-6`                  |
| Mellanrum under sektion| `mb-6`                  |
| Mellanrum under rubrik | `mb-3`                  |

---

## Skuggor

Alla kort använder `shadow-sm` från Tailwind, som i React Native motsvarar:

```js
{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
}
```

---

## Komponentöversikt

### `DashboardHeader`
- **Fil:** `src/components/dashboard/DashboardHeader.tsx`
- Vinyl-logotyp (vänster), "Dashboard" (center), klocka (höger)
- Layout: `flex-row items-center justify-between`

### `ReportBanner`
- **Fil:** `src/components/dashboard/ReportBanner.tsx`
- Orange `TouchableOpacity` med megafon-ikon, text och chevron
- Ikon-rotation: `transform: [{ rotate: '-15deg' }]`
- Chevron i semi-transparent cirkel: `rgba(255,255,255,0.25)`

### `NextLessonCard`
- **Fil:** `src/components/lessons/NextLessonCard.tsx`
- Avatar (vänster) | Datum + veckodag + instrument (center) | Badge (höger)
- Datum formateras som "Januari 23"
- Tidsintervall beräknas: startTid → +1 timme
- Badge-logik: 0 dagar → "IDAG", 1 dag → "IMORGON", annars → "X DAGAR"

### `SchemaToggle`
- **Fil:** `src/components/dashboard/SchemaToggle.tsx`
- Pill-formad toggle med "Kommande" / "Senaste"
- Aktiv flik: `bg-brand-green text-white`
- Inaktiv flik: transparent, `text-gray-500`

### `ScheduleCard`
- **Fil:** `src/components/dashboard/ScheduleCard.tsx`
- Avatar | Namn + datum/tid + instrument | Chevron
- Datum format: "Fredag 23 Jan - 15:00"
- Divider: `border-b border-gray-100` (ej på sista kortet)

---

## Ikonreferens

| Användning       | Ionicons-namn            | Storlek | Färg    |
| ---------------- | ------------------------ | ------- | ------- |
| Klocka (header)  | `notifications-outline`  | 24      | #1E293B |
| Megafon (banner) | `megaphone`              | 28      | white   |
| Pil (banner)     | `chevron-forward`        | 18      | white   |
| Pil (schema)     | `chevron-forward`        | 20      | #D1D5DB |
| Tab: Dashboard   | `grid-outline`           | —       | tab tint|
| Tab: Hitta elever| `map-outline`            | —       | tab tint|
| Tab: Elever      | `people-outline`         | —       | tab tint|
| Tab: Inställningar| `settings-outline`      | —       | tab tint|
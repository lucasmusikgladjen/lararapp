# Claude Instruktioner - Musikglädjen Lärarappen

Detta dokument innehåller instruktioner för LLM-assistenter (Claude, GPT, etc.) som arbetar med detta projekt.

---

## Projektöversikt

**Vad:** En React Native-app (Expo) för Musikglädjens instrumentlärare
**Syfte:** Lektionshantering, elevmatchning, rapportering och kommunikation
**Språk:** Svenska (UI och kod-kommentarer)

---

## Kritiska regler

### 1. SÄKERHET - Exponera ALDRIG API-nycklar

```typescript
// ❌ FEL - Exponerar API-nyckel i klienten
const AIRTABLE_KEY = 'patXXXXXX';
fetch(`https://api.airtable.com/v0/...`, {
  headers: { Authorization: `Bearer ${AIRTABLE_KEY}` }
});

// ✅ RÄTT - Använd backend proxy
fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/students`);
```

### 2. Använd ENDAST specad tech stack

| Kategori | Använd | Använd INTE |
|----------|--------|-------------|
| Styling | NativeWind | StyleSheet, styled-components |
| State | Zustand | Redux, Context API (för global state) |
| Data fetching | TanStack Query | SWR, vanilla fetch |
| Forms | React Hook Form + Zod | Formik, yup |
| Navigation | Expo Router | React Navigation direkt |

### 3. TypeScript är obligatoriskt

```typescript
// ❌ FEL
function getStudent(id) {
  return api.get(`/students/${id}`);
}

// ✅ RÄTT
interface Student {
  id: string;
  displayId: string;
  instrument: string;
  latitude: number;
  longitude: number;
}

async function getStudent(id: string): Promise<Student> {
  return api.get<Student>(`/students/${id}`);
}
```

### 4. Elev-ID, INTE namn (GDPR)

Lärare får ENDAST se namn på sina egna elever. För andra elever (t.ex. i FindStudents), visa endast anonymiserat ID.

```typescript
// ❌ FEL
<Text>{student.namn}</Text>

// ✅ RÄTT - För icke-egna elever
<Text>Elev: {student.displayId}</Text>

// ✅ RÄTT - För egna elever (kontrollera först)
{isOwnStudent && <Text>{student.namn}</Text>}
```

---

## Filstruktur och konventioner

### Namngivning

| Typ | Konvention | Exempel |
|-----|------------|---------|
| Komponenter | PascalCase | `LessonCard.tsx` |
| Hooks | camelCase med `use` | `useLessons.ts` |
| Stores | camelCase med `Store` | `authStore.ts` |
| Services | camelCase med `.service` | `lessons.service.ts` |
| Types | PascalCase med `.types` | `lesson.types.ts` |
| Utils | camelCase | `formatters.ts` |

### Komponentstruktur

```typescript
// src/components/lessons/LessonCard.tsx

import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import type { Lesson } from '@/types/lesson.types';

interface LessonCardProps {
  lesson: Lesson;
  onPress?: () => void;
  variant?: 'compact' | 'full';
}

export function LessonCard({ lesson, onPress, variant = 'full' }: LessonCardProps) {
  const router = useRouter();

  const handlePress = () => {
    onPress?.();
    router.push(`/student/${lesson.studentId}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-surface rounded-lg p-4 shadow-sm"
    >
      <Text className="text-lg font-semibold text-text">
        {lesson.displayStudentId}
      </Text>
      <Text className="text-sm text-textSecondary">
        {lesson.date} - {lesson.time}
      </Text>
    </Pressable>
  );
}
```

### Zustand Store

```typescript
// src/store/authStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import type { Teacher } from '@/types/teacher.types';

interface AuthState {
  user: Teacher | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(email, password);
          await SecureStore.setItemAsync('token', response.token);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        await SecureStore.deleteItemAsync('token');
        set({ user: null, isAuthenticated: false });
      },

      refreshToken: async () => {
        // Implementera token refresh
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
```

### TanStack Query Hook

```typescript
// src/hooks/useLessons.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsService } from '@/services/lessons.service';
import type { Lesson, CreateLessonInput } from '@/types/lesson.types';

export function useLessons(teacherId: string) {
  return useQuery({
    queryKey: ['lessons', teacherId],
    queryFn: () => lessonsService.getLessons(teacherId),
    staleTime: 1000 * 60 * 5, // 5 minuter
  });
}

export function useUpcomingLessons(teacherId: string, limit = 5) {
  return useQuery({
    queryKey: ['lessons', teacherId, 'upcoming', limit],
    queryFn: () => lessonsService.getUpcomingLessons(teacherId, limit),
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLessonInput) => lessonsService.createLesson(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}

export function useReportLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      notes,
      homework
    }: {
      lessonId: string;
      notes: string;
      homework: string;
    }) => lessonsService.reportLesson(lessonId, notes, homework),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}
```

### Service Layer

```typescript
// src/services/lessons.service.ts

import { api } from './api';
import type { Lesson, CreateLessonInput, ReportLessonInput } from '@/types/lesson.types';

export const lessonsService = {
  async getLessons(teacherId: string): Promise<Lesson[]> {
    const response = await api.get<Lesson[]>(`/teachers/${teacherId}/lessons`);
    return response.data;
  },

  async getUpcomingLessons(teacherId: string, limit: number): Promise<Lesson[]> {
    const response = await api.get<Lesson[]>(
      `/teachers/${teacherId}/lessons/upcoming?limit=${limit}`
    );
    return response.data;
  },

  async createLesson(input: CreateLessonInput): Promise<Lesson> {
    const response = await api.post<Lesson>('/lessons', input);
    return response.data;
  },

  async createRecurringLessons(input: CreateLessonInput & {
    endDate: string;
    frequency: 'weekly'
  }): Promise<Lesson[]> {
    const response = await api.post<Lesson[]>('/lessons/recurring', input);
    return response.data;
  },

  async reportLesson(
    lessonId: string,
    notes: string,
    homework: string
  ): Promise<Lesson> {
    const response = await api.patch<Lesson>(`/lessons/${lessonId}/report`, {
      notes,
      homework,
      completed: true,
      completedAt: new Date().toISOString(),
    });
    return response.data;
  },

  async rescheduleLesson(lessonId: string, newDate: string, newTime: string): Promise<Lesson> {
    const response = await api.patch<Lesson>(`/lessons/${lessonId}/reschedule`, {
      date: newDate,
      time: newTime,
    });
    return response.data;
  },

  async cancelLesson(lessonId: string, reason: string): Promise<void> {
    await api.delete(`/lessons/${lessonId}`, { data: { reason } });
  },
};
```

---

## API Endpoints (Backend)

Backend ska exponera följande endpoints. Alla kräver JWT-autentisering förutom `/auth/*`.

### Auth

| Method | Endpoint | Beskrivning |
|--------|----------|-------------|
| POST | `/api/auth/login` | Logga in, returnerar JWT |
| POST | `/api/auth/register` | Registrera ny lärare |
| POST | `/api/auth/refresh` | Förnya JWT token |
| POST | `/api/auth/logout` | Invalidera refresh token |

### Teachers (Lärare)

| Method | Endpoint | Beskrivning |
|--------|----------|-------------|
| GET | `/api/teachers/me` | Hämta inloggad lärares profil |
| PATCH | `/api/teachers/me` | Uppdatera profil |
| POST | `/api/teachers/me/documents` | Ladda upp belastningsregister |

### Students (Elever)

| Method | Endpoint | Beskrivning |
|--------|----------|-------------|
| GET | `/api/students` | Lista lärarens egna elever |
| GET | `/api/students/:id` | Hämta specifik elev (endast egna) |
| GET | `/api/students/available` | Lista tillgängliga elever för matchning |
| POST | `/api/students/:id/apply` | Ansök om elev |

### Lessons (Lektioner)

| Method | Endpoint | Beskrivning |
|--------|----------|-------------|
| GET | `/api/lessons` | Lista alla lektioner |
| GET | `/api/lessons/upcoming` | Kommande lektioner |
| GET | `/api/lessons/past` | Tidigare lektioner |
| POST | `/api/lessons` | Skapa ny lektion |
| POST | `/api/lessons/recurring` | Skapa återkommande lektioner |
| PATCH | `/api/lessons/:id/report` | Rapportera genomförd lektion |
| PATCH | `/api/lessons/:id/reschedule` | Boka om lektion |
| DELETE | `/api/lessons/:id` | Ta bort lektion |
| DELETE | `/api/lessons/student/:studentId/future` | Ta bort alla framtida för elev |

### Notifications (Notifikationer)

| Method | Endpoint | Beskrivning |
|--------|----------|-------------|
| GET | `/api/notifications` | Lista notifikationer |
| PATCH | `/api/notifications/:id/read` | Markera som läst |
| POST | `/api/notifications/push-token` | Registrera Firebase token |

### Directions

| Method | Endpoint | Beskrivning |
|--------|----------|-------------|
| GET | `/api/directions` | Hämta restid (rate limited: 10/24h) |

---

## Notifikationssystem Implementation

### NotificationActionModal

Denna komponent är kritisk för UX:en. Den ska visa relevant innehåll baserat på notifikationstypen.

```typescript
// src/components/notifications/NotificationActionModal.tsx

import { Modal, View, Text } from 'react-native';
import type { AppNotification } from '@/types/notification.types';
import { LessonReportForm } from '@/components/lessons/LessonReportForm';
import { StudentMatchCard } from '@/components/students/StudentMatchCard';
import { DocumentUploadForm } from '@/components/documents/DocumentUploadForm';
import { SalaryDetails } from '@/components/salary/SalaryDetails';
import { LessonDetails } from '@/components/lessons/LessonDetails';
import { GeneralMessage } from '@/components/notifications/GeneralMessage';

interface NotificationActionModalProps {
  notification: AppNotification | null;
  visible: boolean;
  onClose: () => void;
  onActionComplete: () => void;
}

export function NotificationActionModal({
  notification,
  visible,
  onClose,
  onActionComplete,
}: NotificationActionModalProps) {
  if (!notification) return null;

  const renderContent = () => {
    switch (notification.type) {
      case 'UNREPORTED_LESSON':
        return (
          <LessonReportForm
            lessonId={notification.metadata.lessonId}
            onSuccess={() => {
              onActionComplete();
              onClose();
            }}
          />
        );

      case 'NEW_MATCH':
        return (
          <StudentMatchCard
            studentId={notification.metadata.studentId}
            onConfirm={() => {
              onActionComplete();
              onClose();
            }}
            onDecline={onClose}
          />
        );

      case 'NEW_STUDENT_NEARBY':
        // Navigera till FindStudents istället för modal
        router.push('/find-students');
        onClose();
        return null;

      case 'MISSING_BELASTNINGSREGISTER':
        return (
          <DocumentUploadForm
            onSuccess={() => {
              onActionComplete();
              onClose();
            }}
          />
        );

      case 'SALARY_AVAILABLE':
        return (
          <SalaryDetails
            periodId={notification.metadata.periodId}
            onClose={onClose}
          />
        );

      case 'LESSON_REMINDER':
        return (
          <LessonDetails
            lessonId={notification.metadata.lessonId}
            onClose={onClose}
          />
        );

      case 'GENERAL_MESSAGE':
        return (
          <GeneralMessage
            title={notification.title}
            message={notification.message}
            onClose={onClose}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background p-4">
        {renderContent()}
      </View>
    </Modal>
  );
}
```

---

## Google Directions Rate Limiting

### Frontend Hook

```typescript
// src/hooks/useDirections.ts

import { useQuery } from '@tanstack/react-query';
import { directionsService } from '@/services/directions.service';
import { useAuthStore } from '@/store/authStore';

export function useDirections(
  destination: { lat: number; lng: number } | null,
  mode: 'walking' | 'bicycling' | 'transit' = 'transit'
) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['directions', destination, mode],
    queryFn: () => directionsService.getTravelTime(destination!, mode),
    enabled: !!destination && !!user,
    staleTime: 1000 * 60 * 60, // 1 timme (cache aggressivt)
    retry: false, // Försök inte igen vid rate limit error
    meta: {
      errorMessage: 'Du har nått maxgränsen för restidsberäkningar idag (10/dag)',
    },
  });
}
```

### Backend Endpoint

```typescript
// Backend: /api/directions

app.get('/api/directions', authMiddleware, async (req, res) => {
  const { destLat, destLng, mode } = req.query;
  const teacherId = req.user.id;

  // Hämta lärarens rate limit data från Airtable
  const teacher = await airtable.getTeacher(teacherId);

  const now = new Date();
  const resetTime = teacher.DirectionsResetTime
    ? new Date(teacher.DirectionsResetTime)
    : null;

  // Reset counter om det är en ny dag
  if (!resetTime || now > resetTime) {
    await airtable.updateTeacher(teacherId, {
      DirectionsCount: 0,
      DirectionsResetTime: endOfDay(now).toISOString(),
    });
    teacher.DirectionsCount = 0;
  }

  // Kolla rate limit
  if (teacher.DirectionsCount >= 10) {
    return res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Du har nått maxgränsen för restidsberäkningar (10/dag)',
      resetTime: teacher.DirectionsResetTime,
    });
  }

  // Anropa Google Directions API
  const result = await googleDirections.getRoute({
    origin: { lat: teacher.Latitude, lng: teacher.Longitude },
    destination: { lat: parseFloat(destLat), lng: parseFloat(destLng) },
    mode,
  });

  // Incrementa counter
  await airtable.updateTeacher(teacherId, {
    DirectionsCount: teacher.DirectionsCount + 1,
  });

  return res.json({
    duration: result.duration,
    durationText: result.durationText,
    distance: result.distance,
    distanceText: result.distanceText,
    remainingRequests: 10 - (teacher.DirectionsCount + 1),
  });
});
```

---

## Formulärvalidering med Zod

```typescript
// src/utils/validators.ts

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Ogiltig e-postadress'),
  password: z.string().min(1, 'Lösenord krävs'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'Förnamn måste vara minst 2 tecken'),
  lastName: z.string().min(2, 'Efternamn måste vara minst 2 tecken'),
  email: z.string().email('Ogiltig e-postadress'),
  password: z
    .string()
    .min(8, 'Lösenord måste vara minst 8 tecken')
    .regex(/[A-Z]/, 'Lösenord måste innehålla minst en versal')
    .regex(/[0-9]/, 'Lösenord måste innehålla minst en siffra'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Lösenorden matchar inte',
  path: ['confirmPassword'],
});

export const lessonReportSchema = z.object({
  notes: z.string().max(2000, 'Anteckningar får vara max 2000 tecken').optional(),
  homework: z.string().max(1000, 'Läxa får vara max 1000 tecken').optional(),
});

export const createLessonSchema = z.object({
  studentId: z.string().min(1, 'Välj en elev'),
  date: z.string().min(1, 'Välj ett datum'),
  time: z.string().min(1, 'Välj en tid'),
  duration: z.enum(['45-60 min', '90 min', '120 min']),
  isRecurring: z.boolean(),
  endDate: z.string().optional(),
}).refine((data) => {
  if (data.isRecurring && !data.endDate) {
    return false;
  }
  return true;
}, {
  message: 'Välj slutdatum för återkommande lektioner',
  path: ['endDate'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LessonReportInput = z.infer<typeof lessonReportSchema>;
export type CreateLessonInput = z.infer<typeof createLessonSchema>;
```

---

## NativeWind Tailwind Config

```javascript
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // PLACEHOLDER - Byt ut mot riktiga färger
        primary: {
          DEFAULT: '#4CAF50',
          dark: '#388E3C',
          light: '#C8E6C9',
        },
        secondary: {
          DEFAULT: '#FF9800',
          dark: '#F57C00',
        },
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
        background: '#F5F5F5',
        surface: '#FFFFFF',
        text: '#212121',
        textSecondary: '#757575',
        border: '#E0E0E0',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
```

---

## Utvecklingsordning

Följ denna ordning för att undvika blockerande beroenden:

### Steg 1: Setup (MÅSTE göras först)
1. Initiera Expo med TypeScript: `npx create-expo-app@latest --template blank-typescript`
2. Installera dependencies (se package.json nedan)
3. Konfigurera NativeWind
4. Konfigurera Expo Router
5. Skapa `src/` mappstruktur
6. Skapa `src/utils/colors.ts` med placeholder-färger

### Steg 2: Typer
1. Skapa alla `.types.ts` filer i `src/types/`
2. Definiera interfaces för alla entiteter

### Steg 3: API-lager
1. Skapa `src/services/api.ts` med axios/fetch konfiguration
2. Skapa alla service-filer

### Steg 4: State & Hooks
1. Skapa Zustand stores
2. Skapa TanStack Query hooks

### Steg 5: UI-komponenter
1. Skapa bas-komponenter (`src/components/ui/`)
2. Skapa layout-komponenter

### Steg 6: Routes & Sidor
1. Skapa `app/_layout.tsx` (root)
2. Skapa `app/(public)/` routes
3. Skapa `app/(auth)/` routes

### Steg 7: Feature-komponenter
1. Implementera notifications-komponenter
2. Implementera lessons-komponenter
3. Implementera students-komponenter

### Steg 8: Integration
1. Koppla ihop allt
2. Testa flöden

---

## Package.json Dependencies

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-image-picker": "~16.0.0",
    "expo-location": "~18.0.0",
    "react": "18.3.1",
    "react-native": "0.76.0",
    "react-native-maps": "1.18.0",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.1.0",
    "nativewind": "^4.0.0",
    "tailwindcss": "^3.4.0",
    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.0.0",
    "@hookform/resolvers": "^3.0.0",
    "zod": "^3.0.0",
    "axios": "^1.0.0",
    "@react-native-firebase/app": "^21.0.0",
    "@react-native-firebase/messaging": "^21.0.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "~18.3.0",
    "typescript": "~5.3.0"
  }
}
```

---

## Vanliga fel att undvika

### 1. Glöm inte `className` istället för `style`

```tsx
// ❌ FEL
<View style={{ padding: 16, backgroundColor: '#fff' }}>

// ✅ RÄTT
<View className="p-4 bg-surface">
```

### 2. Glöm inte att wrappa med QueryClientProvider

```tsx
// app/_layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  );
}
```

### 3. Använd SecureStore för tokens, INTE AsyncStorage

```tsx
// ❌ FEL
await AsyncStorage.setItem('token', jwt);

// ✅ RÄTT
await SecureStore.setItemAsync('token', jwt);
```

### 4. Glöm inte error handling i mutations

```tsx
const { mutate, isPending, error } = useCreateLesson();

// Visa error till användaren
{error && <Text className="text-error">{error.message}</Text>}
```

---

## Referensdesign

Titta i `/docs/references/` för mockups av varje sida:
- `Dashboard/` - Kommande/senaste lektioner
- `FindStudents/` - Elevkarta
- `Login/` - Login-skärm
- `LessonHandler/` - Lektionshantering
- `Onboarding/` - Registreringsflöde
- `StudentProfile/` - Elevprofil

Följ designen så nära som möjligt men använd placeholder-färger tills finala färger bestäms.

---

## Frågor?

Om något är oklart, fråga användaren innan du implementerar. Det är bättre att fråga än att gissa fel.

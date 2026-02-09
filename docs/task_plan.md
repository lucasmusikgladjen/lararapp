# Task Plan: Implementation av Registrering & Inloggning (Frontend)

## Mål
Skapa ett användarvänligt flöde för att registrera nya lärare direkt i appen, kopplat till vårt nya backend-API.

## Definition of Done (DoD)
- [ ] **Skärm:** Skapa `app/(public)/register.tsx` (utanför auth-skyddet).
- [ ] **Formulär:** Implementera formulär med fälten: Namn, E-post, Lösenord, Adress, Postnummer, Ort, Födelseår.
- [ ] **Validering:** Använd `zod` och `react-hook-form` för att validera att alla fält är ifyllda och att e-post är giltig.
- [ ] **API-koppling:** Använd `axios` för att anropa `POST /register`.
- [ ] **Felhantering:** Visa tydliga felmeddelanden om e-posten redan finns (409 Conflict) eller om något annat går fel.
- [ ] **Auto-login:** Vid succé (201), spara den returnerade token i `SecureStore` och dirigera användaren direkt till Dashboarden (samma logik som login).
- [ ] **UI:** Följ designsystemet (Brand Orange knappar, tydliga inputs).
- [ ] **Navigation:** Lägg till länk "Skapa konto" på inloggningssidan (`app/(public)/index.tsx`).

## Datastruktur (Frontend DTO)
```typescript
type RegisterForm = {
  name: string;
  email: string;
  password: string;
  address: string;
  zip: string;
  city: string;
  birthYear: string;
}
# Task Plan: Hydration & Auth Persistence

## Mål
Implementera säker lagring av autentiseringstoken så att läraren förblir inloggad efter att appen stängts ner eller laddats om.

## Definition of Done (DoD)
- [x] JWT-token lagras i `SecureStore` vid lyckad inloggning.
- [x] `authStore` hämtar lagrad token vid app-start (`loadUser`) och sätter `isAuthenticated`.
- [x] `app/_layout.tsx` omdirigerar automatiskt till `/(auth)` om giltig token hittas vid start.
- [x] `app/_layout.tsx` omdirigerar till `/(public)/login` om token saknas.
- [x] Logout-funktionen rensar både store-state och `SecureStore`.
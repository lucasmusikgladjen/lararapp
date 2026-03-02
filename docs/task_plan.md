# Task Plan: End-to-End Filuppladdning för Notifikationer

## Mål
Implementera logik så att lärare kan ladda upp filer (t.ex. PDF eller bilder på jämkningsblanketter) via notifikations-actionsidan i appen. Filen ska laddas upp till en temporär CDN (Cloudinary) via vår Node.js-backend, och den resulterande länken ska sparas i Airtable-kolumnen `Uploaded File`.

## Arkitektur
* **Frontend:** `expo-document-picker` för att välja fil. Konvertering till `FormData`.
* **Backend:** Express.js med `multer` för att ta emot `multipart/form-data`.
* **CDN:** `cloudinary` för att hosta filen och få en publik URL (som Airtable kräver).
* **Databas:** Airtable SDK via befintlig `PATCH /api/notifications/:id/resolve` endpoint.

## Definition of Done (DoD)

### Fas 1: Backend Setup (Cloudinary & Multer)
- [ ] Installera `multer`, `cloudinary` och `@types/multer`.
- [ ] Skapa `backend/src/services/cloudinary.ts` med konfiguration och en `uploadToCloudinary`-funktion.
- [ ] Skapa `backend/src/middlewares/upload.ts` med multer-konfiguration (lagra i `/tmp` eller minne).
- [ ] Uppdatera `backend/src/routes/notificationRoutes.ts` med `upload.single('document')` på resolve-routen.

### Fas 2: Backend Controller & Service
- [ ] Uppdatera `resolveNotification` i `notification_controller.ts` för att läsa `req.file`.
- [ ] Om fil finns: Ladda upp till Cloudinary, få tillbaka `secure_url`.
- [ ] Uppdatera `notification_service.ts` så att den skickar med url:en till kolumnen `Uploaded File` i Airtable när notisen sätts till `resolved`.

### Fas 3: Frontend UI & Document Picker
- [ ] Installera `expo-document-picker`.
- [ ] Uppdatera `frontend/app/(auth)/notification/[id].tsx` med en UI-komponent (knapp) för att välja fil om `actionPage.showFileUpload` är true.
- [ ] Spara den valda filens URI, namn och typ i lokalt state.

### Fas 4: Frontend API & Integration
- [ ] Uppdatera `frontend/src/services/notification.service.ts` (`resolveNotification`). Om en fil skickas med, byt från `application/json` till `multipart/form-data` och använd `FormData`.
- [ ] Säkerställ att appen navigerar tillbaka till Dashboard efter lyckad uppladdning.

### Fas 5: Dokumentation (Klar)
- [ ] **Uppdatera:** `docs/progress.md`.
- [ ] **Uppdatera:** `docs/findings.md`.
- [ ] **Uppdatera:** `docs/task_plan.md`.
import express from "express";
import { getActiveNotifications, resolve, triggerPushNotification } from "../controllers/notification_controller";
import { validateAccessToken } from "../middlewares/auth/jwt"; // <-- Import the middleware here instead

const router = express.Router();

/**
 * POST /api/notifications/push-webhook
 * Triggered by Airtable. Uses a secret header. Does NOT use JWT.
 */
router.post("/push-webhook", triggerPushNotification);


// =============== PROTECTED APP ROUTES BELOW =============== //

/**
 * GET /api/notifications
 * Hämtar den inloggade lärarens aktiva notiser.
 */
router.get("/", validateAccessToken, getActiveNotifications);

/**
 * PATCH /api/notifications/:id/resolve
 * Markerar en notis som löst (resolved) och sparar eventuella svar.
 */
router.patch("/:id/resolve", validateAccessToken, resolve);

export default router;
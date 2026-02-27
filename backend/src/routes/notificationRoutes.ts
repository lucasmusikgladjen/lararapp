import express from "express";
import { getActiveNotifications, resolve } from "../controllers/notification_controlle";

const router = express.Router();

/**
 * GET /api/notifications
 * Hämtar den inloggade lärarens aktiva notiser.
 */
router.get("/", getActiveNotifications);

/**
 * PATCH /api/notifications/:id/resolve
 * Markerar en notis som löst (resolved) och sparar eventuella svar.
 */
router.patch("/:id/resolve", resolve);

export default router;

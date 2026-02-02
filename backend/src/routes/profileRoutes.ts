import express from "express";
import { getProfile } from "../controllers/profile_controller";

const router = express.Router();

/**
 * GET /
 * Hämtar profilen.
 */
router.get("/", getProfile);

export default router;
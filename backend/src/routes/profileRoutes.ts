import express from "express";
import { getProfile } from "../controllers/profileController";

const router = express.Router();

/**
 * GET /
 * Hämtar profilen.
 */
router.get("/", getProfile);

export default router;
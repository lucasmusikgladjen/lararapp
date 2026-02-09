import express from "express";
import { getProfile, updateProfile } from "../controllers/profile_controller";

const router = express.Router();

/**
 * GET
 * Get the authenticated teachers profile.
 */
router.get("/", getProfile);

/**
 * PATCH
 * Update the authenticated teachers profile.
 *
 */

router.patch("/", updateProfile);

export default router;

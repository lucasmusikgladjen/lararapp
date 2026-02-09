import express from "express";
import { getProfile, updateProfile } from "../controllers/profile_controller";
import { updateProfileRules } from "../validations/teacher_validation";

const router = express.Router();

/**
 * GET
 * Get the authenticated teachers profile.
 */
router.get("/", getProfile);

/**
 * PATCH
 * Update the authenticated teachers profile.
 */
router.patch("/", updateProfileRules, updateProfile);

export default router;

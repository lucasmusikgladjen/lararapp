import express from "express";
import { getProfile, updateProfile, updatePushToken } from "../controllers/profile_controller";
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

/**
 * POST /push-token
 * Updates the teacher's Expo push token
 */
router.post("/push-token", updatePushToken);


export default router;

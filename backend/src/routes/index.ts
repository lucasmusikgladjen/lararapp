import express from "express";
import studentRoutes from "./studentRoutes";
import profileRoutes from "./profileRoutes";
import { login, register } from "../controllers/auth_controller";
import { validateAccessToken } from "../middlewares/auth/jwt";
import { createTeacherRules } from "../validations/teacher_validation";

const router = express.Router();

/**
 * Root endpoint to verify the server is running.
 * Responds with a fun message and a link.
 */
router.get("/", (_req, res) => {
    res.send({
        status: "success",
        message: "But first, let me take a selfie 🤳 https://www.youtube.com/watch?v=kdemFfbS5H0",
    });
});

// ---------- AUTHENTICATION ROUTES ----------

/**
 * Log in a teacher. Requires valid credentials (email & password).
 * This will generate an authentication token for the teacher.
 */
router.post("/login", login);

/**
 * Register a new teacher.
 */
router.post("/register", createTeacherRules, register);

// ---------- PROFILE ROUTES ----------

/**
 * Profile routes require user authentication.
 * Actions for fetching the logged-in teacher's profile.
 */
router.use("/profile", validateAccessToken, profileRoutes);

// ---------- STUDENT ROUTES ----------

/**
 * Routes for managing students.
 * Protected by authentication to ensure only teachers can view students.
 */
router.use("/students", validateAccessToken, studentRoutes);

/**
 * Catch-all route handler for undefined routes.
 * Responds with a 404 error and a helpful message.
 */
router.use((req, res) => {
    // Respond with 404 and a message in JSON-format
    res.status(404).send({
        status: "fail",
        data: {
            message: `Route ${req.method} ${req.path} does not exist`,
        },
    });
});

export default router;

import { Router } from "express";

import studentRouter from "./studentRoutes"

const router = Router();

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

// ---------- STUDENT ROUTE ----------

router.use("/students", studentRouter);



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

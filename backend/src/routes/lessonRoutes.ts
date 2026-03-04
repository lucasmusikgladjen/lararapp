import express from "express";
import { adjustFutureLessons, create, deleteFutureLessons } from "../controllers/lesson_controller";
import { adjustFutureLessonsRules, clearFutureLessonsRules, createLessonRules } from "../validations/lesson_validation";

const router = express.Router();

// POST /lessons
router.post("/", createLessonRules, create);

// DELETE /lessons/future/:studentId
router.delete("/future/:studentId", clearFutureLessonsRules, deleteFutureLessons);

// PATCH / lessons/:studentId
router.patch("/adjust/:studentId", adjustFutureLessonsRules, adjustFutureLessons);

export default router;

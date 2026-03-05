import express from "express";
import { adjustFutureLessons, cancelLesson, completeLesson, create, deleteFutureLessons, rescheduleLesson } from "../controllers/lesson_controller";
import { adjustFutureLessonsRules, cancelLessonRules, clearFutureLessonsRules, completeLessonRules, createLessonRules, rescheduleLessonRules } from "../validations/lesson_validation";

const router = express.Router();

// POST /lessons
router.post("/", createLessonRules, create);

// DELETE /lessons/future/:studentId
router.delete("/future/:studentId", clearFutureLessonsRules, deleteFutureLessons);

// PATCH / lessons/:studentId
router.patch("/adjust/:studentId", adjustFutureLessonsRules, adjustFutureLessons);


// ---------- INDIVIDUAL LESSON ACTIONS ----------

// PATCH /lessons/:id/complete
router.patch("/:id/complete", completeLessonRules, completeLesson);

// PATCH /lessons/:id/reschedule
router.patch("/:id/reschedule", rescheduleLessonRules, rescheduleLesson);

// PATCH /lessons/:id/cancel
router.patch("/:id/cancel", cancelLessonRules, cancelLesson);

export default router;

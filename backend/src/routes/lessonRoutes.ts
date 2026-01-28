import { Router } from "express";
import { lessonController } from "../controllers/lessonController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// All lesson routes require authentication
router.use(authMiddleware);

router.get("/", lessonController.getLessons);
router.get("/:id", lessonController.getLesson);
router.post("/", lessonController.createLesson);
router.put("/:id", lessonController.updateLesson);
router.delete("/:id", lessonController.deleteLesson);
router.post("/:id/report", lessonController.reportLesson);

export default router;

import express from "express";
import { index, update } from "../controllers/student_controller";
import { updateStudentRules } from "../validations/student_validation";

const router = express.Router();

// GET students
router.get("/", index);

// PATCH student (notes | goals)
router.patch("/:id", updateStudentRules, update);

export default router;

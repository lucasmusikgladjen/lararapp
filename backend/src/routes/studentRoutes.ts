import express from "express";
import { index, search, update } from "../controllers/student_controller";
import { updateStudentRules } from "../validations/student_validation";

const router = express.Router();

// Get students when searching
router.get("/search", search);

// GET students
router.get("/", index);

// PATCH student (notes | goals)
router.patch("/:id", updateStudentRules, update);

export default router;

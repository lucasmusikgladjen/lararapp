import express from "express";
import { index, search, update, requestToTeach } from "../controllers/student_controller";
import { requestToTeachRules, updateStudentRules } from "../validations/student_validation";

const router = express.Router();

// Get students when searching
router.get("/search", search);

// GET students
router.get("/", index);

// PATCH student (notes | goals)
router.patch("/:id", updateStudentRules, update);

// POST request for a student
router.post("/:id/request", requestToTeachRules, requestToTeach);

export default router;

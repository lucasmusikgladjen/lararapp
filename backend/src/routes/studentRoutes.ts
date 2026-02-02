import express from "express";
import { index } from "../controllers/student_controller";

const router = express.Router();

// GET students
router.get("/", index);

export default router;

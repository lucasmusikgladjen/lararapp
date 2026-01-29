import express from "express";
import { getStudents } from "../controllers/studentController";

const router = express.Router();


// GET students
router.get("/", getStudents);

export default router;

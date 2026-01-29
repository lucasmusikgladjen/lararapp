import express from "express";
import { index } from "../controllers/studentController";

const router = express.Router();

// GET students
router.get("/", index);

export default router;

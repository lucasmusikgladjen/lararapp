import { Router } from "express";
import authRoutes from "./authRoutes";
import lessonRoutes from "./lessonRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/lessons", lessonRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;

import { Router } from "express";
import { authController } from "../controllers/authController";

const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/refresh", authController.refresh);

export default router;

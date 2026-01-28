import { Request, Response } from "express";
import { authService } from "../services/authService";

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({ error: "Invalid credentials" });
    }
  },

  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ error: "Registration failed" });
    }
  },

  async refresh(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(401).json({ error: "No token provided" });
        return;
      }

      const result = await authService.refreshToken(token);
      res.json(result);
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(401).json({ error: "Invalid token" });
    }
  },
};

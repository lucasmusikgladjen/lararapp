import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests per window
  message?: string;
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max, message = "Too many requests" } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || "unknown";
    const now = Date.now();

    if (!store[key] || now > store[key].resetTime) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      next();
      return;
    }

    if (store[key].count >= max) {
      res.status(429).json({ error: message });
      return;
    }

    store[key].count++;
    next();
  };
}

// Special rate limiter for Google Directions API (10 requests per 24 hours per user)
export function directionsRateLimit() {
  const DAY_MS = 24 * 60 * 60 * 1000;

  return rateLimit({
    windowMs: DAY_MS,
    max: 10,
    message: "Du har nått din gräns för vägbeskrivningar idag (max 10/dag)",
  });
}

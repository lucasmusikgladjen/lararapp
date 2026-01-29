import cors from "cors";
import express from "express";
import morgan from "morgan";
import rootRoutes from "./routes/index";

const app = express();

// 1. Logging (Morgan) - "dev" format gives colored status codes
app.use(morgan("dev"));

// Middleware
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:8081",
        credentials: true,
    }),
);

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api", rootRoutes);

// 404 Handler
app.use((_req, res) => {
    res.status(404).json({
        status: "error",
        message: "Route not found",
    });
});

export default app;

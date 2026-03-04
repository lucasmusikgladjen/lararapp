import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Privat valideringsfunktion
const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "Validation error",
                errors: errors.array(),
            },
        });
    }
    next();
};


/**
 * Rules for POST /lessons
 */
export const createLessonRules = [
    body("teacherId").isString().notEmpty().withMessage("teacherId krävs och måste vara en sträng").trim(),
    body("studentId").isString().notEmpty().withMessage("studentId krävs och måste vara en sträng").trim(),
    body("startDate").isISO8601().withMessage("startDate krävs och måste vara ett giltigt datum (YYYY-MM-DD)"),
    body("timeHHMM").isString().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("timeHHMM krävs och måste vara i formatet HH:MM"),
    body("layout").isString().notEmpty().withMessage("layout krävs (t.ex. '45-60 min')").trim(),
    body("repeatUntil").optional().isISO8601().withMessage("repeatUntil måste vara ett giltigt datum (YYYY-MM-DD) om det anges"),
    validate,
];


/**
 * Rules for DELETE /lessons/future/:studentId
 */
export const clearFutureLessonsRules = [
    param("studentId").isString().notEmpty().withMessage("studentId krävs i URL:en").trim(),
    body("studentName").isString().notEmpty().withMessage("studentName krävs i body").trim(),
    body("fromDate").isISO8601().withMessage("fromDate krävs i body och måste vara ett giltigt datum (YYYY-MM-DD)"),
    validate,
];

export const adjustFutureLessonsRules = [
    param("studentId").isString().notEmpty().withMessage("studentId krävs i URL:en").trim(),
    body("studentName").isString().notEmpty().withMessage("studentName krävs för sökningen").trim(),
    body("fromDate").isISO8601().withMessage("fromDate krävs (YYYY-MM-DD)"),
    body("newStartDate").isISO8601().withMessage("newStartDate krävs (första nya datumet)"),
    body("timeHHMM").optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("timeHHMM måste vara i formatet HH:MM"),
    body("layout").optional().isString().trim(),
    validate,
];
import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Denna funktion är privat här inne, vi exporterar den inte separat längre
const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "Valideringsfel",
                errors: errors.array()
            }
        });
    }
    next();
};

// Vi exporterar hela paketet (regler + validate) som en enda array
export const updateStudentRules = [
    body("kommentar")
        .optional()
        .isString().withMessage("Kommentar måste vara en sträng")
        .trim(),
    
    body("terminsmal")
        .optional()
        .isString().withMessage("Terminsmål måste vara en sträng")
        .trim(),

    validate 
];
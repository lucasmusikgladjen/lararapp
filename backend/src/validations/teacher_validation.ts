import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { getTeacherByEmail } from "../services/teacher_service";

/**
 * Middleware to handle validation results.
 */
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
 * STRICT Validator: Checks if email exists at all.
 * Used for: Registration
 */
const validateEmailDoesNotExist = async (value: string) => {
    const teacher = await getTeacherByEmail(value);
    if (teacher) {
        throw new Error("Email already exists!");
    }
};

/**
 * Rules for POST /register
 */
export const createTeacherRules = [
    body("name").exists().isString().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email").normalizeEmail().custom(validateEmailDoesNotExist),
    body("password").exists().isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("address").exists().isString(),
    body("zip").exists().isString(),
    body("city").exists().isString(),
    body("birthYear").exists().isString(),
    validate,
];

/**
 * Rules for PATCH /api/profile
 */
export const updateProfileRules = [
    body("name").optional().isString().trim().notEmpty(),
    body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail()
        .custom(async (value, { req }) => {
            const teacher = await getTeacherByEmail(value);
            if (teacher) {
                if (teacher.id !== req.user?.id) {
                    throw new Error("Email is already in use!");
                }
            }
            return true;
        }),

    body("address").optional().isString().trim(),
    body("zip").optional().isString().trim(),
    body("city").optional().isString().trim(),
    body("birthYear").optional().isString().isLength({ min: 4, max: 4 }),

    body("phone").optional().isString().trim(),
    body("bank").optional().isString().trim(),
    body("bankAccountNumber").optional().isString().trim(),
    body("bio").optional().isString(),
    body("desiredStudentCount").optional().isInt({ min: 0 }),

    body("instruments")
        .optional()
        .isArray()
        .custom((value) => {
            if (!value.every((item: any) => typeof item === "string")) {
                throw new Error("Every instrument must be a string");
            }
            return true;
        }),

    validate,
];

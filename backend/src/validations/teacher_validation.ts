import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { getTeacherByEmail } from "../services/teacher_service";

/**
 * Middleware to handle validation results.
 * If there are errors, it returns a 400 response with the error details.
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
 * Custom validator to check if an email is already registered in Airtable.
 */
const validateEmailDoesNotExist = async (value: string) => {
    const teacher = await getTeacherByEmail(value);

    if (teacher) {
        throw new Error("Email already exists!");
    }
};

/**
 * Rules for POST /register
 * These fields are mandatory for creating a new account.
 */
export const createTeacherRules = [
    body("name")
        .isString()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail()
        .custom(validateEmailDoesNotExist),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("address")
        .isString()
        .notEmpty()
        .withMessage("Address is required"),

    body("zip")
        .isString()
        .notEmpty()
        .withMessage("Zip code is required"),

    body("city")
        .isString()
        .notEmpty()
        .withMessage("City is required"),

    body("birthYear")
        .isString()
        .isLength({ min: 4, max: 4 })
        .withMessage("Birth year must be exactly 4 digits"),
    
    validate
];

/**
 * Rules for PATCH /api/profile
 * All fields are optional as it is a partial update.
 */
export const updateProfileRules = [
    body("name")
        .optional()
        .isString()
        .withMessage("Name must be a string")
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty"),

   body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail()
        .custom(async (value, { req }) => {
            // Allow the user to keep their current email, 
            // but block if they try to change to another existing user's email.
            const teacher = await getTeacherByEmail(value);
            if (teacher && teacher.id !== req.user?.id) {
                throw new Error("Email address is already in use by another account");
            }
        }),

    body("address")
        .optional()
        .isString()
        .trim(),

    body("zip")
        .optional()
        .isString()
        .trim(),

    body("city")
        .optional()
        .isString()
        .trim(),

    body("birthYear")
        .optional()
        .isString() 
        .isLength({ min: 4, max: 4 })
        .withMessage("Birth year must be 4 digits (e.g. 1990)"),

    body("instruments")
        .optional()
        .isArray()
        .withMessage("Instruments must be provided as an array (list)")
        .custom((value) => {
            // Verify that every item in the list is a string
            if (!value.every((item: any) => typeof item === 'string')) {
                throw new Error("Every instrument in the list must be a text string");
            }
            return true;
        }),

    validate, // Run validation last
];
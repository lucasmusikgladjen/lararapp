import Debug from "debug";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { getTeacherByEmail } from "../services/teacher_service";
import { JwtAccessTokenPayload } from "../types/JWT.types";
import { StringValue } from "ms";
import { TypedRequestBody } from "../types/Request.types";

const debug = Debug("musikgladjen:authController");

// Environment variables ⚙️
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_LIFETIME = (process.env.ACCESS_TOKEN_LIFETIME as StringValue) || "30d";

interface LoginRequestBody {
    email: string;
    password: string;
}

/**
 * POST /login
 * * Log in a teacher by validating credentials against Airtable and generating a JWT token.
 */

// Use TypedRequestBody<LoginRequestBody> to tell TypeScript what's in the body
export const login = async (req: TypedRequestBody<LoginRequestBody>, res: Response) => {
    // 1. Validate request body
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).send({
            status: "fail",
            message: "Email and password are required",
        });
        return;
    }

    try {
        // 2. Find teacher in Airtable
        const teacher = await getTeacherByEmail(email);

        if (!teacher) {
            debug("Login failed: User %s does not exist in Airtable", email);
            res.status(401).send({
                status: "fail",
                message: "Authorization required",
            });
            return;
        }

        // 3. Verify credentials
        if (!teacher.password) {
            debug("Login failed: User %s has no password set", email);
            res.status(401).send({
                status: "fail",
                message: "Authorization required",
            });
            return;
        }

        const password_correct = await bcrypt.compare(password, teacher.password);

        if (!password_correct) {
            debug("Login failed: Password for user %s is incorrect", email);
            res.status(401).send({
                status: "fail",
                message: "Authorization required",
            });
            return;
        }

        // 4. Construct JWT Payload
        const payload: JwtAccessTokenPayload = {
            id: teacher.id,
            email: teacher.email,
            name: teacher.name,
        };

        // 5. Sign payload and get access-token
        if (!ACCESS_TOKEN_SECRET) {
            debug("FATAL: ACCESS_TOKEN_SECRET is missing in environment");
            res.status(500).send({
                status: "error",
                message: "No access token secret defined",
            });
            return;
        }

        const access_token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_LIFETIME,
        });

        debug("User %s logged in successfully", email);

        // 6. Respond with token and user info (excluding password)
        const { password: _, ...teacherWithoutPassword } = teacher;

        res.send({
            status: "success",
            data: {
                access_token,
                user: teacherWithoutPassword,
            },
        });
    } catch (error) {
        debug("Login error: %O", error);
        res.status(500).send({
            status: "error",
            message: "An error occurred during login",
        });
    }
};

import Debug from "debug";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JwtAccessTokenPayload } from "../../types/JWT.types";

const debug = Debug("musikgladjen:jwt");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const validateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    // Make sure the Authorization header exists
    if (!req.headers.authorization) {
        debug("Authorization header is missing!");
        res.status(401).send({
            status: "fail",
            data: {
                message: "Authorization required!",
            },
        });
        return;
    }

    // Split Authorization header on " " | "Bearer <token>"
    const [authtype, token] = req.headers.authorization.split(" ");

    // Check Authorization Type is "Bearer"
    if (authtype.toLocaleLowerCase() !== "bearer") {
        debug("Authorization Type is not Bearer");
        res.status(401).send({
            status: "fail",
            data: {
                message: "Authorization required!",
            },
        });
        return;
    }

    // Verify token and extract payload
    if (!ACCESS_TOKEN_SECRET) {
        debug("ACCESS_TOKEN_SECRET is missing in environment");
        res.status(500).send({
            status: "error",
            message: "No access token secret defined",
        });
        return;
    }

    try {
        const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtAccessTokenPayload;

        // Attach payload to the request
        req.user = {
            id: payload.id,
            email: payload.email,
            name: payload.name,
        };

        next();
    } catch (error) {
        debug("JWT Verify failed: %O", error);

        // If token has expired, inform the user
        if (error instanceof TokenExpiredError) {
            res.status(401).send({
                status: "fail",
                message: "Authorization token has expired!",
            });
            return;
        }

        res.status(401).send({
            status: "fail",
            message: "Authorization denied!",
        });
    }
};

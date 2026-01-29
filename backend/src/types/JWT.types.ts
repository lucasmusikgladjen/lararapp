import { JwtPayload } from "jsonwebtoken";

export interface JwtAccessTokenPayload extends JwtPayload {
    id: string;
    email: string;
    name: string;
}

// Om vi planerar att använda refresh tokens senare kan vi ha kvar denna.
export interface JwtRefreshTokenPayload extends JwtPayload {
    id: string;
}

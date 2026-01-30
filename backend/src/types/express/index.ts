import { AuthenticatedUser } from "../Auth.types";

declare module "express-serve-static-core" {
    interface Request {
        user?: AuthenticatedUser;
    }
}

// declare global {
// 	namespace Express {
// 		export interface Request {
// 			user?: AuthenticatedUser;
// 		}
// 	}
// }

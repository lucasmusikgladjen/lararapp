import Debug from "debug";
import { Request, Response } from "express";
import { getTeacherById, updateTeacher } from "../services/teacher_service";

const debug = Debug("musikgladjen:profileController");

/**
 * GET /
 * Hämta profilen för den inloggade läraren.
 */
export const getProfile = async (req: Request, res: Response) => {
    // 1. Kolla att vi har en inloggad användare (från middleware)
    if (!req.user) {
        debug("No user found in request (Middleware failure?)");
        res.status(401).send({
            status: "fail",
            message: "Unauthorized access",
        });
        return;
    }

    const userId = req.user.id;
    debug(`Fetching profile for user ID: ${userId}`);

    try {
        // 2. Hämta datan från Airtable
        const teacher = await getTeacherById(userId);

        if (!teacher) {
            debug(`User with ID ${userId} not found in Airtable`);
            res.status(404).send({
                status: "fail",
                message: "User not found",
            });
            return;
        }

        // 3. Ta bort lösenordet innan vi skickar svaret (Säkerhet!)
        const { password: _, ...teacherWithoutPassword } = teacher;

        res.send({
            status: "success",
            data: teacherWithoutPassword,
        });
    } catch (error) {
        debug("Error fetching profile: %O", error);
        res.status(500).send({
            status: "error",
            message: "Could not fetch profile data",
        });
    }
};

/**
 * PATCH /
 * Uppdatera den inloggade lärarens profil.
 */
export const updateProfile = async (req: Request, res: Response) => {
    // 1. Säkerställ autentisering
    if (!req.user) {
        res.status(401).json({ status: "fail", message: "Unauthorized" });
        return;
    }

    // 2. Hämta ID från token (inte params)
    const userId = req.user.id;
    const { instruments, ...otherUpdates } = req.body;

    debug(`Updating profile for user ID: ${userId}`);

    try {
        // 3. Anropa servicen
        // Vi skickar instrument-arrayen direkt till vår nya service-logik
        const updatedTeacher = await updateTeacher(userId, {
            ...otherUpdates,
            instruments,
        });

        // 4. Tvätta bort lösenordet från svaret
        const { password: _, ...cleanTeacher } = updatedTeacher;

        debug("Profile updated successfully");

        res.status(200).json({
            status: "success",
            data: cleanTeacher,
        });
    } catch (error) {
        // 5. Fånga fel
        debug("Error updating profile: %O", error);
        res.status(500).json({
            status: "error",
            message: "Could not update profile",
        });
    }
};

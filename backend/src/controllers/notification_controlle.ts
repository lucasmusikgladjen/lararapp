import Debug from "debug";
import { Request, Response } from "express";
import { getActiveNotificationsForTeacher, resolveNotification } from "../services/notification_service";

const debug = Debug("musikgladjen:notificationController");

/**
 * GET /notifications
 */
export const getActiveNotifications = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).send({ status: "fail", message: "Unauthorized" });
        return;
    }

    const teacherId = req.user.id;
    debug(`Fetching active notifications for teacher: ${teacherId}`);

    try {
        const notifications = await getActiveNotificationsForTeacher(teacherId);

        res.send({
            status: "success",
            data: notifications,
        });
    } catch (error) {
        debug("Error fetching notifications: %O", error);
        res.status(500).send({
            status: "error",
            message: "Could not fetch notifications",
            error: (error as Error).message,
        });
    }
};

/**
 * PATCH /notifications/:id/resolve
 */
export const resolve = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).send({ status: "fail", message: "Unauthorized" });
        return;
    }

    const { id } = req.params as { id: string };
    const answers = req.body; // Innehåller eventuella svar från Actionsidan

    debug(`Resolving notification ${id}`);

    try {
        await resolveNotification(id, answers);

        res.send({
            status: "success",
            message: "Notification resolved successfully",
        });
    } catch (error) {
        debug("Error resolving notification: %O", error);
        res.status(500).send({
            status: "error",
            message: "Could not resolve notification",
            error: (error as Error).message,
        });
    }
};

import Debug from "debug";
import Expo from "expo-server-sdk";
import { Request, Response } from "express";
import { getActiveNotificationsForTeacher, resolveNotification } from "../services/notification_service";
import { getTeacherById } from "../services/teacher_service";

const debug = Debug("musikgladjen:notificationController");

// Create a new Expo SDK client
const expo = new Expo();

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

/**
 * POST /notifications/push-webhook
 * Webhook endpoint triggered by Airtable Automations.
 * Protected by a secret header, NOT a JWT.
 */
export const triggerPushNotification = async (req: Request, res: Response) => {
    // 1. Verify the Webhook Secret from Airtable
    const authHeader = req.headers["x-webhook-secret"];
    if (authHeader !== process.env.AIRTABLE_WEBHOOK_SECRET) {
        debug("Unauthorized webhook attempt");
        return res.status(401).send({ status: "fail", message: "Unauthorized webhook" });
    }

    const { teacherId, title, body } = req.body;

    if (!teacherId || !title || !body) {
        return res.status(400).send({ status: "fail", message: "Missing required fields" });
    }

    debug(`Received push webhook for Teacher ID: ${teacherId}`);

    try {
        // 2. Fetch the teacher to get their Push Token
        const teacher = await getTeacherById(teacherId);

        if (!teacher || !teacher.pushToken) {
            debug(`Teacher ${teacherId} not found or has no push token. Skipping.`);
            return res.status(200).send({ status: "success", message: "No token found, push skipped." });
        }

        // 3. Validate the token format
        if (!Expo.isExpoPushToken(teacher.pushToken)) {
            debug(`Push token ${teacher.pushToken} is not a valid Expo push token`);
            return res.status(400).send({ status: "fail", message: "Invalid push token format" });
        }

        // 4. Construct the message
        const messages = [
            {
                to: teacher.pushToken,
                sound: "default" as const, // TypeScript strictly wants this typed as 'default'
                title: title,
                body: body,
                data: { trigger: "airtable_webhook" },
            },
        ];

        // 5. Send the push notification via Expo
        const chunks = expo.chunkPushNotifications(messages);
        const ticketChunks = [];

        for (const chunk of chunks) {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            ticketChunks.push(ticketChunk);
        }

        debug("Push notification sent successfully!");
        res.status(200).send({ status: "success", message: "Push notification triggered" });
    } catch (error) {
        debug("Error sending push notification: %O", error);
        res.status(500).send({
            status: "error",
            message: "Failed to send push notification",
            error: (error as Error).message,
        });
    }
};

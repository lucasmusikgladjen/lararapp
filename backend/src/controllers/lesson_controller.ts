import Debug from "debug";
import { Request, Response } from "express";
import {
    createLessonsBatch,
    deleteLessonsBatch,
    getFutureLessonsForStudent,
    updateLessonsBatch,
    updateSingleLesson,
} from "../services/lesson_service";
import { CreateLessonDTO } from "../types/Lessons.types";

const debug = Debug("musikgladjen:lessonController");

export const create = async (req: Request, res: Response) => {
    try {
        const { teacherId, studentId, startDate, timeHHMM, layout, repeatUntil } = req.body;

        debug(`Creating lessons for student ${studentId}. Start: ${startDate}, Repeat until: ${repeatUntil || "No"}`);

        const lessonsToCreate: CreateLessonDTO[] = [];
        let currentDate = new Date(startDate);
        const endDate = repeatUntil ? new Date(repeatUntil) : new Date(startDate);

        while (currentDate <= endDate) {
            lessonsToCreate.push({
                teacherId,
                studentId,
                date: currentDate.toISOString().split("T")[0],
                timeHHMM,
                layout,
            });

            currentDate.setUTCDate(currentDate.getUTCDate() + 7);
        }

        const createdRecords = await createLessonsBatch(lessonsToCreate);

        res.status(201).send({
            status: "success",
            message: `Created ${createdRecords.length} lessons.`,
            data: createdRecords,
        });
    } catch (error) {
        debug("Error creating lessons: %O", error);
        res.status(500).send({
            message: "Error creating lessons",
            error: (error as Error).message,
        });
    }
};

export const deleteFutureLessons = async (req: Request, res: Response) => {
    try {
        const { fromDate, studentName } = req.body;

        debug(`Clearing future lessons for student ${studentName} from ${fromDate}`);

        const futureLessons = await getFutureLessonsForStudent(studentName, fromDate);

        if (futureLessons.length === 0) {
            return res.send({ status: "success", message: "No future lessons found to delete." });
        }

        const idsToDelete = futureLessons.map((lesson) => lesson.id);
        await deleteLessonsBatch(idsToDelete);

        res.send({
            status: "success",
            message: `Successfully deleted ${idsToDelete.length} future lessons.`,
        });
    } catch (error) {
        debug("Error deleting future lessons: %O", error);
        res.status(500).send({
            message: "Error deleting future lessons",
            error: (error as Error).message,
        });
    }
};

export const adjustFutureLessons = async (req: Request, res: Response) => {
    try {
        const { studentName, fromDate, newStartDate, timeHHMM, layout } = req.body;

        debug(`Adjusting future lessons for ${studentName}. New start: ${newStartDate} at ${timeHHMM}`);

        const futureLessons = await getFutureLessonsForStudent(studentName, fromDate);

        if (futureLessons.length === 0) {
            return res.send({
                status: "success",
                message: "No future lessons found to adjust.",
            });
        }

        futureLessons.sort((a, b) => {
            const dateA = new Date(a.fields.Datum || "").getTime();
            const dateB = new Date(b.fields.Datum || "").getTime();
            return dateA - dateB;
        });

        let currentDate = new Date(newStartDate);

        const updates = futureLessons.map((lesson) => {
            const updateDoc = {
                id: lesson.id,
                fields: {
                    Datum: currentDate.toISOString().split("T")[0],
                    Klockslag: timeHHMM || lesson.fields.Klockslag,
                    Upplägg: layout || lesson.fields.Upplägg,
                },
            };

            currentDate.setUTCDate(currentDate.getUTCDate() + 7);

            return updateDoc;
        });

        const updatedRecords = await updateLessonsBatch(updates);

        res.send({
            status: "success",
            message: `Successfully adjusted ${updatedRecords.length} lessons.`,
            data: updatedRecords,
        });
    } catch (error) {
        debug("Error adjusting lessons: %O", error);
        res.status(500).send({
            message: "Error adjusting lessons",
            error: (error as Error).message,
        });
    }
};

/**
 * Mark a lesson as completed (Genomförd)
 */
export const completeLesson = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const { notes, homework } = req.body;

        debug(`Marking lesson ${id} as completed`);

        const updatedRecord = await updateSingleLesson(id, {
            Genomförd: true,
            Lektionsanteckning: notes || "",
            Läxa: homework || "",
        });

        res.send({
            status: "success",
            message: "Lesson marked as completed",
            data: updatedRecord,
        });
    } catch (error) {
        debug("Error completing lesson: %O", error);
        res.status(500).send({ message: "Error completing lesson", error: (error as Error).message });
    }
};

/**
 * Reschedule a lesson (Boka om)
 */
export const rescheduleLesson = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const { newDate, newTime, reason } = req.body;

        debug(`Rescheduling lesson ${id} to ${newDate}`);

        const fieldsToUpdate: any = {
            Datum: newDate,
            "Anledning ombokning": reason,
        };

        if (newTime) {
            fieldsToUpdate.Klockslag = newTime;
        }

        const updatedRecord = await updateSingleLesson(id, fieldsToUpdate);

        res.send({
            status: "success",
            message: "Lesson rescheduled successfully",
            data: updatedRecord,
        });
    } catch (error) {
        debug("Error rescheduling lesson: %O", error);
        res.status(500).send({ message: "Error rescheduling lesson", error: (error as Error).message });
    }
};

/**
 * Cancel a lesson (Ställ in)
 */
export const cancelLesson = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const { cancelledBy, reason } = req.body;

        debug(`Cancelling lesson ${id}. Initiated by: ${cancelledBy}`);

        const updatedRecord = await updateSingleLesson(id, {
            Inställd: true,
            "Anledning inställd": `${cancelledBy} ställer in: ${reason}`,
        });

        res.send({
            status: "success",
            message: "Lesson cancelled successfully",
            data: updatedRecord,
        });
    } catch (error) {
        debug("Error cancelling lesson: %O", error);
        res.status(500).send({ message: "Error cancelling lesson", error: (error as Error).message });
    }
};

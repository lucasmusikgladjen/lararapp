import Debug from "debug";
import { Request, Response } from "express";
import { createLessonsBatch, deleteLessonsBatch, getFutureLessonsForStudent, updateLessonsBatch } from "../services/lesson_service";
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

            currentDate.setDate(currentDate.getDate() + 7);
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
        const { studentId } = req.params as { studentId: string };
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
        const { studentId } = req.params as { studentId: string };
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
            currentDate.setDate(currentDate.getDate() + 7);
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

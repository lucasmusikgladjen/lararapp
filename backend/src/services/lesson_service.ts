import { post, getAllRecords } from "./airtable";
import type { AirtableLessonRecord, CreateLessonDTO, AirtableLessonFields } from "../types/Lessons.types";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TABLE_NAME = "tblbMwm8gitNwBAUH";

export const createLessonsBatch = async (lessons: CreateLessonDTO[]): Promise<AirtableLessonRecord[]> => {
    const formattedRecords = lessons.map((lesson) => ({
        fields: {
            Lärare: [lesson.teacherId],
            Elev: [lesson.studentId],
            Datum: lesson.date,
            Klockslag: lesson.timeHHMM,
            Upplägg: lesson.layout,
        },
    }));

    const createdRecords: AirtableLessonRecord[] = [];
    const chunkSize = 10;

    for (let i = 0; i < formattedRecords.length; i += chunkSize) {
        const chunk = formattedRecords.slice(i, i + chunkSize);
        const body = { records: chunk };

        const response = await post<{ records: AirtableLessonRecord[] }>(`/${TABLE_NAME}`, body);
        createdRecords.push(...response.records);
    }

    return createdRecords;
};

export const getFutureLessonsForStudent = async (studentName: string, fromDate: string): Promise<AirtableLessonRecord[]> => {
    // Söker exakt på elevens namn för att undvika problem med Airtables ID-länkningar
    const formula = `AND(SEARCH('${studentName}', {Elev Namn} & ''), IS_AFTER({Datum}, '${fromDate}'))`;
    const encodedFormula = encodeURIComponent(formula);

    const response = await getAllRecords<{ records: AirtableLessonRecord[] }>(`/${TABLE_NAME}?filterByFormula=${encodedFormula}`);
    return response.records;
};

export const deleteLessonsBatch = async (lessonIds: string[]): Promise<void> => {
    const API_KEY = process.env.AIRTABLE_API_KEY;
    const BASE_ID = process.env.AIRTABLE_BASE_ID;

    const chunkSize = 10;

    for (let i = 0; i < lessonIds.length; i += chunkSize) {
        const chunk = lessonIds.slice(i, i + chunkSize);
        const queryParams = chunk.map((id) => `records[]=${encodeURIComponent(id)}`).join("&");

        await axios.delete(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?${queryParams}`, {
            headers: { Authorization: `Bearer ${API_KEY}` },
        });
    }
};

export const updateLessonsBatch = async (updates: { id: string; fields: Partial<AirtableLessonFields> }[]): Promise<AirtableLessonRecord[]> => {
    const API_KEY = process.env.AIRTABLE_API_KEY;
    const BASE_ID = process.env.AIRTABLE_BASE_ID;

    const updatedRecords: AirtableLessonRecord[] = [];
    const chunkSize = 10;

    for (let i = 0; i < updates.length; i += chunkSize) {
        const chunk = updates.slice(i, i + chunkSize);
        const body = { records: chunk };

        const response = await axios.patch<{ records: AirtableLessonRecord[] }>(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`, body, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        updatedRecords.push(...response.data.records);
    }

    return updatedRecords;
};

export const updateSingleLesson = async (id: string, fields: Partial<AirtableLessonFields>): Promise<AirtableLessonRecord> => {
    const API_KEY = process.env.AIRTABLE_API_KEY;
    const BASE_ID = process.env.AIRTABLE_BASE_ID;

    const body = {
        records: [{ id, fields }],
    };

    const response = await axios.patch<{ records: AirtableLessonRecord[] }>(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`, body, {
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        },
    });

    return response.data.records[0];
};

import { post, getAllRecords } from "./airtable";
import type { AirtableLessonRecord, CreateLessonDTO, AirtableLessonFields } from "../types/Lessons.types";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TABLE_NAME = "tblbMwm8gitNwBAUH";

const isAirtableRecordId = (id: string): boolean => /^rec[A-Za-z0-9]{14}$/.test(id);

// Stable identity for a lesson slot. Matches lärarsidans signature
// (same student + teacher + datum + klockslag = same slot) so dubbeltryck,
// retries och samtidiga klienter inte skapar två rader i Lektioner.
const lessonSlotSignature = (teacherId: string, studentId: string, date: string, time: string): string =>
    `${teacherId}|${studentId}|${date}|${time}`;

export const createLessonsBatch = async (lessons: CreateLessonDTO[]): Promise<AirtableLessonRecord[]> => {
    if (lessons.length === 0) return [];

    const seenInBatch = new Set<string>();
    const dedupedBatch = lessons.filter((lesson) => {
        const sig = lessonSlotSignature(lesson.teacherId, lesson.studentId, lesson.date, lesson.timeHHMM);
        if (seenInBatch.has(sig)) return false;
        seenInBatch.add(sig);
        return true;
    });

    // Server-side dedup against existing Lektioner. Skopa per lärare via
    // filterByFormula så vi slipper helbasscan. Om teacherId inte ser ut
    // som ett Airtable rec-ID hoppar vi över denna del (sker inte i praktiken,
    // men en full scan vore för dyr att göra blint).
    const teacherIds = Array.from(new Set(dedupedBatch.map((l) => l.teacherId)));
    const existingSignatures = new Set<string>();

    for (const teacherId of teacherIds) {
        if (!isAirtableRecordId(teacherId)) continue;

        const formula = `FIND("${teacherId}", ARRAYJOIN({Lärare})) > 0`;
        const url = `/${TABLE_NAME}?filterByFormula=${encodeURIComponent(formula)}`;
        const existing = await getAllRecords<{ records: AirtableLessonRecord[] }>(url);

        for (const record of existing.records) {
            const f = record.fields;
            const teacher = Array.isArray(f.Lärare) ? f.Lärare[0] : undefined;
            const student = Array.isArray(f.Elev) ? f.Elev[0] : undefined;
            if (teacher && student && f.Datum && f.Klockslag) {
                existingSignatures.add(lessonSlotSignature(teacher, student, f.Datum, f.Klockslag));
            }
        }
    }

    const toCreate = dedupedBatch.filter(
        (lesson) =>
            !existingSignatures.has(
                lessonSlotSignature(lesson.teacherId, lesson.studentId, lesson.date, lesson.timeHHMM)
            )
    );

    if (toCreate.length === 0) return [];

    const formattedRecords = toCreate.map((lesson) => ({
        fields: {
            Lärare: [lesson.teacherId],
            Elev: [lesson.studentId],
            Datum: lesson.date,
            Klockslag: lesson.timeHHMM,
            Lektionsform: lesson.layout,
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

export const getLessonsByIds = async (ids: string[]): Promise<AirtableLessonRecord[]> => {
    if (ids.length === 0) return [];

    const chunkSize = 100;
    const all: AirtableLessonRecord[] = [];

    for (let i = 0; i < ids.length; i += chunkSize) {
        const chunk = ids.slice(i, i + chunkSize);
        const formula = `OR(${chunk.map((id) => `RECORD_ID()='${id}'`).join(",")})`;
        const url = `/${TABLE_NAME}?filterByFormula=${encodeURIComponent(formula)}`;
        const response = await getAllRecords<{ records: AirtableLessonRecord[] }>(url);
        all.push(...response.records);
    }

    return all;
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

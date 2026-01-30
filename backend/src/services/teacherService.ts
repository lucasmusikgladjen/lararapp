import { get } from "./airtable";
import type { AirtableResponse, AirtableTeacherRecord, Teacher } from "../types/Teacher.types";

// Table: "Lärare" | ID: tbldsyppY5WQ9MpSp
const TABLE_NAME = "tbldsyppY5wQ9MpSp";

const mapAirtableToTeacher = (record: AirtableTeacherRecord): Teacher => {
    const field = record.fields;

    const imageUrl = field.Profilbild && field.Profilbild.length > 0 ? field.Profilbild[0].thumbnails?.large.url || field.Profilbild[0].url : "";

    return {
        id: record.id,
        name: field.Namn || "Okänd lärare",
        email: field["E-post"] || "",
        password: field.Lösenord,
        studentIds: field.Elev || [],
        profileImageUrl: imageUrl,
        status: field.Slutar || "Okänd",
    };
};

// Get a teacher based on email. Return null if no teacher is found.
export const getTeacherByEmail = async (email: string): Promise<Teacher | null> => {
    const formula = `{E-post} = '${email}'`;

    const encodedFormula = encodeURIComponent(formula);

    const response = await get<AirtableResponse<AirtableTeacherRecord>>(`/${TABLE_NAME}?filterByFormula=${encodedFormula}`);

    if (response.records.length === 0) {
        return null;
    }

    return mapAirtableToTeacher(response.records[0]);
};

// NOTE: Try catch here? 
export const getTeacherById = async (id: string): Promise<Teacher | null> => {
    try {
        const record = await get<AirtableTeacherRecord>(`/${TABLE_NAME}/${id}`);
        return mapAirtableToTeacher(record);
    } catch (error) {
        return null;
    }
};

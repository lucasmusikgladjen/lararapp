import type { AirtableRecord, AirtableResponse, Student, UpdateStudentInput } from "../types/Student.types";
import { get, patch } from "./airtable";

// Table: "Elev" | ID: tblAj4VVugqhdPWnR
const TABLE_NAME = "tblAj4VVugqhdPWnR";

const mapAirtableToStudent = (record: AirtableRecord): Student => {
    const field = record.fields;
    return {
        id: record.id,
        displayId: field.ID || "",
        name: field.Namn || "",
        firstName: field.Förnamn || "",
        instrument: field.Instrument || "",
        address: field.Gata?.[0] || "",
        city: field.Ort?.[0] || "",
        location: {
            lat: field.Latitude?.[0] || 0,
            lng: field.Longitude?.[0] || 0,
        },
        status: field.Status || "Okänd",
        upcomingLessons: field["Bokade lektioner"] || [],
        upcomingLessonTimes: field.Lektionstider || [],
        experience: field["Elevens erfarenhetsnivå"] || "",
        description: field["Kort om eleven (från anmälan)"] || "",
        leadScore: field["Lead score"],
        notes: field.Kommentar || "",
        goals: field.Terminsmål || "",
    };
};

// NOTE: Maybe we can use this later?
export const getAllStudents = async (): Promise<Student[]> => {
    const response = await get<AirtableResponse<AirtableRecord>>(`/${TABLE_NAME}?view=Aktiva%20elever`);

    return response.records.map(mapAirtableToStudent);
};

export const getStudentById = async (id: string): Promise<Student> => {
    const record = await get<AirtableRecord>(`/${TABLE_NAME}/${id}`);
    return mapAirtableToStudent(record);
};

export const getStudentsByTeacher = async (teacherName: string): Promise<Student[]> => {
    const formula = `SEARCH("${teacherName}", {Lärare})`;
    const encodedFormula = encodeURIComponent(formula);

    const response = await get<AirtableResponse<AirtableRecord>>(`/${TABLE_NAME}?view=Aktiva%20elever&filterByFormula=${encodedFormula}`);
    return response.records.map(mapAirtableToStudent);
};

export const updateStudent = async (id: string, data: UpdateStudentInput): Promise<Student> => {
    const airtableFields: Record<string, any> = {};

    if (data.kommentar !== undefined) {
        airtableFields["Kommentar"] = data.kommentar;
    }

    if (data.terminsmal !== undefined) {
        airtableFields["Terminsmål"] = data.terminsmal;
    }

    const updatedRecord = await patch<AirtableRecord>(`/${TABLE_NAME}/${id}`, airtableFields);

    return mapAirtableToStudent(updatedRecord);
};

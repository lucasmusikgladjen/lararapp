import { get } from "./airtable";
import type { AirtableResponse, AirtableRecord, Student } from "../models/Student.types";

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
        experience: field["Elevens erfarenhetsnivå"] || "",
        description: field["Kort om eleven (från anmälan)"] || "",
        leadScore: field["Lead score"],
    };
};

export const getAllStudents = async (): Promise<Student[]> => {
    const response = await get<AirtableResponse<AirtableRecord>>(`/${TABLE_NAME}`);

    return response.records.map(mapAirtableToStudent);
};

export const getStudentById = async (id: string): Promise<Student> => {
    const record = await get<AirtableRecord>(`/${TABLE_NAME}/${id}`);
    return mapAirtableToStudent(record);
};

import { get, patch, post } from "./airtable";
import type { AirtableResponse, AirtableTeacherRecord, CreateTeacherData, Teacher, UpdateTeacherData } from "../types/Teacher.types";

// Table: "Lärare" | ID: tbldsyppY5WQ9MpSp
const TABLE_NAME = "tbldsyppY5wQ9MpSp";

const mapAirtableToTeacher = (record: AirtableTeacherRecord): Teacher => {
    const field = record.fields;

    const imageUrl = field.Profilbild && field.Profilbild.length > 0 ? field.Profilbild[0].thumbnails?.large.url || field.Profilbild[0].url : "";
    const instrumentList = field.Instrument ? field.Instrument.split(",").map((instrument) => instrument.trim()) : [];

    return {
        id: record.id,
        name: field.Namn || "Okänd lärare",
        email: field["E-post"] || "",
        password: field.Lösenord,
        studentIds: field.Elev || [],
        profileImageUrl: imageUrl,
        status: field.Slutar || "Okänd",
        address: field.Adress,
        zip: field.Postnummer,
        city: field.Ort,
        birthYear: field.Födelseår,
        instruments: instrumentList,
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

export const getTeacherById = async (id: string): Promise<Teacher | null> => {
    const response = await get<AirtableTeacherRecord>(`/${TABLE_NAME}/${id}`);
    return mapAirtableToTeacher(response);
};

// Create a new teacher
export const createTeacher = async (data: CreateTeacherData): Promise<Teacher> => {
    const body = {
        fields: {
            Namn: data.name,
            "E-post": data.email,
            Lösenord: data.password,
            Adress: data.address,
            Postnummer: data.zip,
            Ort: data.city,
            Födelseår: data.birthYear,
            Slutar: "Aktiv",
        },
    };

    const response = await post<AirtableTeacherRecord>(`/${TABLE_NAME}`, body);
    return mapAirtableToTeacher(response);
};

// Update Teacher
export const updateTeacher = async (id: string, data: UpdateTeacherData): Promise<Teacher> => {
    const fields: Record<string, any> = {};

    if (data.name) fields.Namn = data.name;
    if (data.email) fields["E-post"] = data.email;
    if (data.address) fields.Adress = data.address;
    if (data.zip) fields.Postnummer = data.zip;
    if (data.city) fields.Ort = data.city;

    // TRANSFORM: Array -> String
    // ["Piano", "Gitarr"] -> "Piano, Gitarr"
    if (data.instruments) {
        fields.Instrument = data.instruments.join(", ");
    }

    const response = await patch<AirtableTeacherRecord>(`/${TABLE_NAME}/${id}`, fields);
    return mapAirtableToTeacher(response);
};

import { get, patch, post } from "./airtable";
import type {
    AirtableResponse,
    AirtableTeacherRecord,
    CreateTeacherData,
    Teacher,
    UpdateTeacherData,
    TeacherDocument,
    AirtableAttachment,
} from "../types/Teacher.types";

const TABLE_NAME = "tbldsyppY5wQ9MpSp";

const mapAttachmentToDoc = (attachments: AirtableAttachment[] | undefined, type: TeacherDocument["type"]): TeacherDocument | null => {
    if (!attachments || attachments.length === 0) return null;
    return {
        name: attachments[0].filename,
        url: attachments[0].url,
        type: type,
    };
};

const mapAirtableToTeacher = (record: AirtableTeacherRecord): Teacher => {
    const field = record.fields;

    const imageUrl = field.Profilbild && field.Profilbild.length > 0 ? field.Profilbild[0].thumbnails?.large.url || field.Profilbild[0].url : "";

    const instrumentList = field.Instrument ? field.Instrument.split(",").map((instrument) => instrument.trim()) : [];

    // Handle Documents
    const docs: TeacherDocument[] = [];

    const contract = mapAttachmentToDoc(field.Avtal, "contract");
    if (contract) docs.push(contract);

    const taxAdj = mapAttachmentToDoc(field.Jämkning, "tax-adjustment");
    if (taxAdj) docs.push(taxAdj);

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
        personalNumber: field.Personnummer,
        instruments: instrumentList,

        // Editable fields
        phone: field.Telefon,
        bank: field.Bank,
        bankAccountNumber: field.Bankkontonummer,
        bio: field.Biografi,
        desiredStudentCount: field["Önskat antal elever"],

        // Read-only financial info
        hourlyWage: field.Timlön,
        taxRate: field.Skattesats,

        documents: docs,
    };
};

export const getTeacherByEmail = async (email: string): Promise<Teacher | null> => {
    const formula = `{E-post} = '${email}'`;
    const encodedFormula = encodeURIComponent(formula);
    const response = await get<AirtableResponse<AirtableTeacherRecord>>(`/${TABLE_NAME}?filterByFormula=${encodedFormula}`);

    if (response.records.length === 0) return null;
    return mapAirtableToTeacher(response.records[0]);
};

export const getTeacherById = async (id: string): Promise<Teacher | null> => {
    const response = await get<AirtableTeacherRecord>(`/${TABLE_NAME}/${id}`);
    return mapAirtableToTeacher(response);
};

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

export const updateTeacher = async (id: string, data: UpdateTeacherData): Promise<Teacher> => {
    const fields: Record<string, any> = {};

    // Explicit mapping for allowed update fields
    if (data.name !== undefined) fields.Namn = data.name;
    if (data.email !== undefined) fields["E-post"] = data.email;
    if (data.address !== undefined) fields.Adress = data.address;
    if (data.zip !== undefined) fields.Postnummer = data.zip;
    if (data.city !== undefined) fields.Ort = data.city;
    if (data.birthYear !== undefined) fields.Födelseår = data.birthYear; 
    if (data.phone !== undefined) fields.Telefon = data.phone;
    if (data.bank !== undefined) fields.Bank = data.bank;
    if (data.bankAccountNumber !== undefined) fields.Bankkontonummer = data.bankAccountNumber;
    if (data.bio !== undefined) fields.Biografi = data.bio;
    if (data.desiredStudentCount !== undefined) fields["Önskat antal elever"] = data.desiredStudentCount;

    if (data.instruments) {
        fields.Instrument = data.instruments.join(", ");
    }

    const response = await patch<AirtableTeacherRecord>(`/${TABLE_NAME}/${id}`, fields);
    return mapAirtableToTeacher(response);
};

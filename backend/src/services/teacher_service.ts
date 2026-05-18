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

    const instrumentList = Array.isArray(field.Instrument)
      ? field.Instrument
      : field.Instrument ? field.Instrument.split(",").map((i) => i.trim()) : [];

    // Handle Documents
    const docs: TeacherDocument[] = [];

    const contract = mapAttachmentToDoc(field.Avtal, "contract");
    if (contract) docs.push(contract);

    const taxAdj = mapAttachmentToDoc(field.Jämkning, "tax-adjustment");
    if (taxAdj) docs.push(taxAdj);

    const criminalRecord = mapAttachmentToDoc(field.Belastningsregister, "criminal-record");
    if (criminalRecord) docs.push(criminalRecord);

    // Parse the JSON Adress field to extract address/zip/city
    let parsedAddress = '';
    let parsedZip = '';
    let parsedCity = '';
    if (field.Adress) {
        try {
            const parsed = JSON.parse(field.Adress);
            parsedAddress = parsed.adress || '';
            parsedZip = parsed.postnummer || '';
            parsedCity = parsed.ort || '';
        } catch {
            // Fallback: treat raw value as plain address string (migration period)
            parsedAddress = field.Adress;
        }
    }

    return {
        id: record.id,
        name: field.Namn || "Okänd lärare",
        email: field["E-post"] || "",
        password: field.Lösenord,
        studentIds: field.Elev || [],
        pendingStudentIds: field["Önskar"] || [],
        profileImageUrl: imageUrl,
        address: parsedAddress || undefined,
        zip: parsedZip || undefined,
        city: parsedCity || undefined,
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

        pushToken: field.PushToken,
        resetCode: field["Återställningskod"],
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
            Adress: JSON.stringify({ adress: data.address, postnummer: data.zip, ort: data.city }),
            Födelseår: data.birthYear,
        },
    };
    const response = await post<AirtableTeacherRecord>(`/${TABLE_NAME}`, body);
    return mapAirtableToTeacher(response);
};

export const updateTeacher = async (id: string, data: UpdateTeacherData): Promise<Teacher> => {
    const fields: Record<string, any> = {};

    // 1. Hämta befintlig lärare för att kunna bygga ett snyggt filnamn
    const existingTeacher = await getTeacherById(id);
    const safeName = existingTeacher?.name ? existingTeacher.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_åäöÅÄÖ]/g, "") : id; // Fallback till ID om namnet saknas

    // Explicit mapping for allowed update fields
    if (data.name !== undefined) fields.Namn = data.name;
    if (data.email !== undefined) fields["E-post"] = data.email;
    if (data.birthYear !== undefined) fields.Födelseår = data.birthYear;

    // Merge address/zip/city into a single JSON Adress field
    if (data.address !== undefined || data.zip !== undefined || data.city !== undefined) {
        const currentAddress = existingTeacher?.address || '';
        const currentZip = existingTeacher?.zip || '';
        const currentCity = existingTeacher?.city || '';
        fields.Adress = JSON.stringify({
            adress: data.address !== undefined ? data.address : currentAddress,
            postnummer: data.zip !== undefined ? data.zip : currentZip,
            ort: data.city !== undefined ? data.city : currentCity,
        });
    }
    if (data.personalNumber !== undefined) fields.Personnummer = data.personalNumber;
    if (data.phone !== undefined) fields.Telefon = data.phone;
    if (data.bank !== undefined) fields.Bank = data.bank;
    if (data.bankAccountNumber !== undefined) fields.Bankkontonummer = data.bankAccountNumber;
    if (data.bio !== undefined) fields.Biografi = data.bio;
    if (data.desiredStudentCount !== undefined) fields["Önskat antal elever"] = data.desiredStudentCount;
    if (data.pushToken !== undefined) fields.PushToken = data.pushToken;

    if (data.clearDocument === "contract") fields.Avtal = [];
    if (data.clearDocument === "tax-adjustment") fields.Jämkning = [];
    if (data.clearDocument === "criminal-record") fields.Belastningsregister = [];

    if (data.instruments) {
        fields.Instrument = data.instruments;
    }

    if (data.password !== undefined) fields.Lösenord = data.password;
    if (data.resetCode !== undefined) fields["Återställningskod"] = data.resetCode;

    // Firebase Storage: Hantera uppladdning av nya filer till Airtable med dynamiska namn
    if (data.profileImageUrl) {
        fields.Profilbild = [{ url: data.profileImageUrl, filename: `Profilbild_${safeName}.jpg` }];
    }
    if (data.contractUrl) {
        fields.Avtal = [{ url: data.contractUrl, filename: `Avtal_${safeName}.pdf` }];
    }
    if (data.taxAdjustmentUrl) {
        fields.Jämkning = [{ url: data.taxAdjustmentUrl, filename: `Jamkning_${safeName}.pdf` }];
    }
    if (data.criminalRecordUrl) {
        fields.Belastningsregister = [{ url: data.criminalRecordUrl, filename: `Belastningsregister_${safeName}.pdf` }];
    }

    const response = await patch<AirtableTeacherRecord>(`/${TABLE_NAME}/${id}`, fields);
    return mapAirtableToTeacher(response);
};

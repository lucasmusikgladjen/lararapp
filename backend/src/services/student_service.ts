import type {
    AirtableRecord,
    AirtableResponse,
    GetStudentsQuery,
    Student,
    StudentPublicDTO,
    UpdateStudentInput,
    RequestToTeachInput,
} from "../types/Student.types";
import { get, getAllRecords, patch } from "./airtable";
import { getLessonsByIds } from "./lesson_service";
import type { AirtableLessonRecord, StudentLessonDTO } from "../types/Lessons.types";

// Table: "Elev" | ID: tblAj4VVugqhdPWnR
const TABLE_NAME = "tblAj4VVugqhdPWnR";

// Table: "Vårdnadshavare" | ID: tblfYUEqhO9gtSQMh
const GUARDIAN_TABLE_NAME = "tblfYUEqhO9gtSQMh";

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

function parseJsonField<T>(value: string | undefined | null, fallback: T): T {
    if (!value || typeof value !== 'string') return fallback;
    try { return JSON.parse(value) as T; } catch { return fallback; }
}

const mapLessonRecordToDTO = (record: AirtableLessonRecord): StudentLessonDTO => {
    const f = record.fields;
    let homework = "";
    let notes = "";
    try {
        const parsed = JSON.parse(f.Anteckningar || "{}");
        homework = parsed.laxa || "";
        notes = parsed.lektionsanteckning || "";
    } catch { /* ignore */ }

    const status = f.Status || "";

    return {
        id: record.id,
        date: f.Datum || "",
        time: f.Klockslag || "",
        status,
        isCompleted: status === "Genomförd",
        isCancelled: status === "Inställd",
        homework,
        notes,
    };
};

const mapAirtableToStudent = (record: AirtableRecord, lessons: StudentLessonDTO[]): Student => {
    const field = record.fields;
    const lektionsupplägg = parseJsonField(field.Lektionsupplägg, { terminsmål: '' });

    return {
        id: record.id,
        displayId: field.ID || "",
        name: field.Namn || "",
        firstName: (field.Namn || "").split(" ")[0] || "",
        instrument: Array.isArray(field.Instrument) ? field.Instrument.join(', ') : '',
        address: "",
        city: "",
        location: { lat: 0, lng: 0 },
        status: field.Status || "Okänd",
        lessons,
        experience: "",
        description: "",
        leadScore: undefined,
        goals: lektionsupplägg.terminsmål || "",
        guardianName: field["Vårdnadshavare namn"]?.[0] || "",
        guardianEmail: "",
        guardianPhone: "",
    };
};

const attachLessonsToStudents = async (records: AirtableRecord[]): Promise<Student[]> => {
    const allLessonIds = records.flatMap((r) => r.fields.Lektioner || []);
    const lessonRecords = await getLessonsByIds(allLessonIds);
    const lessonsById = new Map(lessonRecords.map((l) => [l.id, mapLessonRecordToDTO(l)]));

    return records.map((record) => {
        const ids = record.fields.Lektioner || [];
        const lessons = ids
            .map((id) => lessonsById.get(id))
            .filter((l): l is StudentLessonDTO => Boolean(l))
            .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
        return mapAirtableToStudent(record, lessons);
    });
};

export const getAllStudents = async (): Promise<Student[]> => {
    const response = await get<AirtableResponse<AirtableRecord>>(`/${TABLE_NAME}?view=Aktiva%20elever`);
    return attachLessonsToStudents(response.records);
};

export const getStudentById = async (id: string): Promise<Student> => {
    const record = await get<AirtableRecord>(`/${TABLE_NAME}/${id}`);
    const [student] = await attachLessonsToStudents([record]);
    return student;
};

export const getStudentsByTeacher = async (teacherName: string): Promise<Student[]> => {
    const formula = `SEARCH("${teacherName}", {Lärare})`;
    const encodedFormula = encodeURIComponent(formula);

    const response = await get<AirtableResponse<AirtableRecord>>(`/${TABLE_NAME}?view=Aktiva%20elever&filterByFormula=${encodedFormula}`);
    return attachLessonsToStudents(response.records);
};

export const updateStudent = async (id: string, data: UpdateStudentInput): Promise<Student> => {
    const airtableFields: Record<string, any> = {};

    if (data.terminsmal !== undefined) {
        const currentRecord = await get<AirtableRecord>(`/${TABLE_NAME}/${id}`);
        let lu: any = {};
        try { lu = JSON.parse(currentRecord.fields.Lektionsupplägg || '{}'); } catch {}
        lu.terminsmål = data.terminsmal;
        airtableFields['Lektionsupplägg'] = JSON.stringify(lu);
    }

    const updatedRecord = await patch<AirtableRecord>(`/${TABLE_NAME}/${id}`, airtableFields);

    const [student] = await attachLessonsToStudents([updatedRecord]);
    return student;
};

export const findStudents = async (query: GetStudentsQuery): Promise<StudentPublicDTO[]> => {
    // 1. Bygg filter-formel för Airtable
    const filters: string[] = [];

    filters.push("{Status} = 'Söker lärare'");

    if (query.instrument) {
        filters.push(`FIND("${query.instrument.toLowerCase()}", LOWER(ARRAYJOIN({Instrument}, ",")))`);
    }

    const filterFormula = `AND(${filters.join(",")})`;

    const url = `/${TABLE_NAME}?filterByFormula=${encodeURIComponent(filterFormula)}`;

    // Använd getAllRecords för att hämta ALLA sidor, inte bara de första 100
    const response = await getAllRecords<{ records: AirtableRecord[] }>(url);

    // 2. Mappa datan och hantera Array-fälten
    const students: StudentPublicDTO[] = response.records.map((record) => {
        const fields = record.fields;

        // EVALUATE IF APPLIED
        const onskarArray = fields.LärareÖnskar || [];
        const hasApplied = query.teacherId ? onskarArray.includes(query.teacherId) : false;

        return {
            id: record.id,
            name: fields.Namn || "Anonym",
            city: "",
            instruments: Array.isArray(fields.Instrument) ? fields.Instrument : [],
            lat: undefined,
            lng: undefined,
            distance: undefined,
            hasApplied: hasApplied,
            birthYear: fields.Födelseår,
            studentNumber: fields.NummerID,
        };
    });

    return students;
};

// This function handles the logic of adding a teacher to a student's 'Önskar' list
export const requestToTeachStudent = async (studentId: string, data: RequestToTeachInput): Promise<Student> => {
    // 1. Fetch current student to get existing 'LärareÖnskar' array
    const currentStudentRecord = await get<AirtableRecord>(`/${TABLE_NAME}/${studentId}`);
    const currentFields = currentStudentRecord.fields;
    const currentRequests = currentFields.LärareÖnskar || [];

    // Safety check: Prevent duplicate requests from the same teacher
    if (currentRequests.includes(data.teacherId)) {
        throw new Error("You have already sent a request for this student");
    }

    // 2. Append the new teacher ID to the list
    const updatedRequests = [...currentRequests, data.teacherId];

    const dateStr = new Date().toLocaleDateString("sv-SE");

    // 3. Build accumulated LärareÖnskarKommentar on Elev
    let elevKommentar = (currentFields as any).LärareÖnskarKommentar || "";
    if (data.message) {
        const separator = elevKommentar ? "\n\n" : "";
        elevKommentar += `${separator}--- ${data.teacherName} (${dateStr}) ---\n${data.message}`;
    }

    // 4. Also write to guardian's Anteckning.OnboardingAnteckning (JSON field)
    const guardianIds: string[] = (currentFields as any)["Vårdnadshavare"] || [];
    if (data.message && guardianIds.length > 0) {
        const guardianId = guardianIds[0];
        const guardianRecord = await get<any>(`/${GUARDIAN_TABLE_NAME}/${guardianId}`);
        let anteckningJson: any = {};
        try { anteckningJson = JSON.parse(guardianRecord.fields["Anteckning"] || "{}"); } catch {}
        let onboardingText = anteckningJson.OnboardingAnteckning || "";
        const separator = onboardingText ? "\n\n" : "";
        onboardingText += `${separator}--- Elevansökan: ${data.teacherName} (${dateStr}) ---\n${data.message}`;
        anteckningJson.OnboardingAnteckning = onboardingText;
        await patch<any>(`/${GUARDIAN_TABLE_NAME}/${guardianId}`, {
            "Anteckning": JSON.stringify(anteckningJson),
        });
    }

    // 5. Update Elev: LärareÖnskar + LärareÖnskarKommentar
    const patchFields: Record<string, any> = {
        LärareÖnskar: updatedRequests,
    };
    if (data.message) {
        patchFields["LärareÖnskarKommentar"] = elevKommentar.trim();
    }

    const updatedRecord = await patch<AirtableRecord>(`/${TABLE_NAME}/${studentId}`, patchFields);
    const [student] = await attachLessonsToStudents([updatedRecord]);
    return student;
};

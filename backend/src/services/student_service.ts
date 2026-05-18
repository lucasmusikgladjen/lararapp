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

// Table: "Elev" | ID: tblAj4VVugqhdPWnR
const TABLE_NAME = "tblAj4VVugqhdPWnR";

// Table: "Vårdnadshavare" | ID: tblfYUEqhO9gtSQMh
const GUARDIAN_TABLE_NAME = "tblfYUEqhO9gtSQMh";

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

// Matematik: Räkna ut avstånd mellan två GPS-punkter (Haversine Formula)
const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Jordens radie i km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat1)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

const parseBarn = (json?: string | null): { erfarenhetsniva: string; kortOmEleven: string } => {
    try {
        const arr = JSON.parse(json || '[]');
        if (Array.isArray(arr) && arr.length > 0) {
            const b = arr[0];
            return { erfarenhetsniva: b.erfarenhetsniva || '', kortOmEleven: b.kortOmEleven || '' };
        }
    } catch {}
    return { erfarenhetsniva: '', kortOmEleven: '' };
};

const mapAirtableToStudent = (record: AirtableRecord): Student => {
    const field = record.fields;

    // Parsing av lektionsdata
    const rawPayloads = field["Lektioner Payload"] || [];
    const payloadMap = new Map<string, any>();

    // Packa upp varje lektionssträng och mappa den till lektionens unika ID
    // Format: RECORD_ID|||completed|||cancelled|||ANTECKNINGAR_JSON
    rawPayloads.forEach((p) => {
        const parts = p.split("|||");
        if (parts.length >= 4) {
            let homework = "";
            let notes = "";
            const raw = parts[3] === "BLANK" ? "" : parts[3];
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    homework = parsed.laxa || "";
                    notes = parsed.lektionsanteckning || "";
                } catch {
                    homework = raw;
                }
            }
            payloadMap.set(parts[0], {
                completed: parts[1] === "true",
                cancelled: parts[2] === "true",
                homework,
                notes,
            });
        }
    });

    const upcomingLessonIds = field.Lektioner || [];

    return {
        id: record.id,
        displayId: field.ID || "",
        name: field.Namn || "",
        firstName: field.Förnamn || "",
        instrument: Array.isArray(field.Instrument) ? field.Instrument.join(', ') : (field.Instrument || ''),
        address: field.Gata?.[0] || "",
        city: field.Ort?.[0] || "",
        location: {
            lat: field.Latitude?.[0] || 0,
            lng: field.Longitude?.[0] || 0,
        },
        status: field.Status || "Okänd",

        upcomingLessons: field["Bokade lektioner"] || [],
        upcomingLessonTimes: field.Lektionstider || [],

        // Vi mappar genom ID-listan och plockar exakt rätt data!
        upcomingLessonIds: upcomingLessonIds,
        upcomingLessonCompleted: upcomingLessonIds.map((id) => payloadMap.get(id)?.completed || false),
        upcomingLessonCancelled: upcomingLessonIds.map((id) => payloadMap.get(id)?.cancelled || false),
        upcomingLessonHomework: upcomingLessonIds.map((id) => payloadMap.get(id)?.homework || ""),
        upcomingLessonNotes: upcomingLessonIds.map((id) => payloadMap.get(id)?.notes || ""),

        experience: parseBarn(field.Barn).erfarenhetsniva,
        description: parseBarn(field.Barn).kortOmEleven,
        leadScore: field["Lead score"],
        notes: field.Kommentar || "",
        goals: field.Terminsmål || "",
        guardianName: field["Vårdnadshavare namn"]?.[0] || "",
        guardianEmail: field["Vårdnadshavare e-post"]?.[0] || "",
        guardianPhone: field["Vårdnadshavare telefon"]?.[0] || "",
    };
};

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

export const findStudents = async (query: GetStudentsQuery): Promise<StudentPublicDTO[]> => {
    // 1. Bygg filter-formel för Airtable
    const filters: string[] = [];

    filters.push("{Status} = 'Söker lärare'");

    if (query.city) {
        filters.push(`SEARCH('${query.city.toLowerCase()}', LOWER({Ort} & ""))`);
    }

    if (query.instrument) {
        filters.push(`FIND("${query.instrument.toLowerCase()}", LOWER(ARRAYJOIN({Instrument}, ",")))`);
    }

    const filterFormula = `AND(${filters.join(",")})`;

    const url = `/${TABLE_NAME}?filterByFormula=${encodeURIComponent(filterFormula)}`;

    // Använd getAllRecords för att hämta ALLA sidor, inte bara de första 100
    const response = await getAllRecords<{ records: AirtableRecord[] }>(url);

    // 2. Mappa datan och hantera Array-fälten
    let students: StudentPublicDTO[] = response.records.map((record) => {
        const fields = record.fields;

        const lat = fields.Latitude?.[0];
        const lng = fields.Longitude?.[0];
        const city = fields.Ort?.[0] || "";

        let distance = undefined;

        if (query.lat && query.lng && lat && lng) {
            const userLat = parseFloat(query.lat);
            const userLng = parseFloat(query.lng);
            distance = getDistanceFromLatLonInKm(userLat, userLng, lat, lng);
        }

        // EVALUATE IF APPLIED
        const onskarArray = fields.LärareÖnskar || [];
        const hasApplied = query.teacherId ? onskarArray.includes(query.teacherId) : false;

        return {
            id: record.id,
            name: fields.Förnamn || fields.Namn || "Anonym",
            city: city,
            instruments: Array.isArray(fields.Instrument) ? fields.Instrument : (fields.Instrument ? fields.Instrument.split(',').map(s => s.trim()).filter(Boolean) : []),
            lat: lat,
            lng: lng,
            distance: distance ? parseFloat(distance.toFixed(1)) : undefined,
            hasApplied: hasApplied,
            birthYear: fields.Födelseår,
            studentNumber: fields.NummerID,
        };
    });

    // 3. Filtrera på Radius (Geografiskt - görs i minnet)
    if (query.radius && query.lat && query.lng) {
        const radius = parseFloat(query.radius);
        students = students.filter((s) => {
            if (s.distance === undefined) return false;
            return s.distance <= radius;
        });

        students.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return students;
};

// This function handles the logic of adding a teacher to a student's 'Önskar' list
export const requestToTeachStudent = async (studentId: string, data: RequestToTeachInput): Promise<Student> => {
    // 1. Fetch current student to get existing 'Önskar' array
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

    // 3. Append the comment to Vårdnadshavare.OnboardingAnteckning
    const guardianIds: string[] = currentFields.Vårdnadshavare || [];
    if (data.message && guardianIds.length > 0) {
        const guardianId = guardianIds[0];
        const guardianRecord = await get<AirtableRecord>(`/${GUARDIAN_TABLE_NAME}/${guardianId}`);
        let updatedComment = guardianRecord.fields["OnboardingAnteckning"] || "";

        const separator = updatedComment ? "\n\n" : "";
        updatedComment += `${separator}--- Elevansökan: ${data.teacherName} (${dateStr}) ---\n${data.message}`;

        await patch<AirtableRecord>(`/${GUARDIAN_TABLE_NAME}/${guardianId}`, {
            "OnboardingAnteckning": updatedComment.trim(),
        });
    }

    // 4. Update Elev: add teacher to LärareÖnskar and append their comment to LärareÖnskarKommentar
    const elevFields: Record<string, any> = { LärareÖnskar: updatedRequests };
    if (data.message) {
        let elevKommentar = currentFields.LärareÖnskarKommentar || "";
        const separator = elevKommentar ? "\n\n" : "";
        elevKommentar += `${separator}--- ${data.teacherName} (${dateStr}) ---\n${data.message}`;
        elevFields.LärareÖnskarKommentar = elevKommentar.trim();
    }

    const updatedRecord = await patch<AirtableRecord>(`/${TABLE_NAME}/${studentId}`, elevFields);

    return mapAirtableToStudent(updatedRecord);
};

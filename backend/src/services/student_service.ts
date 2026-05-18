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

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
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

function parseBarn(barnJson?: string): { namn: string; födelseår: string; instrument: string[] } {
    try {
        const arr = JSON.parse(barnJson || '[]');
        if (Array.isArray(arr) && arr.length > 0) {
            return {
                namn: arr[0].namn || '',
                födelseår: arr[0].födelseår || '',
                instrument: Array.isArray(arr[0].instrument) ? arr[0].instrument : [],
            };
        }
    } catch {}
    return { namn: '', födelseår: '', instrument: [] };
}

function parseLektionsupplagg(json?: string): { terminsmål: string; kommentar: string } {
    try {
        const obj = JSON.parse(json || '{}');
        return {
            terminsmål: obj.terminsmål || '',
            kommentar: obj.kommentar || '',
        };
    } catch {}
    return { terminsmål: '', kommentar: '' };
}

const mapAirtableToStudent = (record: AirtableRecord): Student => {
    const field = record.fields;

    const barn = parseBarn(field.Barn);
    const lektionsupplagg = parseLektionsupplagg(field.Lektionsupplägg);

    // Parsing av lektionsdata
    const rawPayloads = field["Lektioner Payload"] || [];
    const payloadMap = new Map<string, any>();

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
        firstName: barn.namn || "",
        instrument: barn.instrument.join(', ') || "",
        address: field.Gata?.[0] || "",
        city: field.Ort?.[0] || "",
        location: {
            lat: field.ElevLatitude || 0,
            lng: field.ElevLongitude || 0,
        },
        status: field.Status || "Okänd",

        upcomingLessons: field["Bokade lektioner"] || [],
        upcomingLessonTimes: field.Lektionstider || [],

        upcomingLessonIds: upcomingLessonIds,
        upcomingLessonCompleted: upcomingLessonIds.map((id) => payloadMap.get(id)?.completed || false),
        upcomingLessonCancelled: upcomingLessonIds.map((id) => payloadMap.get(id)?.cancelled || false),
        upcomingLessonHomework: upcomingLessonIds.map((id) => payloadMap.get(id)?.homework || ""),
        upcomingLessonNotes: upcomingLessonIds.map((id) => payloadMap.get(id)?.notes || ""),

        experience: field["Elevens erfarenhetsnivå"] || "",
        description: field["Kort om eleven (från anmälan)"] || "",
        leadScore: field["Lead score"],
        notes: lektionsupplagg.kommentar,
        goals: lektionsupplagg.terminsmål,
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
    const currentRecord = await get<AirtableRecord>(`/${TABLE_NAME}/${id}`);
    let lektionsupplagg: Record<string, any> = {};
    try {
        lektionsupplagg = JSON.parse(currentRecord.fields.Lektionsupplägg || '{}');
    } catch {}

    if (data.kommentar !== undefined) lektionsupplagg.kommentar = data.kommentar;
    if (data.terminsmal !== undefined) lektionsupplagg.terminsmål = data.terminsmal;

    const updatedRecord = await patch<AirtableRecord>(`/${TABLE_NAME}/${id}`, {
        Lektionsupplägg: JSON.stringify(lektionsupplagg),
    });

    return mapAirtableToStudent(updatedRecord);
};

export const findStudents = async (query: GetStudentsQuery): Promise<StudentPublicDTO[]> => {
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

    const response = await getAllRecords<{ records: AirtableRecord[] }>(url);

    let students: StudentPublicDTO[] = response.records.map((record) => {
        const fields = record.fields;
        const barn = parseBarn(fields.Barn);

        const lat = fields.ElevLatitude;
        const lng = fields.ElevLongitude;
        const city = fields.Ort?.[0] || "";

        let distance = undefined;
        if (query.lat && query.lng && lat !== undefined && lng !== undefined) {
            const userLat = parseFloat(query.lat);
            const userLng = parseFloat(query.lng);
            distance = getDistanceFromLatLonInKm(userLat, userLng, lat, lng);
        }

        const onskarArray = fields.Önskar || [];
        const hasApplied = query.teacherId ? onskarArray.includes(query.teacherId) : false;

        return {
            id: record.id,
            name: barn.namn || fields.Namn || "Anonym",
            city,
            instruments: barn.instrument.length ? barn.instrument : [],
            lat,
            lng,
            distance: distance ? parseFloat(distance.toFixed(1)) : undefined,
            hasApplied,
            birthYear: barn.födelseår || undefined,
            studentNumber: fields.NummerID,
        };
    });

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

export const requestToTeachStudent = async (studentId: string, data: RequestToTeachInput): Promise<Student> => {
    const currentStudentRecord = await get<AirtableRecord>(`/${TABLE_NAME}/${studentId}`);
    const currentFields = currentStudentRecord.fields;

    const currentRequests = currentFields.Önskar || [];

    if (currentRequests.includes(data.teacherId)) {
        throw new Error("You have already sent a request for this student");
    }

    const updatedRequests = [...currentRequests, data.teacherId];

    let updatedComment = currentFields["Egen anteckning"] || "";
    if (data.message) {
        const dateStr = new Date().toLocaleDateString("sv-SE");
        const separator = updatedComment ? "\n\n" : "";
        updatedComment += `${separator}--- Elevansökan: ${data.teacherName} (${dateStr}) ---\n${data.message}`;
    }

    const updatedRecord = await patch<AirtableRecord>(`/${TABLE_NAME}/${studentId}`, {
        Önskar: updatedRequests,
        "Egen anteckning": updatedComment.trim(),
    });

    return mapAirtableToStudent(updatedRecord);
};

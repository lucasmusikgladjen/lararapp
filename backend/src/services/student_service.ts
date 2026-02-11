import type { AirtableRecord, AirtableResponse, GetStudentsQuery, Student, StudentPublicDTO, UpdateStudentInput } from "../types/Student.types";
import { get, patch } from "./airtable";

// Table: "Elev" | ID: tblAj4VVugqhdPWnR
const TABLE_NAME = "tblAj4VVugqhdPWnR";

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

    // VIKTIGT: Vi vill bara hitta elever som faktiskt söker lärare!
    // Enligt din screenshot är statusen exakt "Söker lärare"
    filters.push("{Status} = 'Söker lärare'");

    // Filter: Stad (Case insensitive)
   if (query.city) {
    // Vi lägger till & "" för att tvinga Airtable att göra om arrayen till en sträng
    // Sen använder vi SEARCH som är mer förlåtande än likhetstecken
    filters.push(`SEARCH('${query.city.toLowerCase()}', LOWER({Ort} & ""))`);
}

    // Filter: Instrument
    if (query.instrument) {
        filters.push(`FIND('${query.instrument.toLowerCase()}', LOWER({Instrument}))`);
    }

    // Slå ihop alla filter med AND
    const filterFormula = `AND(${filters.join(",")})`;

    // URL-encode formeln
    // Vi tar bort "?view=Aktiva elever" för att vara säkra på att vi söker i hela tabellen
    const url = `/${TABLE_NAME}?filterByFormula=${encodeURIComponent(filterFormula)}`;

    // Hämta från Airtable
    const response = await get<{ records: AirtableRecord[] }>(url);

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

        return {
            id: record.id,
            name: fields.Förnamn || fields.Namn || "Anonym",
            city: city,
            instruments: fields.Instrument ? fields.Instrument.split(",").map((i) => i.trim()) : [],
            lat: lat,
            lng: lng,
            distance: distance ? parseFloat(distance.toFixed(1)) : undefined,
        };
    });

    // 3. Filtrera på Radius (Geografiskt - görs i minnet)
    if (query.radius && query.lat && query.lng) {
        const radius = parseFloat(query.radius);
        students = students.filter((s) => {
            if (s.distance === undefined) return false;
            return s.distance <= radius;
        });

        // Sortera: Närmast först
        students.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return students;
};

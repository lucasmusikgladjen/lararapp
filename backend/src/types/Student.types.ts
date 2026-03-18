export type AirtableStudentFields = {
    ID: string;
    Namn: string;
    Födelseår: string;
    Instrument: string;
    Förnamn: string;
    Gata?: string[];
    Ort?: string[];
    Latitude?: number[];
    Longitude?: number[];
    Status: string;
    "Bokade lektioner"?: string[];
    "Elevens erfarenhetsnivå"?: string;
    Ansökningsdag?: string;
    "Kort om eleven (från anmälan)"?: string;
    "Lead score"?: string;
    "Närmaste lärare"?: string[];
    Önskar?: string[];
    ÖnskaKommentar?: string;
    Lektionstider?: string[];
    Lektioner?: string[];
    "Lektioner Genomförda"?: boolean[];
    Kommentar?: string;
    Terminsmål?: string;
    "Vårdnadshavare namn"?: string[];
    "Vårdnadshavare e-post"?: string[];
    "Vårdnadshavare telefon"?: string[];
};

export type AirtableRecord = {
    id: string;
    createdTime: string;
    fields: AirtableStudentFields;
};

export type AirtableResponse<T> = {
    records: T[];
    offset?: string;
};

export type UpdateStudentInput = {
    kommentar?: string;
    terminsmal?: string;
};

export type Student = {
    id: string;
    displayId: string;
    name: string;
    firstName: string;
    instrument: string;
    address: string;
    city: string;
    location: {
        lat: number;
        lng: number;
    };
    status: string;
    upcomingLessons: string[];
    upcomingLessonTimes: string[];
    upcomingLessonIds: string[];
    upcomingLessonCompleted: boolean[];
    experience: string;
    description: string;
    leadScore?: string;
    notes?: string;
    goals?: string;
    guardianName?: string;
    guardianEmail?: string;
    guardianPhone?: string;
};

export interface StudentPublicDTO {
    id: string;
    name: string;
    instruments: string[];
    city: string;
    lat?: number;
    lng?: number;
    distance?: number;
    hasApplied?: boolean;
}

export interface GetStudentsQuery {
    city?: string;
    instrument?: string;
    lat?: string;
    lng?: string;
    radius?: string;
    teacherId?: string;
}

export type RequestToTeachInput = {
    teacherId: string;
    teacherName: string;
    message?: string;
};

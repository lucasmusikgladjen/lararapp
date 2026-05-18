export type AirtableStudentFields = {
    ID: string;
    NummerID?: number | string;
    Namn: string;
    Barn?: string;            // JSON: [{namn, födelseår, årkurs, instrument}]
    Lektionsupplägg?: string; // JSON: {form, längd, lektionstid, reservtid, terminsmål, kommentar}
    ElevLatitude?: number;
    ElevLongitude?: number;
    // Lookup fields from Vårdnadshavare (remain until those fields are deleted)
    Gata?: string[];
    Ort?: string[];
    Status: string;
    "Bokade lektioner"?: string[];
    "Elevens erfarenhetsnivå"?: string;
    Ansökningsdag?: string;
    "Kort om eleven (från anmälan)"?: string;
    "Lead score"?: string;
    "Närmaste lärare"?: string[];
    Önskar?: string[];
    "Egen anteckning"?: string;
    Lektionstider?: string[];
    Lektioner?: string[];
    "Lektioner Payload"?: string[];
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
    upcomingLessonCancelled: boolean[];
    upcomingLessonHomework: string[];
    upcomingLessonNotes: string[];
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
    birthYear?: string | number;
    studentNumber?: number | string;
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

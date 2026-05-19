export type AirtableStudentFields = {
    ID: string;
    NummerID?: number | string;
    Namn: string;
    Födelseår: string;
    Instrument: string[];
    Status: string;
    Ansökningsdag?: string;
    LärareÖnskar?: string[];
    LärareÖnskarKommentar?: string;
    Lektionstider?: string[];
    Lektioner?: string[];
    "Vårdnadshavare namn"?: string[];
    Vårdnadshavare?: string[];
    Barn?: string;
    Lektionsupplägg?: string;
    LärareFörslag?: string[];
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

export type AirtableLessonFields = {
    Lärare?: string[];
    Elev?: string[];
    Datum?: string; 
    Upplägg?: string; 
    Klockslag?: string; 
    Genomförd?: boolean;
    Inställd?: boolean;
    Lektionsanteckning?: string;
    Läxa?: string;
    "Anledning ombokning"?: string;
    "Anledning inställd"?: string;
};

export type AirtableLessonRecord = {
    id: string;
    createdTime: string;
    fields: AirtableLessonFields;
};

export type CreateLessonDTO = {
    teacherId: string;
    studentId: string;
    date: string;       // YYYY-MM-DD
    timeHHMM: string;   // "15:30"
    layout: string;     // "45-60 min"
};
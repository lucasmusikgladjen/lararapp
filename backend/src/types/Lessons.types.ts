export type AirtableLessonFields = {
    Lärare?: string[];
    Elev?: string[];
    Datum?: string;
    Lektionsform?: string;
    Klockslag?: string;
    Status?: "Genomförd" | "Inställd" | "Ombokad" | "Pausad";
    Anteckningar?: string;
    "Ombokad till"?: string;
};

export type StudentLessonDTO = {
    id: string;
    date: string;
    time: string;
    status: string;
    isCompleted: boolean;
    isCancelled: boolean;
    homework: string;
    notes: string;
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

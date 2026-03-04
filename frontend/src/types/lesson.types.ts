export type AdjustLessonPayload = {
    studentName: string;
    fromDate: string; // YYYY-MM-DD
    newStartDate: string; // YYYY-MM-DD
    timeHHMM?: string; // HH:mm
    layout?: string; // "45-60 min"
}

export type AdjustLessonResponse = {
    status: "success" | "fail";
    message: string;
    data: any[];
}

export interface CreateLessonPayload {
    teacherId: string;
    studentId: string;
    startDate: string;    // YYYY-MM-DD
    timeHHMM: string;     // HH:mm
    layout: string;       // "45-60 min"
    repeatUntil?: string; // YYYY-MM-DD (Valfritt)
}

export interface CreateLessonResponse {
    status: "success" | "fail";
    message: string;
    data: any[];
}

export interface DeleteFutureLessonsPayload {
    studentName: string;
    fromDate: string; // YYYY-MM-DD
}
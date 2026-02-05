export interface Guardian {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    email: string;
    phone: string;
}

export interface Lesson {
    id: string;
    date: string;
    time: string;
    completed: boolean;
    cancelled: boolean;
}

export interface Student {
    id: string;
    name: string;
    status: string;
    instrument: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    comment: string;
    lessonPrice: number;
    upcomingLessons: string[];
    upcomingLessonTimes: string[];
    notes: string | null;
    goals: string | null;
    guardian?: Guardian;
    lessons?: Lesson[];
    guardianName?: string;
    guardianEmail?: string;
    guardianPhone?: string;
}

export interface UpdateStudentPayload {
    notes?: string;
    goals?: string;
}

export interface ApiResponse<T> {
    status: "success" | "fail";
    data: T[];
}

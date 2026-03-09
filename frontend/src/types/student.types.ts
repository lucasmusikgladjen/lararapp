export type Guardian = {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    email: string;
    phone: string;
};

export type Lesson = {
    id: string;
    date: string;
    time: string;
    completed: boolean;
    cancelled: boolean;
};

export type Student = {
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
    upcomingLessonIds?: string[];
    notes: string | null;
    goals: string | null;
    guardian?: Guardian;
    lessons?: Lesson[];
    guardianName?: string;
    guardianEmail?: string;
    guardianPhone?: string;
};

export type StudentPublicDTO = {
    id: string;
    name: string;
    instruments: string[];
    city: string;
    lat?: number;
    lng?: number;
    distance?: number;
    hasApplied?: boolean;
};

export type SearchStudentsResponse = {
    status: "success" | "fail";
    count: number;
    data: StudentPublicDTO[];
};

export type UpdateStudentPayload = {
    notes?: string;
    goals?: string;
};

export type ApiResponse<T> = {
    status: "success" | "fail";
    data: T[];
};

// Maps
export type SearchParams = {
    token: string;
    lat: number;
    lng: number;
    radius: number;
    instrument?: string;
    searchQuery?: string;
};

export type RequestToTeachPayload = {
    message?: string;
};

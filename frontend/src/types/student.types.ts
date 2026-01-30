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
}

export interface ApiResponse<T> {
    status: "success" | "fail";
    data: T[];
}

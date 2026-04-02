export type AirtableResponse<T> = {
    records: T[];
};

export type AirtableImage = {
    id: string;
    url: string;
    filename: string;
    thumbnails?: {
        small: { url: string };
        large: { url: string };
    };
};

export type AirtableAttachment = {
    id: string;
    url: string;
    filename: string;
};

export type AirtableTeacherRecord = {
    id: string;
    createdTime: string;
    fields: {
        Namn?: string;
        "E-post"?: string;
        Lösenord?: string;
        Elev?: string[];
        Önskar?: string[];
        Profilbild?: AirtableImage[];
        Timlön?: number;
        Skattesats?: number;
        Slutar?: string;
        Adress?: string;
        Postnummer?: string;
        Ort?: string;
        Födelseår?: string;
        Personnummer?: string;
        Instrument?: string;
        Telefon?: string;
        Bank?: string;
        Bankkontonummer?: string;
        Biografi?: string;
        "Önskat antal elever"?: number;
        Avtal?: AirtableAttachment[];
        Jämkning?: AirtableAttachment[];
        Belastningsregister?: AirtableAttachment[];
        Terminsslut?: string;
        PushToken?: string;
    };
};

export type TeacherDocument = {
    name: string;
    url: string;
    type: "contract" | "tax-adjustment" | "criminal-record";
};

export type Teacher = {
    id: string;
    name: string;
    email: string;
    password?: string;
    studentIds: string[];
    pendingStudentIds: string[];
    profileImageUrl: string;
    status: string;
    address?: string;
    zip?: string;
    city?: string;
    birthYear?: string;
    personalNumber?: string;
    instruments: string[];
    phone?: string;
    bank?: string;
    bankAccountNumber?: string;
    bio?: string;
    desiredStudentCount?: number;
    hourlyWage?: number;
    taxRate?: number;
    documents: TeacherDocument[];
    termEnd?: string;
    pushToken?: string;
};

export type CreateTeacherData = {
    name: string;
    email: string;
    password: string;
    address: string;
    zip: string;
    city: string;
    birthYear: string;
};

export type UpdateTeacherData = {
    name?: string;
    email?: string;
    address?: string;
    zip?: string;
    city?: string;
    birthYear?: string;
    personalNumber?: string;
    instruments?: string[];
    phone?: string;
    bank?: string;
    bankAccountNumber?: string;
    bio?: string;
    desiredStudentCount?: number;
    pushToken?: string;
    clearDocument?: "contract" | "tax-adjustment" | "criminal-record";
};

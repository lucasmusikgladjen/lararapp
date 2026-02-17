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
        Profilbild?: AirtableImage[];
        Timlön?: number;
        Skattesats?: number; // Calculated in Airtable (0.3 etc)
        Slutar?: string; // Status
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
        // Documents
        Avtal?: AirtableAttachment[];
        Jämkning?: AirtableAttachment[];
        Belastningsregister?: AirtableAttachment[];
    };
};

export type TeacherDocument = {
    name: string;
    url: string;
    type: "contract" | "tax-adjustment" | "criminal-record";
};

// Our clean DTO (Data Transfer Object)
export type Teacher = {
    id: string;
    name: string;
    email: string;
    password?: string;
    studentIds: string[];
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

    // Read-only financial info
    hourlyWage?: number;
    taxRate?: number;

    // Documents (Only allowed ones)
    documents: TeacherDocument[];
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
    birthYear?: string; // Added back as requested
    instruments?: string[];
    phone?: string;
    bank?: string;
    bankAccountNumber?: string;
    bio?: string;
    desiredStudentCount?: number;
};

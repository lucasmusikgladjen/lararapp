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
        Slutar?: string;
        Adress?: string;
        Postnummer?: string;
        Ort?: string;
        Födelseår?: string;
    };
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

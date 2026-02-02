export type AirtableStudentFields = {
    ID: string;
    Namn: string;
    Födelseår: string;
    Instrument: string;
    Förnamn: string;
    Gata?: string[];
    Ort?: string[];
    Latitude?: number[];
    Longitude?: number[];
    Status: string;
    "Bokade lektioner"?: string[];
    "Elevens erfarenhetsnivå"?: string;
    Ansökningsdag?: string;
    "Kort om eleven (från anmälan)"?: string;
    "Lead score"?: string;
    "Närmaste lärare"?: string[];
    Önskar?: string[];
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
    experience: string;
    description: string;
    leadScore?: string;
};

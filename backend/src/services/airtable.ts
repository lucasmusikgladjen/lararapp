import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!API_KEY || !BASE_ID) {
    throw new Error("Missing Airtable configuration in .env");
}

const instance = axios.create({
    baseURL: `https://api.airtable.com/v0/${BASE_ID}`,
    headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
    },
});

export const post = async <T>(endpoint: string, body: Record<string, any>) => {
    try {
        const res = await instance.post<T>(endpoint, body);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Airtable Error:", error.response?.data || error.message);
            throw new Error(error.response?.data?.error?.message || "Failed to request Airtable");
        }
        throw error;
    }
};

export const get = async <T>(endpoint: string) => {
    try {
        const res = await instance.get<T>(endpoint);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Airtable Error:", error.response?.data || error.message);
            throw new Error(error.response?.data?.error?.message || "Failed to request Airtable");
        }
        throw error;
    }
};

export const getAllRecords = async <T extends { records: any[] }>(endpoint: string): Promise<T> => {
    try {
        let allRecords: any[] = [];
        let offset: string | undefined;

        do {
            // Lägg till offset i URL:en om det finns en
            const separator = endpoint.includes("?") ? "&" : "?";
            const url = offset ? `${endpoint}${separator}offset=${offset}` : endpoint;

            const res = await instance.get<{ records: any[]; offset?: string }>(url);

            allRecords = [...allRecords, ...res.data.records];

            offset = res.data.offset;
        } while (offset);

        return { records: allRecords } as T;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Airtable Error:", error.response?.data || error.message);
            throw new Error(error.response?.data?.error?.message || "Failed to request Airtable");
        }
        throw error;
    }
};

export const patch = async <T>(endpoint: string, fields: Record<string, any>) => {
    try {
        const res = await instance.patch<T>(endpoint, { fields: fields });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Airtable Error:", error.response?.data || error.message);
            throw new Error(error.response?.data?.error?.message || "Failed to request Airtable");
        }
        throw error;
    }
};

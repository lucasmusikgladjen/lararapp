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

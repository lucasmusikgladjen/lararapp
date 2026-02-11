// frontend/src/services/student.service.ts
import axios from "axios";
import { ApiResponse, SearchStudentsResponse, Student, StudentPublicDTO, UpdateStudentPayload } from "../types/student.types";

const API_URL = "http://localhost:3000/api";
// Note: Use "http://10.0.2.2:3000/api" for Android Emulator

export const getMyStudents = async (token: string): Promise<Student[]> => {
    // 1. Fetch data from backend
    // Since backend already mapped the data, we expect ApiResponse<Student> directly
    const response = await axios.get<ApiResponse<Student>>(`${API_URL}/students`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // 2. Return the data directly. No mapping needed here!
    return response.data.data;
};

export const getStudentById = async (token: string, studentId: string): Promise<Student> => {
    const response = await axios.get<{ status: string; data: Student }>(`${API_URL}/students/${studentId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
};

export const updateStudentInfo = async (token: string, studentId: string, payload: UpdateStudentPayload): Promise<Student> => {
    // Map frontend field names to API field names
    // notes -> kommentar, goals -> terminsmal
    const apiPayload: Record<string, string> = {};

    if (payload.notes !== undefined) {
        apiPayload.kommentar = payload.notes;
    }
    if (payload.goals !== undefined) {
        apiPayload.terminsmal = payload.goals;
    }

    const response = await axios.patch<{ status: string; data: Student }>(`${API_URL}/students/${studentId}`, apiPayload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
};

export const searchStudents = async (
    lat: number,
    lng: number,
    radius: number,
    instrument?: string,
): Promise<StudentPublicDTO[]> => {
    const params: Record<string, string> = {
        lat: String(lat),
        lng: String(lng),
        radius: String(radius),
    };
    if (instrument) {
        params.instrument = instrument;
    }
    const response = await axios.get<SearchStudentsResponse>(
        `${API_URL}/students/search`,
        { params },
    );
    return response.data.data;
};

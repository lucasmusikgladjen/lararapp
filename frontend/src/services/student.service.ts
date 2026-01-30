// frontend/src/services/student.service.ts
import axios from "axios";
import { ApiResponse, Student } from "../types/student.types";

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
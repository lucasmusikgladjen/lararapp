import axios from "axios";
import { CreateTeacherData, LoginResponse, RegisterResponse, UpdateProfilePayload, User } from "../types/auth.types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
    console.warn("⚠️ API_URL is not defined in .env! Check your EXPO_PUBLIC_API_URL variable.");
}

export const authService = {
    // Sends login credentials to the backend. Returns the access token and user data if successful.
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
            email,
            password,
        });
        return response.data;
    },

    // Registers a new teacher. Returns the access token and user data on success.
    register: async (data: CreateTeacherData): Promise<RegisterResponse> => {
        const response = await axios.post<RegisterResponse>(`${API_URL}/register`, data);
        return response.data;
    },

    // Get the latest profile data
    getProfile: async (token: string): Promise<User> => {
        const response = await axios.get<{ status: string; data: User }>(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    },

    // Updates the authenticated teacher's profile.
    updateProfile: async (token: string, data: UpdateProfilePayload): Promise<User> => {
        const response = await axios.patch<{ status: string; data: User }>(`${API_URL}/profile`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    },

    // Register Push Token
    registerPushToken: async (token: string, pushToken: string): Promise<{ status: string; message: string }> => {
        const response = await axios.post<{ status: string; message: string }>(
            `${API_URL}/profile/push-token`,
            { pushToken },
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        );
        return response.data;
    },

    // Reset Password
    resetPassword: async (data: any): Promise<{ status: string; message: string }> => {
        const response = await axios.post(`${API_URL}/reset-password`, data);
        return response.data;
    },
};

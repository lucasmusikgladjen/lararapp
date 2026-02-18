import axios from "axios";
import { CreateTeacherData, LoginResponse, RegisterResponse, UpdateProfilePayload, User } from "../types/auth.types";

// ⚙️ API Configuration
// For iOS Simulator: "http://localhost:3000/api"
// For Android Emulator: "http://10.0.2.2:3000/api"
// For Physical Device: Use your computer's IP, "http://192.168.1.X:3000/api"
const API_URL = "http://localhost:3000/api";

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
    
};

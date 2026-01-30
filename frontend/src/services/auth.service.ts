import axios from "axios";
import { LoginResponse } from "../types/auth.types";

// ⚙️ API Configuration
// For iOS Simulator: "http://localhost:3000/api"
// For Android Emulator: "http://10.0.2.2:3000/api"
// For Physical Device: Use your computer's IP, "http://192.168.1.X:3000/api"
const API_URL = "http://localhost:3000/api";

export const authService = {
    // Sends login credentials to the backend.Returns the access token and user data if successful.
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
            email,
            password,
        });
        return response.data;
    },
};

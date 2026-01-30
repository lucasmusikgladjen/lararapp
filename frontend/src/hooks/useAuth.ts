import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";
import { LoginResponse } from "../types/auth.types";

export const useLogin = () => {
    const router = useRouter();
    const loginToStore = useAuthStore((state) => state.login);

    return useMutation({
        // The actual function that calls the API. React Query passes the variables (email, password) here.
        mutationFn: async ({ email, password }: any) => {
            return await authService.login(email, password);
        },

        // Runs only if the API returns 200 OK.
        onSuccess: (data: LoginResponse) => {
            console.log("Login successful for:", data.data.user.email);

            // 1. Save Token & User to Zustand Store (and SecureStore)
            loginToStore(data.data.access_token, data.data.user);

            // 2. Navigate to the protected app area
            // This matches your folder structure: app/(auth)/index.tsx
            router.replace("/(auth)");
        },

        // Runs if the API returns 400, 401, or 500.
        onError: (error: any) => {
            console.error("Login failed:", error);

            const message = error.response?.data?.message || "Something went wrong. Please try again.";

            Alert.alert("Login Failed", message);
        },
    });
};

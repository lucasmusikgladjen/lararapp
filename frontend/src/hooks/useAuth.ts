import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";
import { CreateTeacherData, LoginResponse, RegisterResponse } from "../types/auth.types";

export const useLogin = () => {
    const router = useRouter();
    const loginToStore = useAuthStore((state) => state.login);

    return useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            return await authService.login(email, password);
        },

        onSuccess: (data: LoginResponse) => {
            console.log("Login successful for:", data.data.user.email);
            loginToStore(data.data.access_token, data.data.user);
            router.replace("/(auth)");
        },

        onError: (error: any) => {
            console.error("Login failed:", error);
            const message = error.response?.data?.message || "Something went wrong. Please try again.";
            Alert.alert("Login Failed", message);
        },
    });
};

export const useRegister = () => {
    const router = useRouter();
    const loginToStore = useAuthStore((state) => state.login);

    return useMutation({
        mutationFn: async (data: CreateTeacherData) => {
            return await authService.register(data);
        },

        onSuccess: (data: RegisterResponse) => {
            console.log("Registration successful for:", data.data.user.email);
            loginToStore(data.data.access_token, data.data.user);
            router.replace("/(auth)/onboarding/instruments");
        },

        onError: (error: any) => {
            console.error("Registration failed:", error);

            // Check for validation errors (400) - e.g. email already exists
            const validationErrors = error.response?.data?.data?.errors;
            if (validationErrors && Array.isArray(validationErrors)) {
                const emailError = validationErrors.find((e: any) => e.path === "email");
                if (emailError) {
                    Alert.alert("Registrering misslyckades", "E-postadressen är redan registrerad.");
                    return;
                }
            }

            const message = error.response?.data?.message || "Något gick fel. Försök igen.";
            Alert.alert("Registrering misslyckades", message);
        },
    });
};

import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { AuthState, User } from "../types/auth.types";

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    isAuthenticated: false,

    login: async (token: string, user: User) => {
        // 1. Update app state immediately (so UI reacts fast)
        set({ token, user, isAuthenticated: true });

        // 2. Persist securely on device (to remember login next time)
        try {
            await SecureStore.setItemAsync("access_token", token);
            await SecureStore.setItemAsync("user_data", JSON.stringify(user));
        } catch (error) {
            console.error("Could not securely save login data:", error);
        }
    },

    logout: async () => {
        // 1. Clear state
        set({ token: null, user: null, isAuthenticated: false });

        // 2. Remove data from device
        try {
            await SecureStore.deleteItemAsync("access_token");
            await SecureStore.deleteItemAsync("user_data");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    },
}));

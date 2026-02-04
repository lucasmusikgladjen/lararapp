import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { AuthState, User } from "../types/auth.types";

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: true,

            login: async (token: string, user: User) => {
                set({ token, user, isAuthenticated: true });
                await SecureStore.setItemAsync("access_token", token);
            },

            logout: async () => {
                set({ token: null, user: null, isAuthenticated: false });
                await SecureStore.deleteItemAsync("access_token");
            },

            loadUser: async () => {
                try {
                    const token = await SecureStore.getItemAsync("access_token");
                    if (token) {
                        set({ token, isAuthenticated: true, isLoading: false });
                    } else {
                        set({
                            token: null,
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                        });
                    }
                } catch (error) {
                    console.error("Failed to load user:", error);
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: "auth-user-storage",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ user: state.user }),
        }
    )
);

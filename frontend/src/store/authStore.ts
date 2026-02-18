import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { AuthState, User } from "../types/auth.types";

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: true,
            needsOnboarding: false,

            login: async (token: string, user: User) => {
                set({ token, user, isAuthenticated: true });
                await SecureStore.setItemAsync("access_token", token);
            },

            logout: async () => {
                set({ token: null, user: null, isAuthenticated: false, needsOnboarding: false });
                await SecureStore.deleteItemAsync("access_token");
            },

            setNeedsOnboarding: (value: boolean) => {
                set({ needsOnboarding: value });
            },

            // NEW: Updates local user state (merges with existing)
            updateUser: (userData: Partial<User>) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({ user: { ...currentUser, ...userData } });
                }
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
        },
    ),
);

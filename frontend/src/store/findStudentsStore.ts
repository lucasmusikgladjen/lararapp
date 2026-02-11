import { create } from "zustand";
import { StudentPublicDTO } from "../types/student.types";
import { searchStudents } from "../services/student.service";
import { useAuthStore } from "./authStore";

const DEFAULT_RADIUS_KM = 10;
const DEBOUNCE_MS = 500;

interface UserLocation {
    lat: number;
    lng: number;
}

interface FindStudentsState {
    students: StudentPublicDTO[];
    loading: boolean;
    userLocation: UserLocation | null;
    selectedStudent: StudentPublicDTO | null;
    filter: string | null;
    searchQuery: string;
    radius: number;

    fetchStudents: (lat: number, lng: number, radius?: number) => Promise<void>;
    setUserLocation: (location: UserLocation) => void;
    setFilter: (instrument: string | null) => void;
    setSearchQuery: (query: string) => void;
    selectStudent: (student: StudentPublicDTO | null) => void;
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export const useFindStudentsStore = create<FindStudentsState>()((set, get) => ({
    students: [],
    loading: false,
    userLocation: null,
    selectedStudent: null,
    filter: null,
    searchQuery: "",
    radius: DEFAULT_RADIUS_KM,

    fetchStudents: async (lat: number, lng: number, radius?: number) => {
        set({ loading: true });
        try {
            const token = useAuthStore.getState().token;

            if (!token) {
                console.error("No token found!");
                set({ loading: false });
                return;
            }

            const r = radius ?? get().radius;
            const filter = get().filter ?? undefined;
            const searchQuery = get().searchQuery || undefined;
            const data = await searchStudents(token, lat, lng, r, filter, searchQuery);
            set({ students: data, loading: false });
        } catch (error) {
            console.error("Failed to fetch students:", error);
            set({ loading: false });
        }
    },

    setUserLocation: (location: UserLocation) => {
        set({ userLocation: location });
    },

    setFilter: (instrument: string | null) => {
        set({ filter: instrument });

        // Immediately refetch with new filter
        const { userLocation, radius, fetchStudents } = get();
        if (userLocation) {
            fetchStudents(userLocation.lat, userLocation.lng, radius);
        }
    },

    setSearchQuery: (query: string) => {
        set({ searchQuery: query });

        // Debounce the API call
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
            const { userLocation, radius, fetchStudents } = get();
            if (userLocation) {
                fetchStudents(userLocation.lat, userLocation.lng, radius);
            }
            debounceTimer = null;
        }, DEBOUNCE_MS);
    },

    selectStudent: (student: StudentPublicDTO | null) => {
        set({ selectedStudent: student });
    },
}));

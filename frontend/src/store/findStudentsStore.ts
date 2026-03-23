import { create } from "zustand";
import { StudentPublicDTO } from "../types/student.types";
import { searchStudents } from "../services/student.service";
import { useAuthStore } from "./authStore";
import { Region } from "react-native-maps";

// Radie (km) = (latitudeDelta * 111) / 2
const KM_PER_DEGREE_LAT = 111;

// Tröskel för att visa "Sök i området"-knappen
const CENTER_MOVE_THRESHOLD_KM = 0.5;
const DELTA_CHANGE_THRESHOLD = 0.2; // 20% förändring

interface MapRegion {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

interface FindStudentsState {
    students: StudentPublicDTO[];
    loading: boolean;

    userLocation: { lat: number; lng: number } | null;

    selectedStudent: StudentPublicDTO | null;
    filter: string | null;

    mapRegion: MapRegion | null;
    lastSearchRegion: MapRegion | null;
    showSearchButton: boolean;

    fetchStudents: (lat: number, lng: number, radius: number) => Promise<void>;
    setUserLocation: (location: { lat: number; lng: number }) => void;
    setFilter: (instrument: string | null) => void;
    selectStudent: (student: StudentPublicDTO | null) => void;

    setMapRegion: (region: MapRegion) => void;
    updateShowSearchButton: (region: MapRegion) => void;
    searchInArea: () => Promise<void>;
}

/**
 * Beräknar ungefärligt avstånd i km mellan två punkter.
 * Använder en förenklad formel (inte full Haversine) för prestanda.
 */
function approximateDistanceKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
): number {
    const dLat = (lat2 - lat1) * KM_PER_DEGREE_LAT;
    const avgLat = ((lat1 + lat2) / 2) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * KM_PER_DEGREE_LAT * Math.cos(avgLat);
    return Math.sqrt(dLat * dLat + dLng * dLng);
}

/**
 * Beräknar sökradie baserat på kartans zoom-nivå (latitudeDelta).
 * Formel: Radius (km) = (latitudeDelta * 111) / 2
 */
function calculateRadiusFromDelta(latitudeDelta: number): number {
    return (latitudeDelta * KM_PER_DEGREE_LAT) / 2;
}

export const useFindStudentsStore = create<FindStudentsState>()((set, get) => ({
    students: [],
    loading: false,
    userLocation: null,
    selectedStudent: null,
    filter: null,

    mapRegion: null,
    lastSearchRegion: null,
    showSearchButton: false,

    fetchStudents: async (lat: number, lng: number, radius: number) => {
        set({ loading: true });
        try {
            const token = useAuthStore.getState().token;
            if (!token) {
                console.error("No token found!");
                set({ loading: false });
                return;
            }

            const filter = get().filter ?? undefined;

            const data = await searchStudents({
                token,
                lat,
                lng,
                radius,
                instrument: filter,
                searchQuery: undefined,
            });

            set({ students: data, loading: false });
        } catch (error) {
            console.error("Failed to fetch students:", error);
            set({ loading: false });
        }
    },

    setUserLocation: (location: { lat: number; lng: number }) => {
        set({ userLocation: location });
    },

    setFilter: (instrument: string | null) => {
        set({ filter: instrument });

        const { lastSearchRegion, fetchStudents } = get();

        if (lastSearchRegion) {
            const radius = calculateRadiusFromDelta(lastSearchRegion.latitudeDelta);
            fetchStudents(lastSearchRegion.latitude, lastSearchRegion.longitude, radius);
        }
    },

    selectStudent: (student: StudentPublicDTO | null) => {
        set({ selectedStudent: student });
    },

    setMapRegion: (region: MapRegion) => {
        set({ mapRegion: region });
    },

    updateShowSearchButton: (region: MapRegion) => {
        const { lastSearchRegion } = get();

        // Om ingen sökning har gjorts ännu, visa inte knappen
        if (!lastSearchRegion) return;

        // Beräkna avstånd mellan mittpunkterna
        const distanceKm = approximateDistanceKm(
            lastSearchRegion.latitude,
            lastSearchRegion.longitude,
            region.latitude,
            region.longitude,
        );

        // Beräkna relativ förändring i zoom-nivå (delta)
        const deltaChange = Math.abs(
            region.latitudeDelta - lastSearchRegion.latitudeDelta,
        ) / lastSearchRegion.latitudeDelta;

        const shouldShow =
            distanceKm > CENTER_MOVE_THRESHOLD_KM ||
            deltaChange > DELTA_CHANGE_THRESHOLD;

        set({ showSearchButton: shouldShow, mapRegion: region });
    },

    searchInArea: async () => {
        const { mapRegion, fetchStudents } = get();
        if (!mapRegion) return;

        const radius = calculateRadiusFromDelta(mapRegion.latitudeDelta);

        set({
            showSearchButton: false,
            lastSearchRegion: { ...mapRegion },
        });

        await fetchStudents(mapRegion.latitude, mapRegion.longitude, radius);
    },
}));

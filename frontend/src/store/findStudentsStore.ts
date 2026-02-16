import { create } from "zustand";
import * as Location from "expo-location";
import { StudentPublicDTO } from "../types/student.types";
import { searchStudents } from "../services/student.service";
import { useAuthStore } from "./authStore";

const DEFAULT_RADIUS_KM = 20; // Standardradie för GPS (Nära mig)
const CITY_RADIUS_KM = 15; // Standardradie för Stadssökning
const DEBOUNCE_MS = 1000;

interface UserLocation {
    lat: number;
    lng: number;
}

interface FindStudentsState {
    students: StudentPublicDTO[];
    loading: boolean;

    userLocation: UserLocation | null; // Din fysiska GPS-position
    searchLocation: UserLocation | null; // Den plats kartan "tittar på" just nu (kan vara Malmö)

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
    searchLocation: null, // <-- NY STATE
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

            const filter = get().filter ?? undefined;
            // Använd radius från argumentet om det finns, annars från state
            const r = radius ?? get().radius;

            const data = await searchStudents({
                token: token,
                lat: lat,
                lng: lng,
                radius: r,
                instrument: filter,
                searchQuery: undefined, // Vi kör alltid geo-sök nu
            });

            set({ students: data, loading: false });
        } catch (error) {
            console.error("Failed to fetch students:", error);
            set({ loading: false });
        }
    },

    setUserLocation: (location: UserLocation) => {
        // När vi startar appen och får GPS, sätter vi både User och Search location
        set({
            userLocation: location,
            searchLocation: location,
        });
    },

    setFilter: (instrument: string | null) => {
        set({ filter: instrument });

        // HÄR ÄR FIXEN:
        // Vi använder 'searchLocation' (där kartan är) istället för 'userLocation' (där du är).
        const { searchLocation, userLocation, radius, fetchStudents } = get();

        const targetLocation = searchLocation || userLocation;

        if (targetLocation) {
            fetchStudents(targetLocation.lat, targetLocation.lng, radius);
        }
    },

  setSearchQuery: (query: string) => {
        set({ searchQuery: query });

        if (debounceTimer) clearTimeout(debounceTimer);

        debounceTimer = setTimeout(async () => {
            // Hämta nuvarande state
            const { userLocation, radius, fetchStudents } = get();
            
            // 1. FIXEN: Om sökfältet är tomt -> Gör ingenting med kartan!
            // Vi vill stanna kvar där vi är (t.ex. Malmö).
            if (!query.trim()) {
                console.log("Empty search, staying at current location");
                return; 
            }

            // 2. GEOCODING (Samma som förut)
            try {
                set({ loading: true });
                const geocoded = await Location.geocodeAsync(query);
                
                if (geocoded.length > 0) {
                    const result = geocoded[0];
                    console.log(`Geocoded '${query}' to:`, result.latitude, result.longitude);
                    
                    const newLocation = { lat: result.latitude, lng: result.longitude };

                    // Uppdatera state till den nya staden
                    set({ 
                        searchLocation: newLocation, 
                        radius: CITY_RADIUS_KM 
                    });

                    // Sök!
                    await fetchStudents(result.latitude, result.longitude, CITY_RADIUS_KM);
                } else {
                    console.log("Platsen hittades inte.");
                    set({ loading: false });
                }
            } catch (error) {
                console.error("Geocoding failed:", error);
                set({ loading: false });
            }
            
            debounceTimer = null;
        }, DEBOUNCE_MS);
    },

    selectStudent: (student: StudentPublicDTO | null) => {
        set({ selectedStudent: student });
    },
}));

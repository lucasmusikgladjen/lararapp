import { useEffect, useRef, useState } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useFindStudentsStore } from "../../src/store/findStudentsStore";
import { StudentPublicDTO } from "../../src/types/student.types";

// Stockholm fallback when location permission is denied
const STOCKHOLM = { lat: 59.3293, lng: 18.0686 };
const DEFAULT_RADIUS_KM = 10;
const DEFAULT_DELTA = 0.08;

// Marker color based on instrument
const MARKER_COLORS: Record<string, string> = {
    piano: "#F97316",
    gitarr: "#34C759",
    fiol: "#EF4444",
    trummor: "#8B5CF6",
};

function getMarkerColor(instruments: string[]): string {
    const first = instruments[0]?.toLowerCase();
    return MARKER_COLORS[first] ?? "#14B8A6";
}

export default function FindStudents() {
    const mapRef = useRef<MapView>(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [initializing, setInitializing] = useState(true);

    const { students, loading, userLocation, fetchStudents, setUserLocation, selectStudent, selectedStudent } = useFindStudentsStore();

    // Request location permission and fetch initial data
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();

            let location = STOCKHOLM;

            if (status === "granted") {
                try {
                    const pos = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.Balanced,
                    });
                    location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                } catch {
                    // Fall back to Stockholm if position fetch fails
                }
            } else {
                setPermissionDenied(true);
            }

            setUserLocation(location);
            await fetchStudents(location.lat, location.lng, DEFAULT_RADIUS_KM);
            setInitializing(false);
        })();
    }, []);

    if (initializing) {
        return (
            <View className="flex-1 items-center justify-center bg-brand-bg">
                <ActivityIndicator size="large" color="#F97316" />
                <Text className="text-gray-400 mt-3 text-sm">Laddar karta...</Text>
            </View>
        );
    }

    const initialRegion: Region = {
        latitude: userLocation?.lat ?? STOCKHOLM.lat,
        longitude: userLocation?.lng ?? STOCKHOLM.lng,
        latitudeDelta: DEFAULT_DELTA,
        longitudeDelta: DEFAULT_DELTA,
    };

    return (
        <View className="flex-1 bg-brand-bg">
            {/* Map fills the entire screen */}
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
                initialRegion={initialRegion}
                showsUserLocation={!permissionDenied}
                showsMyLocationButton
            >
                {students.map((student) => (
                    <StudentMarker
                        key={student.id}
                        student={student}
                        isSelected={selectedStudent?.id === student.id}
                        onPress={() => selectStudent(student)}
                    />
                ))}
            </MapView>

            {/* Loading overlay when fetching students */}
            {loading && (
                <View className="absolute top-20 self-center bg-white rounded-full px-4 py-2 shadow-sm">
                    <Text className="text-sm text-gray-500">Söker elever...</Text>
                </View>
            )}

            {/* Permission denied banner */}
            {permissionDenied && (
                <View className="absolute bottom-6 self-center bg-white rounded-2xl px-5 py-3 shadow-sm mx-5">
                    <Text className="text-sm text-gray-500 text-center">Platsåtkomst nekad. Visar Stockholm som standard.</Text>
                </View>
            )}
        </View>
    );
}

// ─── Custom Marker ──────────────────────────────────────────────────────
interface StudentMarkerProps {
    student: StudentPublicDTO;
    isSelected: boolean;
    onPress: () => void;
}

function StudentMarker({ student, isSelected, onPress }: StudentMarkerProps) {
    if (!student.lat || !student.lng) return null;

    const color = getMarkerColor(student.instruments);
    const size = isSelected ? 20 : 14;

    return (
        <Marker coordinate={{ latitude: student.lat, longitude: student.lng }} onPress={onPress} tracksViewChanges={false}>
            <View
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: color,
                    borderWidth: 2,
                    borderColor: "#FFFFFF",
                }}
            />
        </Marker>
    );
}

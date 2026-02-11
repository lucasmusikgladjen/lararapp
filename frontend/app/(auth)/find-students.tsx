import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, ActivityIndicator, Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useFindStudentsStore } from "../../src/store/findStudentsStore";
import { StudentPublicDTO } from "../../src/types/student.types";
import { FilterBar } from "../../src/components/find-students/FilterBar";
import { StudentListSheet } from "../../src/components/find-students/StudentListSheet";
import { StudentInfoCard } from "../../src/components/find-students/StudentInfoCard";

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

const ANIMATE_DELTA = 0.02;

export default function FindStudents() {
    const mapRef = useRef<MapView>(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [sheetVisible, setSheetVisible] = useState(true);

    const { students, loading, userLocation, fetchStudents, setUserLocation, selectStudent, selectedStudent } = useFindStudentsStore();

    // Animate map to a student's location
    const animateToStudent = useCallback((student: StudentPublicDTO) => {
        if (!student.lat || !student.lng || !mapRef.current) return;
        mapRef.current.animateToRegion(
            {
                latitude: student.lat,
                longitude: student.lng,
                latitudeDelta: ANIMATE_DELTA,
                longitudeDelta: ANIMATE_DELTA,
            },
            400,
        );
    }, []);

    // List item pressed → select + animate
    const handleListStudentPress = useCallback(
        (student: StudentPublicDTO) => {
            selectStudent(student);
            animateToStudent(student);
        },
        [selectStudent, animateToStudent],
    );

    // Marker pressed → select student (info card will show)
    const handleMarkerPress = useCallback(
        (student: StudentPublicDTO) => {
            selectStudent(student);
        },
        [selectStudent],
    );

    // Tap empty map area → deselect
    const handleMapPress = useCallback(() => {
        if (selectedStudent) {
            selectStudent(null);
        }
    }, [selectedStudent, selectStudent]);

    // Info card "Läs mer" → placeholder for Phase 4 detail modal
    const handleReadMore = useCallback((_student: StudentPublicDTO) => {
        // Will open StudentDetailModal in Phase 4
    }, []);

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
                onPress={handleMapPress}
            >
                {students.map((student) => (
                    <StudentMarker
                        key={student.id}
                        student={student}
                        isSelected={selectedStudent?.id === student.id}
                        onPress={() => handleMarkerPress(student)}
                    />
                ))}
            </MapView>

            {/* Search bar + filter chips overlay */}
            <FilterBar />

            {/* Student info card (marker click overlay) */}
            {selectedStudent && (
                <StudentInfoCard
                    student={selectedStudent}
                    onClose={() => selectStudent(null)}
                    onReadMore={handleReadMore}
                />
            )}

            {/* Loading overlay when fetching students */}
            {loading && (
                <View className="absolute top-40 self-center bg-white rounded-full px-4 py-2 shadow-sm">
                    <Text className="text-sm text-gray-500">Söker elever...</Text>
                </View>
            )}

            {/* Student list bottom sheet */}
            <StudentListSheet
                onStudentPress={handleListStudentPress}
                visible={sheetVisible}
                onClose={() => setSheetVisible(false)}
            />

            {/* Reopen sheet button (when closed) */}
            {!sheetVisible && (
                <View className="absolute bottom-6 self-center">
                    <TouchableOpacity
                        onPress={() => setSheetVisible(true)}
                        activeOpacity={0.85}
                        className="bg-white rounded-full px-5 py-3 flex-row items-center"
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                    >
                        <Ionicons name="people-outline" size={18} color="#F97316" />
                        <Text className="text-slate-900 font-semibold text-sm ml-2">
                            Elever i närheten ({students.length})
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Permission denied banner */}
            {permissionDenied && !sheetVisible && (
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

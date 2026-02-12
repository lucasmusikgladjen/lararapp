import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { FilterBar } from "../../src/components/find-students/FilterBar";
import { StudentDetailModal } from "../../src/components/find-students/StudentDetailModal";
import { StudentInfoCard } from "../../src/components/find-students/StudentInfoCard";
import { StudentListSheet } from "../../src/components/find-students/StudentListSheet";
import { useFindStudentsStore } from "../../src/store/findStudentsStore";
import { StudentPublicDTO } from "../../src/types/student.types";

// Stockholm fallback when location permission is denied
const STOCKHOLM = { lat: 59.3293, lng: 18.0686 };
const DEFAULT_RADIUS_KM = 10;
const DEFAULT_DELTA = 0.08;

// Marker color based on instrument
const MARKER_COLORS: Record<string, string> = {
    piano: "#F97316",
    gitarr: "#8B5CF6",
    fiol: "#EF4444",
    trummor: "#ef476f",
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
    const [detailModalVisible, setDetailModalVisible] = useState(false);

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

    // Info card "Läs mer" → open detail modal
    const handleReadMore = useCallback((_student: StudentPublicDTO) => {
        setDetailModalVisible(true);
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
            {selectedStudent && <StudentInfoCard student={selectedStudent} onClose={() => selectStudent(null)} onReadMore={handleReadMore} />}

            {/* Loading overlay when fetching students */}
            {loading && (
                <View className="absolute top-40 self-center bg-white rounded-full px-4 py-2 shadow-sm">
                    <Text className="text-sm text-gray-500">Söker elever...</Text>
                </View>
            )}

            {/* Student list bottom sheet */}
            <StudentListSheet onStudentPress={handleListStudentPress} visible={sheetVisible} onClose={() => setSheetVisible(false)} />

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
                        <Text className="text-slate-900 font-semibold text-sm ml-2">Elever i närheten ({students.length})</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Permission denied banner */}
            {permissionDenied && !sheetVisible && (
                <View className="absolute bottom-6 self-center bg-white rounded-2xl px-5 py-3 shadow-sm mx-5">
                    <Text className="text-sm text-gray-500 text-center">Platsåtkomst nekad. Visar Stockholm som standard.</Text>
                </View>
            )}

            {/* Student detail modal (Phase 4) */}
            <StudentDetailModal visible={detailModalVisible} student={selectedStudent} onClose={() => setDetailModalVisible(false)} />
        </View>
    );
}

// ─── Custom Pin Marker (Google Maps Style) ──────────────────────────────────
interface StudentMarkerProps {
    student: StudentPublicDTO;
    isSelected: boolean;
    onPress: () => void;
}

function StudentMarker({ student, isSelected, onPress }: StudentMarkerProps) {
    if (!student.lat || !student.lng) return null;

    const color = getMarkerColor(student.instruments);
    // Scale effect for selection
    const scale = isSelected ? 1.2 : 1;

    // Dimensions for the "White Border" layer vs "Colored Content" layer
    // We make the white layer slightly larger to create the border effect
    const HEAD_SIZE = 36;
    const BORDER_WIDTH = 2.5;
    const INNER_HEAD_SIZE = HEAD_SIZE - BORDER_WIDTH * 2;

    return (
        <Marker
            coordinate={{ latitude: student.lat, longitude: student.lng }}
            onPress={onPress}
            tracksViewChanges={false}
            zIndex={isSelected ? 999 : 1}
            // Anchor at (0.5, 1) puts the tip of the triangle at the coordinate
            anchor={{ x: 0.5, y: 1 }}
            centerOffset={{ x: 0, y: -(HEAD_SIZE / 2 + 6) }} // Adjust visual center slightly up if needed
        >
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    transform: [{ scale }],
                    // Add a shadow to the whole pin for depth (lifting it off the map)
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 5,
                }}
            >
                {/* 1. THE HEAD (Circle) */}
                <View
                    style={{
                        width: HEAD_SIZE,
                        height: HEAD_SIZE,
                        borderRadius: HEAD_SIZE / 2,
                        backgroundColor: "white", // Acts as the border
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* Inner Colored Circle */}
                    <View
                        style={{
                            width: INNER_HEAD_SIZE,
                            height: INNER_HEAD_SIZE,
                            borderRadius: INNER_HEAD_SIZE / 2,
                            backgroundColor: color,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Ionicons name="musical-notes" size={16} color="white" />
                    </View>
                </View>

                {/* 2. THE TAIL (Triangle) */}
                <View style={{ marginTop: -2, alignItems: "center" }}>
                    {/* White Triangle (Border) */}
                    <View
                        style={{
                            width: 0,
                            height: 0,
                            backgroundColor: "transparent",
                            borderStyle: "solid",
                            borderLeftWidth: 8,
                            borderRightWidth: 8,
                            borderTopWidth: 10,
                            borderLeftColor: "transparent",
                            borderRightColor: "transparent",
                            borderTopColor: "white", // The border color
                        }}
                    />

                    {/* Colored Triangle (Overlay) */}
                    {/* We position this absolutely on top of the white one to leave a 'border' visible */}
                    <View
                        style={{
                            position: "absolute",
                            top: -2.5, // Shift up to cover the top part of the white triangle
                            width: 0,
                            height: 0,
                            backgroundColor: "transparent",
                            borderStyle: "solid",
                            borderLeftWidth: 5.5, // Slightly narrower
                            borderRightWidth: 5.5,
                            borderTopWidth: 7.5, // Slightly shorter
                            borderLeftColor: "transparent",
                            borderRightColor: "transparent",
                            borderTopColor: color,
                        }}
                    />
                </View>
            </View>
        </Marker>
    );
}

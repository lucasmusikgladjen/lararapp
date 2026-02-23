import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { FilterBar } from "../../../src/components/find-students/FilterBar";
import { StudentDetailModal } from "../../../src/components/find-students/StudentDetailModal";
import { StudentListSheet } from "../../../src/components/find-students/StudentListSheet";
import { useFindStudentsStore } from "../../../src/store/findStudentsStore";
import { StudentPublicDTO } from "../../../src/types/student.types";

const STOCKHOLM = { lat: 59.3293, lng: 18.0686 };
const DEFAULT_RADIUS_KM = 10; // 15km 
const DEFAULT_DELTA = 0.08;
const ANIMATE_DELTA = 0.02;

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

export default function FindStudents() {
    // 1. ALLA HOOKS MÅSTE LIGGA HÄR I BÖRJAN
    const mapRef = useRef<MapView>(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [isListVisible, setIsListVisible] = useState(true);

    const { students, loading, userLocation, fetchStudents, setUserLocation, selectStudent, selectedStudent } = useFindStudentsStore();

    // --- ANIMATION LOGIC ---
    const animateToStudent = useCallback((student: StudentPublicDTO) => {
        if (!student.lat || !student.lng || !mapRef.current) return;
        const latitudeOffset = ANIMATE_DELTA * 0.15;
        mapRef.current.animateToRegion(
            {
                latitude: student.lat - latitudeOffset,
                longitude: student.lng,
                latitudeDelta: ANIMATE_DELTA,
                longitudeDelta: ANIMATE_DELTA,
            },
            500,
        );
    }, []);

    const handleMarkerPress = useCallback(
        (student: StudentPublicDTO) => {
            selectStudent(student);
            animateToStudent(student);
            setIsListVisible(false);
        },
        [selectStudent, animateToStudent],
    );

    const handleListStudentPress = useCallback(
        (student: StudentPublicDTO) => {
            selectStudent(student);
            animateToStudent(student);
            setIsListVisible(false);
        },
        [selectStudent, animateToStudent],
    );

    const handleMapPress = useCallback(() => {
        selectStudent(null);
        setIsListVisible(true);
    }, [selectStudent]);

    // Initial Load Effect
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            let location = STOCKHOLM;
            if (status === "granted") {
                try {
                    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                    location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                } catch {}
            } else {
                setPermissionDenied(true);
            }
            setUserLocation(location);
            await fetchStudents(location.lat, location.lng, DEFAULT_RADIUS_KM);
            setInitializing(false);
        })();
    }, []);

    // AUTO-ZOOM EFFECT
    useEffect(() => {
        if (initializing || !mapRef.current || students.length === 0) return;
        if (selectedStudent) return;

        const coordinates = students
            .map((s) => {
                if (typeof s.lat === "number" && typeof s.lng === "number") {
                    return { latitude: s.lat, longitude: s.lng };
                }
                return null;
            })
            .filter((c): c is { latitude: number; longitude: number } => c !== null);

        if (coordinates.length === 0) return;

        const EDGE_PADDING = {
            top: 100,
            right: 50,
            bottom: 300,
            left: 50,
        };

        // --- SMART ZOOM LOGIC ---

        // Scenario A: Only 1 student found (e.g. Julian in Lund)
        // Don't use fitToCoordinates because it zooms to street level.
        // Instead, center on that student but keep a "City View" zoom level.
        if (coordinates.length === 1) {
            mapRef.current.animateToRegion(
                {
                    latitude: coordinates[0].latitude,
                    longitude: coordinates[0].longitude,
                    latitudeDelta: 0.08, // 0.08 is roughly "City View" (approx 10-15km view)
                    longitudeDelta: 0.08,
                },
                1000,
            );
        }
        // Scenario B: Multiple students found
        else {
            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: EDGE_PADDING,
                animated: true,
            });
        }
    }, [students, selectedStudent, initializing]);

    // 2. HÄR KOMMER DIN CONDITIONAL RETURN
    if (initializing) {
        return (
            <View className="flex-1 items-center justify-center bg-brand-bg">
                <ActivityIndicator size="large" color="#F97316" />
                <Text className="text-gray-400 mt-3 text-sm">Laddar karta...</Text>
            </View>
        );
    }

    // 3. SEN KOMMER RESTEN AV JSX
    const initialRegion: Region = {
        latitude: userLocation?.lat ?? STOCKHOLM.lat,
        longitude: userLocation?.lng ?? STOCKHOLM.lng,
        latitudeDelta: DEFAULT_DELTA,
        longitudeDelta: DEFAULT_DELTA,
    };

    return (
        <View className="flex-1 bg-brand-bg">
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

            <FilterBar />

            {loading && (
                <View className="absolute top-40 self-center bg-white rounded-full px-4 py-2 shadow-sm">
                    <Text className="text-sm text-gray-500">Söker elever...</Text>
                </View>
            )}

            <StudentListSheet
                onStudentPress={handleListStudentPress}
                visible={isListVisible && !selectedStudent}
                onClose={() => setIsListVisible(false)}
            />

            {!isListVisible && !selectedStudent && (
                <View className="absolute bottom-6 self-center">
                    <TouchableOpacity
                        onPress={() => setIsListVisible(true)}
                        activeOpacity={0.85}
                        className="bg-white rounded-full px-5 py-3 flex-row items-center shadow-md"
                    >
                        <Ionicons name="people-outline" size={18} color="#F97316" />
                        <Text className="text-slate-900 font-semibold text-sm ml-2">Visa lista</Text>
                    </TouchableOpacity>
                </View>
            )}

            {selectedStudent && <StudentDetailModal student={selectedStudent} onClose={handleMapPress} />}
        </View>
    );
}

// ... (Keep your existing StudentMarker component below)
interface StudentMarkerProps {
    student: StudentPublicDTO;
    isSelected: boolean;
    onPress: () => void;
}

function StudentMarker({ student, isSelected, onPress }: StudentMarkerProps) {
    if (!student.lat || !student.lng) return null;
    const color = getMarkerColor(student.instruments);
    const scale = isSelected ? 1.2 : 1;
    const HEAD_SIZE = 36;
    const BORDER_WIDTH = 2.5;
    const INNER_HEAD_SIZE = HEAD_SIZE - BORDER_WIDTH * 2;

    return (
        <Marker
            coordinate={{ latitude: student.lat, longitude: student.lng }}
            onPress={(e) => {
                e.stopPropagation(); // Stop map click event
                onPress();
            }}
            tracksViewChanges={false}
            zIndex={isSelected ? 999 : 1}
            anchor={{ x: 0.5, y: 1 }}
            centerOffset={{ x: 0, y: -(HEAD_SIZE / 2 + 6) }}
        >
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    transform: [{ scale }],
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 5,
                }}
            >
                <View
                    style={{
                        width: HEAD_SIZE,
                        height: HEAD_SIZE,
                        borderRadius: HEAD_SIZE / 2,
                        backgroundColor: "white",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
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
                <View style={{ marginTop: -2, alignItems: "center" }}>
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
                            borderTopColor: "white",
                        }}
                    />
                    <View
                        style={{
                            position: "absolute",
                            top: -2.5,
                            width: 0,
                            height: 0,
                            backgroundColor: "transparent",
                            borderStyle: "solid",
                            borderLeftWidth: 5.5,
                            borderRightWidth: 5.5,
                            borderTopWidth: 7.5,
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

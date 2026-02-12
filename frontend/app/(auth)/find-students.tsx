import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { FilterBar } from "../../src/components/find-students/FilterBar";
import { StudentDetailModal } from "../../src/components/find-students/StudentDetailModal";
import { StudentListSheet } from "../../src/components/find-students/StudentListSheet";
import { useFindStudentsStore } from "../../src/store/findStudentsStore";
import { StudentPublicDTO } from "../../src/types/student.types";

const STOCKHOLM = { lat: 59.3293, lng: 18.0686 };
const DEFAULT_RADIUS_KM = 10;
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
    const mapRef = useRef<MapView>(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [initializing, setInitializing] = useState(true);
    
    // UI State: 'list' (browsing) or 'detail' (viewing a student)
    const [isListVisible, setIsListVisible] = useState(true);

    const { students, loading, userLocation, fetchStudents, setUserLocation, selectStudent, selectedStudent } = useFindStudentsStore();

    // --- ANIMATION LOGIC ---
    const animateToStudent = useCallback((student: StudentPublicDTO) => {
        if (!student.lat || !student.lng || !mapRef.current) return;

        // OFFSET TRICK:
        // Since the Detail Sheet (at Peek/25%) covers the bottom 1/4 of the screen,
        // we want the marker to be centered in the remaining top 3/4.
        // We shift the camera 'South' slightly so the marker appears 'North' (up).
        const latitudeOffset = ANIMATE_DELTA * 0.15; 

        mapRef.current.animateToRegion({
            latitude: student.lat - latitudeOffset, 
            longitude: student.lng,
            latitudeDelta: ANIMATE_DELTA,
            longitudeDelta: ANIMATE_DELTA,
        }, 500);
    }, []);

    // 1. CLICK MARKER (The interaction you asked for!)
    const handleMarkerPress = useCallback((student: StudentPublicDTO) => {
        selectStudent(student);      // 1. Select student data
        animateToStudent(student);   // 2. Pan map (with offset)
        setIsListVisible(false);     // 3. Hide list -> Reveals Detail Sheet
    }, [selectStudent, animateToStudent]);

    // 2. CLICK LIST ITEM
    const handleListStudentPress = useCallback((student: StudentPublicDTO) => {
        selectStudent(student);
        animateToStudent(student);
        setIsListVisible(false);
    }, [selectStudent, animateToStudent]);

    // 3. CLOSE DETAIL / CLICK MAP
    const handleMapPress = useCallback(() => {
        selectStudent(null);
        setIsListVisible(true); // Show list again
    }, [selectStudent]);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            let location = STOCKHOLM;
            if (status === "granted") {
                try {
                    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                    location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                } catch { }
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

            {/* LIST SHEET (Visible only when NO student selected) */}
            <StudentListSheet 
                onStudentPress={handleListStudentPress} 
                visible={isListVisible && !selectedStudent} 
                onClose={() => setIsListVisible(false)} 
            />

            {/* RE-OPEN LIST BUTTON */}
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

            {/* DETAIL SHEET (Visible when student IS selected) */}
            {selectedStudent && (
                <StudentDetailModal 
                    student={selectedStudent} 
                    onClose={handleMapPress} // Clicking 'X' or dragging down deselects
                />
            )}
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
            <View style={{ alignItems: "center", justifyContent: "center", transform: [{ scale }], shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 3, elevation: 5 }}>
                <View style={{ width: HEAD_SIZE, height: HEAD_SIZE, borderRadius: HEAD_SIZE / 2, backgroundColor: "white", alignItems: "center", justifyContent: "center" }}>
                    <View style={{ width: INNER_HEAD_SIZE, height: INNER_HEAD_SIZE, borderRadius: INNER_HEAD_SIZE / 2, backgroundColor: color, alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="musical-notes" size={16} color="white" />
                    </View>
                </View>
                <View style={{ marginTop: -2, alignItems: "center" }}>
                    <View style={{ width: 0, height: 0, backgroundColor: "transparent", borderStyle: "solid", borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 10, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "white" }} />
                    <View style={{ position: "absolute", top: -2.5, width: 0, height: 0, backgroundColor: "transparent", borderStyle: "solid", borderLeftWidth: 5.5, borderRightWidth: 5.5, borderTopWidth: 7.5, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: color }} />
                </View>
            </View>
        </Marker>
    );
}
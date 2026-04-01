import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
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

// ~0.36 latitudeDelta ≈ 20km radie (0.36 * 111 / 2 = ~20km)
const INITIAL_DELTA = 0.36;

const ANIMATE_DELTA = 0.02;

const MARKER_COLORS: Record<string, string> = {
    piano: "#F97316",
    gitarr: "#8B5CF6",
    fiol: "#EF4444",
    trummor: "#ec4899",
    sång: "#3B82F6",
    trumpet: "#EAB308",
};

function getMarkerColor(instruments: string[]): string {
    const first = instruments[0]?.toLowerCase();
    return MARKER_COLORS[first] ?? "#14B8A6";
}

// 1. Definiera våra tillåtna ikon-familjer
type IconFamily = "MaterialCommunityIcons" | "FontAwesome5" | "Ionicons";

interface InstrumentIcon {
    family: IconFamily;
    name: string;
}

// 2. Mixa och matcha de snyggaste ikonerna!
const INSTRUMENT_ICONS: Record<string, InstrumentIcon> = {
    piano: { family: "MaterialCommunityIcons", name: "piano" },
    gitarr: { family: "MaterialCommunityIcons", name: "guitar-acoustic" },
    fiol: { family: "MaterialCommunityIcons", name: "violin" },
    trummor: { family: "FontAwesome5", name: "drum" }, 
    sång: { family: "MaterialCommunityIcons", name: "microphone-variant" },
    trumpet: { family: "MaterialCommunityIcons", name: "trumpet" },
    saxofon: { family: "MaterialCommunityIcons", name: "saxophone" },
    bas: { family: "MaterialCommunityIcons", name: "guitar-electric" },
};

// 3. Om instrumentet saknas, faller vi tillbaka på Ionicons standard-not
function getInstrumentIcon(instruments: string[]): InstrumentIcon {
    const first = instruments[0]?.toLowerCase();
    return INSTRUMENT_ICONS[first] || { family: "Ionicons", name: "musical-notes" };
}

export default function FindStudents() {
    const mapRef = useRef<MapView>(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [isListVisible, setIsListVisible] = useState(true);

    const {
        students,
        loading,
        userLocation,
        showSearchButton,
        selectedStudent,
        setUserLocation,
        selectStudent,
        setMapRegion,
        updateShowSearchButton,
        searchInArea,
    } = useFindStudentsStore();

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

    // --- REGION CHANGE (Memoized) ---
    const handleRegionChangeComplete = useCallback(
        (region: Region) => {
            updateShowSearchButton(region);
        },
        [updateShowSearchButton],
    );

    // --- SEARCH IN AREA (Memoized) ---
    const handleSearchInArea = useCallback(() => {
        searchInArea();
    }, [searchInArea]);

    // --- SMART START: GPS med fallback till Stockholm ---
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
                    // GPS misslyckades, använd Stockholm
                }
            } else {
                setPermissionDenied(true);
            }

            setUserLocation(location);

            // Sätt initial region och lastSearchRegion för tröskeljämförelser
            const initialRegion: Region = {
                latitude: location.lat,
                longitude: location.lng,
                latitudeDelta: INITIAL_DELTA,
                longitudeDelta: INITIAL_DELTA,
            };

            setMapRegion(initialRegion);

            // Beräkna radie: (0.36 * 111) / 2 ≈ 20km
            const initialRadius = (INITIAL_DELTA * 111) / 2;

            // Sätt lastSearchRegion direkt i storen via searchInArea-liknande logik
            useFindStudentsStore.setState({ lastSearchRegion: initialRegion });

            await useFindStudentsStore.getState().fetchStudents(location.lat, location.lng, initialRadius);

            setInitializing(false);
        })();
    }, []);

    // Loading screen
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
        latitudeDelta: INITIAL_DELTA,
        longitudeDelta: INITIAL_DELTA,
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
                onRegionChangeComplete={handleRegionChangeComplete}
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

            {/* "Sök i området"-knapp — visas bara när kartan flyttats tillräckligt */}
            {showSearchButton && (
                <View className="absolute top-32 self-center">
                    <TouchableOpacity
                        onPress={handleSearchInArea}
                        activeOpacity={0.85}
                        className="bg-white rounded-full px-5 py-3 flex-row items-center"
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.15,
                            shadowRadius: 6,
                            elevation: 4,
                        }}
                    >
                        <Ionicons name="search" size={16} color="#F97316" />
                        <Text className="text-slate-900 font-semibold text-sm ml-2">Sök i det här området</Text>
                    </TouchableOpacity>
                </View>
            )}

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

// --- STUDENT MARKER ---
interface StudentMarkerProps {
    student: StudentPublicDTO;
    isSelected: boolean;
    onPress: () => void;
}

function StudentMarker({ student, isSelected, onPress }: StudentMarkerProps) {
    if (!student.lat || !student.lng) return null;

    // Hämta färg och den nya hybrid-ikonen
    const color = getMarkerColor(student.instruments);
    const iconInfo = getInstrumentIcon(student.instruments);

    const scale = isSelected ? 1.2 : 1;
    const HEAD_SIZE = 36;
    const BORDER_WIDTH = 2.5;
    const INNER_HEAD_SIZE = HEAD_SIZE - BORDER_WIDTH * 2;

    return (
        <Marker
            coordinate={{ latitude: student.lat, longitude: student.lng }}
            onPress={(e) => {
                e.stopPropagation();
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
                        {/* Rendera rätt ikon-familj dynamiskt med 'as any' för att slippa TS-klagomål */}
                        {iconInfo.family === "MaterialCommunityIcons" && (
                            <MaterialCommunityIcons name={iconInfo.name as any} size={18} color="white" />
                        )}
                        {iconInfo.family === "FontAwesome5" && <FontAwesome5 name={iconInfo.name as any} size={13} color="white" solid />}
                        {iconInfo.family === "Ionicons" && <Ionicons name={iconInfo.name as any} size={16} color="white" />}
                    </View>
                </View>

                {/* Pilen nedåt på markören */}
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

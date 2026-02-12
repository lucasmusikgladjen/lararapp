import React, { useRef, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Platform } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Import this
import { StudentPublicDTO } from "../../types/student.types";
import { useFindStudentsStore } from "../../store/findStudentsStore";

interface StudentListSheetProps {
    onStudentPress: (student: StudentPublicDTO) => void;
    visible: boolean;
    onClose: () => void;
}

export function StudentListSheet({ onStudentPress, visible, onClose }: StudentListSheetProps) {
    const { students, selectedStudent } = useFindStudentsStore();
    const sheetRef = useRef<BottomSheet>(null);
    const insets = useSafeAreaInsets(); // Get safe area insets

    // 1. CALCULATE SNAP POINTS
    // We calculate the top snap point dynamically to leave a specific gap at the top.
    const screenHeight = Dimensions.get("window").height;

    // Top Gap: Inset (Status Bar) + Search Bar area (approx 60-80px)
    // This ensures the sheet stops BEFORE covering the search bar completely.
    const topSnapPoint = screenHeight - insets.top - 70;

    const snapPoints = useMemo(
        () => [
            "15%", // Peek
            "45%", // Half
            topSnapPoint, // Calculated Max Height (instead of "90%")
        ],
        [topSnapPoint],
    );

    // 2. Render List Item
    const renderItem = useCallback(
        ({ item }: { item: StudentPublicDTO }) => {
            const isSelected = selectedStudent?.id === item.id;
            const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${item.id}`;

            return (
                <TouchableOpacity
                    onPress={() => onStudentPress(item)}
                    activeOpacity={0.7}
                    className={`flex-row items-center mx-4 mb-3 p-4 rounded-2xl ${
                        isSelected ? "bg-gray-50 border border-[#8B5CF6]" : "bg-white border border-gray-100"
                    }`}
                    style={styles.itemShadow}
                >
                    <Image source={{ uri: avatarUrl }} className="w-12 h-12 rounded-full bg-slate-100" />
                    <View className="flex-1 ml-3">
                        <Text className="text-slate-900 font-bold text-base" numberOfLines={1}>
                            {item.name}
                        </Text>
                        <View className="flex-row items-center mt-1 flex-wrap gap-2">
                            <View className="flex-row items-center">
                                <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                                <Text className="text-gray-400 text-xs ml-0.5">
                                    {item.distance != null ? `${item.distance.toFixed(1)} km` : item.city}
                                </Text>
                            </View>
                            <Text className="text-gray-300 text-xs">•</Text>
                            <View className="flex-row">
                                {item.instruments.slice(0, 2).map((instrument) => (
                                    <View key={instrument} className="bg-green-100 rounded-md px-1.5 py-0.5 mr-1">
                                        <Text className="text-green-800 text-[10px] font-bold uppercase tracking-wide">{instrument}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#E5E7EB" />
                </TouchableOpacity>
            );
        },
        [selectedStudent, onStudentPress],
    );

    if (!visible) return null;

    return (
        <BottomSheet
            ref={sheetRef}
            index={1}
            snapPoints={snapPoints}
            // --- LOCKING CONFIGURATION ---
            topInset={insets.top} // Hard ceiling at the status bar
            enableOverDrag={false} // Strictly forbid dragging past the top point
            enablePanDownToClose={false} // Keep sheet interactive
            // -----------------------------
            onClose={onClose}
            backgroundStyle={styles.sheetBackground}
            handleIndicatorStyle={styles.dragHandle}
        >
            <View className="px-5 pb-2 border-b border-gray-50 mb-2 flex-row justify-between items-center">
                <Text className="text-lg font-bold text-slate-900">
                    Elever i närheten <Text className="text-gray-400 font-normal">({students.length})</Text>
                </Text>

                <TouchableOpacity onPress={onClose} className="p-1 bg-gray-100 rounded-full">
                    <Ionicons name="close" size={16} color="#6B7280" />
                </TouchableOpacity>
            </View>

            <BottomSheetFlatList
                data={students}
                // Explicitly tell TypeScript what 'item' is right here:
                keyExtractor={(item: StudentPublicDTO) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 80 }}
                ListEmptyComponent={
                    <View className="items-center py-10 opacity-50">
                        <Ionicons name="map-outline" size={48} color="#D1D5DB" />
                        <Text className="text-gray-400 text-sm mt-3">Inga elever i detta område</Text>
                    </View>
                }
            />
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    sheetBackground: {
        backgroundColor: "white",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    dragHandle: {
        backgroundColor: "#E5E7EB",
        width: 40,
        height: 4,
    },
    itemShadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
});

// frontend/src/components/find-students/StudentListSheet.tsx
import React, { useRef, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StudentPublicDTO } from "../../types/student.types";
import { useFindStudentsStore } from "../../store/findStudentsStore";

interface StudentListSheetProps {
    onStudentPress: (student: StudentPublicDTO) => void;
    visible: boolean;
    onClose: () => void;
}

export function StudentListSheet({ onStudentPress, visible, onClose }: StudentListSheetProps) {
    const { students } = useFindStudentsStore(); // Removed selectedStudent (not needed for UI highlight anymore)
    const sheetRef = useRef<BottomSheet>(null);
    const insets = useSafeAreaInsets();

    const screenHeight = Dimensions.get("window").height;
    const topSnapPoint = screenHeight - insets.top - 70;
    const snapPoints = useMemo(() => ["15%", "45%", topSnapPoint], [topSnapPoint]);

    const renderItem = useCallback(
        ({ item }: { item: StudentPublicDTO }) => {
            const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${item.id}`;

            return (
                <TouchableOpacity
                    onPress={() => onStudentPress(item)}
                    activeOpacity={0.7}
                    // Clean, white background, no selection highlight
                    className="flex-row px-5 py-4 mb-1.5 items-center bg-white"
                >
                    <View className="mr-4">
                        <Image 
                            source={{ uri: avatarUrl }} 
                            className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100" 
                        />
                    </View>

                    <View className="flex-1 justify-center">
                        <Text className="text-[16px] mb-0.5 font-bold text-slate-900">
                            {item.name}
                        </Text>
                        
                        <Text className="text-[14px]" numberOfLines={1}>
                            <Text className="font-semibold text-purple-600">{item.instruments[0]}</Text>
                            <Text className="text-slate-300"> • </Text>
                            <Text className="text-slate-500 font-medium">
                                {item.distance != null ? `${item.distance.toFixed(1)} km` : "Avstånd okänt"}
                            </Text>
                        </Text>
                    </View>

                    {/* Always just a chevron */}
                    <View className="justify-center pl-2">
                        <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                    </View>
                </TouchableOpacity>
            );
        },
        [onStudentPress]
    );

    // If detail is open (visible=false passed from parent), we hide this sheet completely
    if (!visible) return null;

    return (
        <BottomSheet
            ref={sheetRef}
            index={1}
            snapPoints={snapPoints}
            topInset={insets.top}
            enableOverDrag={false}
            enablePanDownToClose={false}
            onClose={onClose}
            backgroundStyle={styles.sheetBackground}
            handleIndicatorStyle={styles.dragHandle}
        >
            <View className="px-5 pt-2 pb-3 flex-row justify-between items-center bg-white z-10 border-b border-gray-100">
                <Text className="text-[20px] font-bold text-slate-900 tracking-tight">
                    Elever i närheten <Text className="text-slate-400 font-medium text-lg">({students.length})</Text>
                </Text>
                <TouchableOpacity onPress={onClose} className="w-8 h-8 bg-slate-50 rounded-full items-center justify-center">
                    <Ionicons name="close" size={18} color="#64748B" />
                </TouchableOpacity>
            </View>

            <BottomSheetFlatList
                data={students}
                keyExtractor={(item: StudentPublicDTO) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 80, backgroundColor: "#F1F5F9" }}
                style={{ backgroundColor: "#F1F5F9" }}
                showsVerticalScrollIndicator={false}
            />
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    sheetBackground: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 8,
    },
    dragHandle: {
        backgroundColor: "#E2E8F0",
        width: 36,
        height: 5,
        borderRadius: 10,
        marginTop: 8,
    },
});
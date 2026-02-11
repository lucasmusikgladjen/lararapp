import React, { useRef, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentPublicDTO } from "../../types/student.types";
import { useFindStudentsStore } from "../../store/findStudentsStore";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.38;

interface StudentListSheetProps {
    onStudentPress: (student: StudentPublicDTO) => void;
    visible: boolean;
    onClose: () => void;
}

export function StudentListSheet({ onStudentPress, visible, onClose }: StudentListSheetProps) {
    const { students, selectedStudent } = useFindStudentsStore();
    const flatListRef = useRef<FlatList<StudentPublicDTO>>(null);

    const renderItem = useCallback(
        ({ item }: { item: StudentPublicDTO }) => {
            const isSelected = selectedStudent?.id === item.id;
            const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${item.id}`;

            return (
                <TouchableOpacity
                    onPress={() => onStudentPress(item)}
                    activeOpacity={0.7}
                    className={`flex-row items-center mx-4 mb-3 p-4 rounded-2xl ${isSelected ? "bg-gray-50 border border-[#8B5CF6]" : "bg-white border border-gray-100"}`}
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 2,
                        elevation: 1,
                    }}
                >
                    {/* Avatar */}
                    <Image
                        source={{ uri: avatarUrl }}
                        className="w-12 h-12 rounded-full bg-slate-100"
                    />

                    {/* Student Info */}
                    <View className="flex-1 ml-3">
                        <Text className="text-slate-900 font-bold text-base" numberOfLines={1}>
                            {item.name}
                        </Text>

                        {/* Distance */}
                        <View className="flex-row items-center mt-0.5">
                            <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                            <Text className="text-gray-400 text-sm ml-1">
                                {item.distance != null
                                    ? `${item.distance.toFixed(1)} km`
                                    : item.city}
                            </Text>
                        </View>

                        {/* Instrument chips */}
                        <View className="flex-row mt-1.5">
                            {item.instruments.slice(0, 2).map((instrument) => (
                                <View
                                    key={instrument}
                                    className="bg-brand-green rounded-full px-2.5 py-0.5 mr-1.5"
                                >
                                    <Text className="text-white text-xs font-bold">
                                        {instrument.toUpperCase()}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Chevron */}
                    <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                </TouchableOpacity>
            );
        },
        [selectedStudent, onStudentPress],
    );

    const keyExtractor = useCallback((item: StudentPublicDTO) => item.id, []);

    if (!visible) return null;

    return (
        <View
            className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl"
            style={{
                height: SHEET_HEIGHT,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 10,
            }}
        >
            {/* Drag Handle */}
            <View className="items-center pt-3 pb-2">
                <View className="w-10 h-1 rounded-full bg-gray-300" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pb-3">
                <Text className="text-xl font-bold text-slate-900">
                    Elever i närheten ({students.length})
                </Text>

                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={onClose}
                        activeOpacity={0.7}
                        className="ml-3"
                    >
                        <Ionicons name="close" size={24} color="#6B7280" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Student List */}
            <FlatList
                ref={flatListRef}
                data={students}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                    <View className="items-center py-8">
                        <Ionicons name="people-outline" size={40} color="#D1D5DB" />
                        <Text className="text-gray-400 text-sm mt-2">
                            Inga elever hittades i detta område
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

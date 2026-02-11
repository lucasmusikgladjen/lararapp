import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentPublicDTO } from "../../types/student.types";

interface StudentInfoCardProps {
    student: StudentPublicDTO;
    onClose: () => void;
    onReadMore: (student: StudentPublicDTO) => void;
}

export function StudentInfoCard({ student, onClose, onReadMore }: StudentInfoCardProps) {
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${student.id}`;

    return (
        <View
            className="absolute self-center bg-white rounded-2xl overflow-hidden"
            style={{
                top: "25%",
                width: "75%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
            }}
        >
            {/* Student Image */}
            <Image
                source={{ uri: avatarUrl }}
                className="w-full bg-slate-100"
                style={{ height: 140 }}
                resizeMode="cover"
            />

            {/* Close Button */}
            <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                className="absolute top-2 right-2 bg-white/80 rounded-full w-7 h-7 items-center justify-center"
            >
                <Ionicons name="close" size={18} color="#374151" />
            </TouchableOpacity>

            {/* Content */}
            <View className="p-4">
                {/* Name */}
                <Text className="text-slate-900 font-bold text-base">
                    {student.name}
                </Text>

                {/* Instruments + City */}
                <Text className="text-gray-500 text-sm mt-0.5">
                    {student.instruments.join(", ")} · {student.city}
                </Text>

                {/* Distance */}
                <View className="flex-row items-center mt-1">
                    <Ionicons name="location" size={14} color="#9CA3AF" />
                    <Text className="text-gray-400 text-sm ml-1">
                        {student.distance != null
                            ? `${student.distance.toFixed(1)} km`
                            : student.city}
                    </Text>
                </View>

                {/* Read More Button */}
                <TouchableOpacity
                    onPress={() => onReadMore(student)}
                    activeOpacity={0.85}
                    className="bg-brand-orange rounded-full py-3 mt-3 items-center"
                >
                    <Text className="text-white font-bold text-sm">Läs mer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

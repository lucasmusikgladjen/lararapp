import { View, Text, Image, TouchableOpacity } from "react-native";
import { Student } from "../../types/student.types";
import { Ionicons } from "@expo/vector-icons";

interface StudentCardProps {
    student: Student;
    onPress: () => void;
    isLast: boolean; // New prop to hide border for the last item
}

export const StudentCard = ({ student, onPress, isLast }: StudentCardProps) => {
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${student.id}`;

    return (
        <TouchableOpacity
            onPress={onPress}
            // 1. Structure: Simple row with padding.
            // 2. Border: Only apply border-bottom if it's NOT the last item.
            className={`flex-row items-center p-5 ${!isLast ? "border-b border-slate-100" : ""}`}
        >
            {/* Avatar */}
            <Image source={{ uri: avatarUrl }} className="w-12 h-12 rounded-full bg-slate-100 mr-4" />

            {/* Text Info */}
            <View className="flex-1">
                <Text className="text-slate-900 font-bold text-lg">{student.name}</Text>
                {/* Updated to match Figma: Purple color, just instrument name */}
                <Text className="text-indigo-600 font-bold text-sm">
                    {student.instrument}
                </Text>
            </View>

            {/* Arrow Icon */}
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>
    );
};
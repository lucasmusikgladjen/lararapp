import { View, Text, Image, TouchableOpacity } from "react-native";
import { Student } from "../../types/student.types";
import { Ionicons } from "@expo/vector-icons"; // För pil-ikonen

interface StudentCardProps {
    student: Student;
    onPress: () => void;
}

export const StudentCard = ({ student, onPress }: StudentCardProps) => {
    // Slumpmässig avatar för demo (eftersom vi inte har bilder i Airtable än)
    // Vi använder studentens ID för att alltid få samma bild för samma elev.
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${student.id}`;

    return (
        <TouchableOpacity onPress={onPress} className="bg-white p-4 mb-3 rounded-2xl flex-row items-center shadow-sm border border-slate-100">
            {/* 1. Avatar Image */}
            <Image source={{ uri: avatarUrl }} className="w-12 h-12 rounded-full bg-slate-100 mr-4" />

            {/* 2. Text Info */}
            <View className="flex-1">
                <Text className="text-slate-900 font-bold text-lg">{student.name}</Text>
                <Text className="text-indigo-600 font-medium text-sm">
                    {student.instrument} • {student.status}
                </Text>
            </View>

            {/* 3. Arrow Icon */}
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>
    );
};

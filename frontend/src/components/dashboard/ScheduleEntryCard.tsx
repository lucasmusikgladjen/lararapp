import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export const ScheduleEntryCard = () => {
    const router = useRouter();

    return (
        <View className="mb-6 mt-2">
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/schedule")}
                className="flex-row items-center p-5 bg-white rounded-3xl border border-slate-100 shadow-sm"
            >
                <View className="w-14 h-14 items-center justify-center mr-4">
                    <Ionicons name="calendar-outline" size={28} color="#F97316" />
                </View>

                <View className="flex-1">
                    <Text className="text-slate-900 font-bold text-[17px] tracking-tight mb-1">Hantera lektionsschema</Text>
                    <Text className="text-slate-500 text-sm font-medium leading-tight pr-4">Justera tider och hantera lektioner</Text>
                </View>

                {/* Styled Chevron to match the StudentCard action indicator */}
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>
        </View>
    );
};

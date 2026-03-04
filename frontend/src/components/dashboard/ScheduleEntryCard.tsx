import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export const ScheduleEntryCard = () => {
    const router = useRouter();

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/schedule")}
            className="flex-row items-center bg-white p-5 rounded-3xl shadow-sm shadow-slate-200 mb-8 mt-2"
        >
            <View className="w-12 h-12 rounded-full border border-slate-100 items-center justify-center mr-4">
                <Ionicons name="calendar-outline" size={24} color="#F97316" />
            </View>

            <View className="flex-1">
                <Text className="text-slate-900 font-bold text-[17px] mb-1">Hantera lektionsschema</Text>
                <Text className="text-slate-500 text-[14px] leading-tight pr-2">Justera tider, skapa eller avsluta lektioner</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
        </TouchableOpacity>
    );
};

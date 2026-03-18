import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export const ScheduleEntryCard = () => {
    const router = useRouter();

    return (
        <View style={styles.shadowWrapper} className="mb-6 mt-2">
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/schedule")}
                className="flex-row items-center bg-white/60 p-6 rounded-[28px] border-2 border-white/80"
            >
                <View className="w-14 h-14 rounded-full bg-white items-center justify-center mr-4 shadow-sm border border-slate-50">
                    <Ionicons name="calendar-outline" size={28} color="#F97316" />
                </View>

                <View className="flex-1">
                    <Text className="text-slate-900 font-bold text-[17px] tracking-tight mb-1">Hantera lektionsschema</Text>
                    {/* <Text className="text-slate-500 text-sm font-medium leading-tight pr-4">Justera tider, skapa eller avsluta lektioner</Text> */}
                    <Text className="text-slate-500 text-sm font-medium leading-tight pr-4">Justera tider och hantera lektioner</Text>
                </View>

                {/* Styled Chevron to match the StudentCard action indicator */}
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>
        </View>
    );
};

// Mirroring the shadow styles from StudentCard to fix clipping and maintain depth consistency
const styles = StyleSheet.create({
    shadowWrapper: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
    },
});

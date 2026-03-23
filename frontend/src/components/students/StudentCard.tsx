import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Student } from "../../types/student.types";

const { width } = Dimensions.get("window");
// Calculate width: (Total width - horizontal padding - gap) / 2
const COLUMN_WIDTH = (width - 40 - 16) / 2;

interface StudentCardProps {
    student: Student;
    onPress: () => void;
}

export const StudentCard = ({ student, onPress }: StudentCardProps) => {
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${student.id}`;

    return (
        <View style={styles.shadowWrapper} className="mb-4">
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.9}
                style={{ width: COLUMN_WIDTH }}
                // Glassmorphism: bg-white/60 + border-2 border-white/80
                className="items-center p-6 rounded-[24px] bg-brand-bg border border-slate-300"
            >
                {/* Avatar - Scaled down for grid */}
                <View className="size-20 rounded-full overflow-hidden mb-4">
                    <Image source={{ uri: avatarUrl }} className="w-full h-full" resizeMode="cover" />
                </View>

                {/* Info Container */}
                <View className="items-center">
                    <Text className="text-slate-900 font-bold text-base text-center tracking-tight" numberOfLines={1}>
                        {student.name.split(" ")[0]} {/* Show only first name for cleaner grid */}
                    </Text>

                    {/* Compact Instrument Badge */}
                    <View className="bg-brand-orange/10 px-3 py-1 rounded-full mt-2">
                        <Text className="text-brand-orange font-black text-[9px] uppercase tracking-wider">{student.instrument}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    shadowWrapper: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
    },
});

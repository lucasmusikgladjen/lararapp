import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
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
        <View>
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                style={{ width: COLUMN_WIDTH }}
                className="items-center bg-white rounded-3xl p-5 border border-slate-200"
            >
                {/* Avatar - Nu med samma bg-slate-100 som i ScheduleCard för maximal enhetlighet */}
                <View className="size-20 rounded-full bg-slate-100 border border-slate-200 overflow-hidden mb-4 shrink-0">
                    <Image source={{ uri: avatarUrl }} className="w-full h-full" resizeMode="cover" />
                </View>

                {/* Info Container */}
                <View className="items-center">
                    <Text className="text-slate-900 font-bold text-[16px] text-center tracking-tight" numberOfLines={1}>
                        {student.name.split(" ")[0]} {/* Show only first name for cleaner grid */}
                    </Text>

                    {/* Compact Instrument Badge */}
                    <View className="bg-orange-50 border border-orange-100/50 px-2.5 py-1 rounded-full mt-1.5">
                        <Text className="text-brand-orange font-extrabold text-[9px] uppercase tracking-wider">{student.instrument}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

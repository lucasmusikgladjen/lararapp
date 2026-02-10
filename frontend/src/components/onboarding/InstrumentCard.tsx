import { TouchableOpacity, View, Text } from "react-native";

type InstrumentCardProps = {
    label: string;
    emoji: string;
    iconBg: string;
    selected: boolean;
    onPress: () => void;
};

export default function InstrumentCard({
    label,
    emoji,
    iconBg,
    selected,
    onPress,
}: InstrumentCardProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={`flex-1 items-center py-5 rounded-2xl shadow-sm ${
                selected ? "bg-blue-50 border-2 border-blue-200" : "bg-white border border-gray-100"
            }`}
        >
            <View
                className={`w-16 h-16 rounded-full items-center justify-center mb-3 ${iconBg}`}
            >
                <Text style={{ fontSize: 28 }}>{emoji}</Text>
            </View>
            <Text className="text-base font-semibold text-slate-900">
                {label}
            </Text>
        </TouchableOpacity>
    );
}

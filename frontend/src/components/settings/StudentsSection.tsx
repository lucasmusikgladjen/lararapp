import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatBox } from "./SettingsUI";
import { User } from "../../types/auth.types";

interface StudentsSectionProps {
    user: User;
    formData: any;
    setFormData: (data: any) => void;
    handleSave: () => void;
}

export const StudentsSection = ({ user, formData, setFormData, handleSave }: StudentsSectionProps) => {
    // Räkna hur många pågående ansökningar läraren har
    const pendingCount = user.pendingStudentIds ? user.pendingStudentIds.length : 0;

    return (
        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <View className="flex-row items-center mb-6">
                <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3">
                    <Ionicons name="people" size={20} color="#9333EA" />
                </View>
                <Text className="text-lg font-bold text-slate-900">Elever</Text>
            </View>

            <View className="flex-row gap-3 mb-4">
                <StatBox count={user.studentIds?.length || 0} label="Nuvarande" />
                <StatBox count={pendingCount} label="Pågående" />
            </View>

            <View className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <Text className="text-xs font-bold text-slate-500 uppercase mb-2">Önskat antal elever</Text>
                <View className="flex-row gap-2">
                    <TextInput
                        className="flex-1 bg-white rounded-lg px-4 py-3 text-slate-900 border border-slate-200"
                        value={formData.desiredStudentCount}
                        onChangeText={(text) => setFormData({ ...formData, desiredStudentCount: text })}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity onPress={handleSave} className="bg-brand-orange px-4 justify-center rounded-lg">
                        <Text className="text-white font-bold">Spara</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { AccordionItem } from "../ui/AccordionItem";
import { StatBox } from "./SettingsUI";
import { User } from "../../types/auth.types";

interface StudentsSectionProps {
    user: User;
    formData: any;
    setFormData: (data: any) => void;
    handleSave: () => void;
}

export const StudentsSection = ({ user, formData, setFormData, handleSave }: StudentsSectionProps) => {
    return (
        <AccordionItem title="Elever" icon="people" iconColor="#9333EA" iconBgColor="bg-purple-100">
            <View className="flex-row gap-3 mb-4">
                <StatBox count={user.studentIds.length} label="Nuvarande" />
                <StatBox count={0} label="Pågående" />
            </View>

            <View className="bg-white p-4 rounded-xl border border-slate-100">
                <Text className="text-xs font-bold text-slate-400 uppercase mb-2">Önskat antal elever</Text>
                <View className="flex-row gap-2">
                    <TextInput
                        className="flex-1 bg-slate-50 rounded-lg px-4 py-3 text-slate-900 border border-slate-200"
                        value={formData.desiredStudentCount}
                        onChangeText={(text) => setFormData({ ...formData, desiredStudentCount: text })}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity onPress={handleSave} className="bg-brand-orange px-4 justify-center rounded-lg">
                        <Text className="text-white font-bold">Spara</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AccordionItem>
    );
};

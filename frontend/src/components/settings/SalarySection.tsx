import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InfoRow, InputGroup, SaveButton } from "./SettingsUI";
import { User } from "../../types/auth.types";

interface SalarySectionProps {
    user: User;
    formData: any;
    setFormData: (data: any) => void;
    handleSave: () => void;
    isSaving: boolean;
}

export const SalarySection = ({ user, formData, setFormData, handleSave, isSaving }: SalarySectionProps) => {
    const updateField = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <View className="flex-row items-center mb-6">
                <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                    <Ionicons name="cash" size={20} color="#16A34A" />
                </View>
                <Text className="text-lg font-bold text-slate-900">Löneuppgifter</Text>
            </View>

            <View className="gap-4">
                <View className="gap-1">
                    <InfoRow label="Timlön" value={`${user.hourlyWage || 0} kr/timme`} />
                    <InfoRow label="Skattesats" value={`${(user.taxRate || 0) * 100}%`} />
                    <Text className="text-xs text-slate-500 mt-2">Uppgifterna hämtas från ditt anställningsavtal</Text>
                </View>

                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <InputGroup label="Bank" value={formData.bank} onChangeText={(t: string) => updateField("bank", t)} placeholder="Banknamn" />
                    </View>
                    <View className="flex-1">
                        <InputGroup label="Kontonummer" value={formData.bankAccountNumber} onChangeText={(t: string) => updateField("bankAccountNumber", t)} placeholder="XXX-XXX-XXX" keyboardType="numeric" />
                    </View>
                </View>

                <SaveButton onPress={handleSave} loading={isSaving} />
            </View>
        </View>
    );
};
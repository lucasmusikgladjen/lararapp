import { View, Text } from "react-native";
import { AccordionItem } from "../ui/AccordionItem";
// 1. Lade till InputGroup och SaveButton här:
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
    // Helper to keep code clean
    const updateField = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <AccordionItem title="Löneuppgifter" icon="cash" iconColor="#16A34A" iconBgColor="bg-green-100">
            <View className="gap-4 mt-2">
                <View className="gap-1">
                    <InfoRow label="Timlön" value={`${user.hourlyWage || 0} kr/timme`} />
                    <InfoRow label="Skattesats" value={`${(user.taxRate || 0) * 100}%`} />
                    <Text className="text-xs text-slate-500 mt-2">Uppgifterna hämtas från ditt anställningsavtal</Text>
                </View>

                {/* BANK INFO */}
                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <InputGroup label="Bank" value={formData.bank} onChangeText={(t: string) => updateField("bank", t)} placeholder="Banknamn" />
                    </View>
                    <View className="flex-1">
                        <InputGroup
                            label="Kontonummer"
                            value={formData.bankAccountNumber}
                            onChangeText={(t: string) => updateField("bankAccountNumber", t)}
                            placeholder="XXX-XXX-XXX"
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <SaveButton onPress={handleSave} loading={isSaving} />
            </View>
        </AccordionItem>
    );
};

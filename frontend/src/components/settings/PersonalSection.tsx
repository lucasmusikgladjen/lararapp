import { View } from "react-native";
import { AccordionItem } from "../ui/AccordionItem";
import { InputLabel, InputGroup, SaveButton } from "./SettingsUI";
import { User } from "../../types/auth.types";

interface PersonalSectionProps {
    user: User;
    formData: any;
    setFormData: (data: any) => void;
    handleSave: () => void;
    isSaving: boolean;
}

export const PersonalSection = ({ user, formData, setFormData, handleSave, isSaving }: PersonalSectionProps) => {
    // Helper to keep code clean
    const updateField = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <AccordionItem title="Personuppgifter" icon="person" iconColor="#2563EB" iconBgColor="bg-blue-100" defaultOpen={false}>
            <View className="gap-3">
                {/* NAMN */}
                <InputGroup label="Namn" value={formData.name} onChangeText={(t: string) => updateField("name", t)} placeholder="Ditt namn" />

                {/* E-POST */}
                <InputGroup
                    label="E-post"
                    value={formData.email}
                    onChangeText={(text: string) => updateField("email", text)}
                    placeholder="din.email@exempel.se"
                    keyboardType="email-address"
                />

                {/* TELEFON */}
                <InputGroup
                    label="Telefon"
                    value={formData.phone}
                    onChangeText={(text: string) => updateField("phone", text)}
                    placeholder="070-123 45 67"
                    keyboardType="phone-pad"
                />

                {/* PERSONNUMMER (Read Only) */}
                <InputLabel label="Personnummer" value={user.personalNumber || "Saknas"} editable={false} isLocked />

                {/* ADRESS */}
                <InputGroup
                    label="Adress"
                    value={formData.address}
                    onChangeText={(text: string) => updateField("address", text)}
                    placeholder="Gatuadress 12"
                />

                {/* POSTNUMMER & ORT */}
                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <InputGroup
                            label="Postnummer"
                            value={formData.zip}
                            onChangeText={(text: string) => updateField("zip", text)}
                            placeholder="123 45"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1">
                        <InputGroup label="Ort" value={formData.city} onChangeText={(t: string) => updateField("city", t)} placeholder="Stad" />
                    </View>
                </View>

                <SaveButton onPress={handleSave} loading={isSaving} />
            </View>
        </AccordionItem>
    );
};

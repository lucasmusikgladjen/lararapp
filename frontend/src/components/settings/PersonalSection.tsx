import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
    const updateField = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    // Gör om arrayen till en kommaseparerad sträng (t.ex. "Piano, Gitarr") så det ser snyggt ut i fältet
    const instrumentsString = Array.isArray(formData.instruments) ? formData.instruments.join(", ") : formData.instruments || "";

    return (
        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <View className="flex-row items-center mb-6">
                <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                    <Ionicons name="person" size={20} color="#2563EB" />
                </View>
                <Text className="text-lg font-bold text-slate-900">Personuppgifter</Text>
            </View>

            <View className="gap-3">
                <InputGroup label="Namn" value={formData.name} onChangeText={(t: string) => updateField("name", t)} placeholder="Ditt namn" />
                <InputGroup
                    label="E-post"
                    value={formData.email}
                    onChangeText={(t: string) => updateField("email", t)}
                    placeholder="din.email@exempel.se"
                    keyboardType="email-address"
                />
                <InputGroup
                    label="Telefon"
                    value={formData.phone}
                    onChangeText={(t: string) => updateField("phone", t)}
                    placeholder="070-123 45 67"
                    keyboardType="phone-pad"
                />

                <InputLabel label="Personnummer" value={user.personalNumber || "Saknas"} editable={false} isLocked />

                <InputGroup
                    label="Instrument"
                    value={instrumentsString}
                    onChangeText={(text: string) => updateField("instruments", text)}
                    placeholder="T.ex. Piano, Gitarr"
                />

                <InputGroup
                    label="Adress"
                    value={formData.address}
                    onChangeText={(t: string) => updateField("address", t)}
                    placeholder="Gatuadress 12"
                />

                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <InputGroup
                            label="Postnummer"
                            value={formData.zip}
                            onChangeText={(t: string) => updateField("zip", t)}
                            placeholder="123 45"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1">
                        <InputGroup label="Ort" value={formData.city} onChangeText={(t: string) => updateField("city", t)} placeholder="Stad" />
                    </View>
                </View>

                <View className="mt-4">
                    <SaveButton onPress={handleSave} loading={isSaving} />
                </View>
            </View>
        </View>
    );
};

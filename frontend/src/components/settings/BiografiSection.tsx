import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SaveButton } from "./SettingsUI";

interface BiografiSectionProps {
    formData: any;
    setFormData: (data: any) => void;
    handleSave: () => void;
    isSaving: boolean;
}

export const BiografiSection = ({ formData, setFormData, handleSave, isSaving }: BiografiSectionProps) => {
    return (
        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <View className="flex-row items-center mb-6">
                <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                    <Ionicons name="pencil" size={20} color="#EA580C" />
                </View>
                <Text className="text-lg font-bold text-slate-900">Biografi</Text>
            </View>

            <View>
                <TextInput
                    className="w-full bg-slate-50 rounded-xl p-4 text-slate-900 border border-slate-200 min-h-[120px] mb-4"
                    value={formData.bio}
                    onChangeText={(t) => setFormData({ ...formData, bio: t })}
                    placeholder="Skriv din biografi här..."
                    multiline
                    textAlignVertical="top"
                />
                <SaveButton onPress={handleSave} loading={isSaving} />
            </View>
        </View>
    );
};

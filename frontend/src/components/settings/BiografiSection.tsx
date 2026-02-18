import { View, TextInput } from "react-native";
import { AccordionItem } from "../ui/AccordionItem";
import { SaveButton } from "./SettingsUI";

interface BiografiSectionProps {
    formData: any;
    setFormData: (data: any) => void;
    handleSave: () => void;
    isSaving: boolean;
}

export const BiografiSection = ({ formData, setFormData, handleSave, isSaving }: BiografiSectionProps) => {
    return (
        <AccordionItem title="Biografi" icon="pencil" iconColor="#EA580C" iconBgColor="bg-orange-100">
            <View>
                <TextInput
                    className="w-full bg-slate-50 rounded-lg p-4 text-slate-900 border border-slate-200 min-h-[120px] mb-4"
                    value={formData.bio}
                    onChangeText={(t) => setFormData({ ...formData, bio: t })}
                    placeholder="Skriv din biografi här..."
                    multiline
                    textAlignVertical="top"
                />
                <View className="flex-row justify-end">
                    <SaveButton onPress={handleSave} loading={isSaving} />
                </View>
            </View>
        </AccordionItem>
    );
};

import { View, Text, Linking, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DocRow } from "./SettingsUI";
import { User } from "../../types/auth.types";

interface DocumentsSectionProps {
    user: User;
}

const DOCUMENT_CATEGORIES = [
    { type: "contract", label: "Avtal" },
    { type: "tax-adjustment", label: "Jämkning" },
    { type: "criminal-record", label: "Belastningsregister" },
];

export const DocumentsSection = ({ user }: DocumentsSectionProps) => {
    const openDocument = (url: string) => {
        Linking.openURL(url).catch(() => Alert.alert("Fel", "Kunde inte öppna dokumentet"));
    };

    const handleUploadClick = (categoryLabel: string) => {
        Alert.alert("Ladda upp", `Här kommer du kunna välja och ladda upp ditt dokument för: ${categoryLabel}.`);
    };

    const documents = user.documents || [];

    return (
        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <View className="flex-row items-center mb-8">
                <View className="w-10 h-10 rounded-full bg-teal-100 items-center justify-center mr-3">
                    <Ionicons name="folder" size={20} color="#0D9488" />
                </View>
                <Text className="text-lg font-bold text-slate-900">Dokument</Text>
            </View>

            <View>
                {DOCUMENT_CATEGORIES.map((category) => {
                    const categoryDocs = documents.filter((doc) => doc.type === category.type);
                    const hasDocs = categoryDocs.length > 0;

                    return (
                        <View key={category.type} className="mb-8 last:mb-0">
                            {/* Sektionsrubrik */}
                            <Text className="text-[14px] font-bold mb-1 text-slate-800 ml-1">{category.label}</Text>

                            {hasDocs ? (
                                <View className="mb-4">
                                    {categoryDocs.map((doc, index) => (
                                        <DocRow key={index} name={doc.name} date="Uppladdad" onPress={() => openDocument(doc.url)} />
                                    ))}
                                </View>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => handleUploadClick(category.label)}
                                    activeOpacity={0.6}
                                    className="border-2 border-dashed border-slate-200 rounded-2xl p-5 items-center justify-center bg-slate-50/50 mb-5"
                                >
                                    <View className="flex-row items-center gap-x-2">
                                        <Ionicons name="add-circle-outline" size={20} color="#64748B" />
                                        <Text className="text-sm font-bold text-slate-500">Ladda upp {category.label.toLowerCase()}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

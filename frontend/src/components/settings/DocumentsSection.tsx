import { View, Text, Linking, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { DocRow } from "./SettingsUI";
import { User, TeacherDocument } from "../../types/auth.types";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/auth.service";

interface DocumentsSectionProps {
    user: User;
}

const DOCUMENT_CATEGORIES = [
    { type: "contract", label: "Avtal" },
    { type: "tax-adjustment", label: "Jämkning" },
    { type: "criminal-record", label: "Belastningsregister" },
];

export const DocumentsSection = ({ user }: DocumentsSectionProps) => {
    const { token, updateUser } = useAuthStore();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const openDocument = (url: string) => {
        Linking.openURL(url).catch(() => Alert.alert("Fel", "Kunde inte öppna dokumentet"));
    };

    const handleUploadClick = (categoryLabel: string) => {
        Alert.alert("Ladda upp", `Här kommer du kunna välja och ladda upp ditt dokument för: ${categoryLabel}.`);
    };

    const handleDelete = (docType: TeacherDocument["type"], categoryLabel: string) => {
        Alert.alert("Radera dokument", `Är du säker på att du vill radera ditt ${categoryLabel.toLowerCase()}? Det går inte att ångra.`, [
            { text: "Avbryt", style: "cancel" },
            {
                text: "Radera",
                style: "destructive",
                onPress: async () => {
                    if (!token) return;
                    setIsDeleting(docType);
                    try {
                        const updatedUser = await authService.updateProfile(token, { clearDocument: docType });
                        updateUser(updatedUser);
                        Alert.alert("Raderat", "Dokumentet har tagits bort.");
                    } catch (error) {
                        Alert.alert("Fel", "Något gick fel när dokumentet skulle raderas.");
                    } finally {
                        setIsDeleting(null);
                    }
                },
            },
        ]);
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
                                <View className="mb-4 gap-y-2">
                                    {categoryDocs.map((doc, index) => (
                                        <View key={index} className="flex-row items-center">
                                            {/* Dokument-raden tar upp max yta */}
                                            <View className="flex-1">
                                                <DocRow name={doc.name} date="Uppladdad" onPress={() => openDocument(doc.url)} />
                                            </View>

                                            {/* Radera-knapp - UPPDATERAD STYLING HÄR */}
                                            <TouchableOpacity
                                                onPress={() => handleDelete(doc.type as any, category.label)}
                                                disabled={isDeleting === doc.type}
                                                className="w-[68px] h-[68px] ml-2 bg-red-50 rounded-2xl items-center justify-center border border-red-100"
                                            >
                                                {isDeleting === doc.type ? (
                                                    <ActivityIndicator size="small" color="#EF4444" />
                                                ) : (
                                                    <Ionicons name="trash-outline" size={24} color="#EF4444" />
                                                )}
                                            </TouchableOpacity>
                                        </View>
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

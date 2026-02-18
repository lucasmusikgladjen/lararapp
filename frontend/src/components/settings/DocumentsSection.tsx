import { View, Text, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AccordionItem } from "../ui/AccordionItem";
import { DocRow } from "./SettingsUI";
import { User } from "../../types/auth.types";

interface DocumentsSectionProps {
    user: User;
}

export const DocumentsSection = ({ user }: DocumentsSectionProps) => {
    const openDocument = (url: string) => {
        Linking.openURL(url).catch(() => Alert.alert("Fel", "Kunde inte öppna dokumentet"));
    };

    const documents = user.documents || [];

    return (
        <AccordionItem title="Dokument" icon="folder" iconColor="#0D9488" iconBgColor="bg-teal-100">
            <View className="space-y-3">
                {documents.length > 0 ? (
                    documents.map((doc, index) => <DocRow key={index} name={doc.name} date="Uppladdad" onPress={() => openDocument(doc.url)} />)
                ) : (
                    <Text className="text-slate-400 text-sm italic">Inga dokument tillgängliga</Text>
                )}

                {/* Static Admin-only view */}
                <View className="flex-row items-center justify-between bg-slate-100 p-3 rounded-xl opacity-60">
                    <View className="flex-row items-center gap-3 overflow-hidden flex-1 mr-2">
                        <View className="bg-slate-200 p-2 rounded-lg">
                            <Ionicons name="lock-closed" size={20} color="#94a3b8" />
                        </View>
                        <View>
                            <Text className="text-sm font-bold text-slate-600" numberOfLines={1}>
                                Belastningsregister
                            </Text>
                            <Text className="text-[10px] text-slate-500 mt-0.5">Hanteras av administrationen</Text>
                        </View>
                    </View>
                </View>
            </View>
        </AccordionItem>
    );
};

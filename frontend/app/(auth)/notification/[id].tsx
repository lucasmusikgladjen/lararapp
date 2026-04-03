import { useLocalSearchParams, router } from "expo-router";
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNotifications, useResolveNotification } from "../../../src/hooks/useNotifications";
import { PageHeader } from "../../../src/components/ui/PageHeader";
import { NotificationBackground } from "../../../src/components/ui/NotificationBackground";

export default function NotificationActionPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: notifications, isLoading } = useNotifications();
    const { mutate: resolveNotification, isPending } = useResolveNotification();

    const notification = notifications?.find((n) => n.id === id);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [checkedItems, setCheckedItems] = useState<number[]>([]);

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-brand-bg items-center justify-center">
                <ActivityIndicator size="large" color="#F97316" />
            </SafeAreaView>
        );
    }

    if (!notification) {
        return (
            <SafeAreaView className="flex-1 bg-brand-bg">
                <View className="px-5 mt-10 items-center">
                    <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
                    <Text className="text-slate-500 mt-4 text-center">Denna notifikation kunde inte hittas eller är redan löst.</Text>
                    <TouchableOpacity onPress={() => router.back()} className="mt-6 bg-white border border-gray-200 py-3 px-6 rounded-full shadow-sm">
                        <Text className="text-slate-800 font-bold">Gå tillbaka</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const { actionPage } = notification;
    const { content } = actionPage;

    // --- FUNKTION: NÄR LÄRAREN SKICKAR IN/BEKRÄFTAR ---
    const handleSubmit = () => {
        resolveNotification(
            { id: notification.id, answers },
            {
                onSuccess: () => {
                    router.back();
                },
                onError: (error) => {
                    Alert.alert("Ett fel uppstod", "Kunde inte skicka in ditt svar. Försök igen.");
                    console.error(error);
                },
            },
        );
    };

    return (
        <NotificationBackground>
            {/* // 1. Solid bakgrund (bg-brand-bg) döljer dashboarden helt under slide-animationen */}
            <SafeAreaView edges={["top"]} className="flex-1">
                <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    <PageHeader />

                    {/* --- TILLBAKA-KNAPPEN (Orange) --- */}
                    <View className="px-1 py-2 mb-2 flex-row items-center">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="flex-row items-center bg-brand-orange rounded-full px-3 py-1.5 self-start"
                            activeOpacity={0.8}
                        >
                            <Ionicons name="arrow-back" size={18} color="white" />
                            <Text className="text-white text-xs font-semibold ml-1">Tillbaka</Text>
                        </TouchableOpacity>
                    </View>

                    {/* --- THE MAIN CARD --- */}
                    {/* Tog bort den extrema skuggan och återgick till standard design för en egen sida */}
                    <View className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden mt-2">
                        {/* =========================================
                        LEGO-BIT 1: BILD (EDGE-TO-EDGE)
                    ========================================= */}
                        {actionPage.showImage && content.imageUrl && (
                            <View className="w-full aspect-video bg-slate-100">
                                <Image source={{ uri: content.imageUrl }} className="w-full h-full" resizeMode="cover" />
                            </View>
                        )}

                        {/* --- KORTETS INRE CONTENT --- */}
                        <View className="p-7">
                            {/* =========================================
                            LEGO-BIT 2: TEXT & RUBRIK 
                        ========================================= */}
                            {actionPage.showText && (
                                <View className="mb-8">
                                    {content.h1 ? <Text className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{content.h1}</Text> : null}
                                    {content.bodyText ? (
                                        <Text className="text-base text-slate-600 leading-relaxed font-medium">{content.bodyText}</Text>
                                    ) : null}
                                </View>
                            )}

                            {/* =========================================
                            LEGO-BIT 3: CHECKLISTA 
                        ========================================= */}
                            {actionPage.showChecklist && content.checklistItems.length > 0 && (
                                <View className="mb-8 bg-slate-50 p-6 rounded-[24px] border border-slate-100">
                                    <Text className="font-bold text-slate-700 mb-4 text-xs uppercase tracking-widest">Att göra</Text>
                                    {content.checklistItems.map((item, index) => {
                                        const isChecked = checkedItems.includes(index);

                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                activeOpacity={0.7}
                                                className="flex-row items-start mb-4 last:mb-0"
                                                onPress={() => {
                                                    setCheckedItems((prev) =>
                                                        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
                                                    );
                                                }}
                                            >
                                                <View
                                                    className={`w-6 h-6 rounded-full border-2 mr-4 mt-0.5 items-center justify-center ${
                                                        isChecked ? "bg-brand-green border-brand-green" : "border-slate-300 bg-white"
                                                    }`}
                                                >
                                                    {isChecked && <Ionicons name="checkmark" size={16} color="white" />}
                                                </View>

                                                <Text
                                                    className={`flex-1 text-base leading-relaxed font-medium ${
                                                        isChecked ? "text-slate-400 line-through" : "text-slate-700"
                                                    }`}
                                                >
                                                    {item.replace(/^[-*•]\s*/, "")}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}

                            {/* =========================================
                            LEGO-BIT 4: FORMULÄRFÄLT (1-4)
                        ========================================= */}
                            {(actionPage.showFormFields.field1 ||
                                actionPage.showFormFields.field2 ||
                                actionPage.showFormFields.field3 ||
                                actionPage.showFormFields.field4) && (
                                <View className="mb-6 space-y-5">
                                    {[1, 2, 3, 4].map((num) => {
                                        const fieldKey = `field${num}` as keyof typeof actionPage.showFormFields;
                                        const answerKey = `formField${num}`;

                                        if (!actionPage.showFormFields[fieldKey]) return null;

                                        return (
                                            <View key={fieldKey} className="mb-4">
                                                <Text className="text-sm font-bold text-slate-800 mb-2.5 ml-1">
                                                    {content.formFieldLabels[fieldKey] || `Svar ${num}`}
                                                </Text>
                                                <TextInput
                                                    className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-slate-900 text-base font-medium"
                                                    placeholder="Skriv här..."
                                                    placeholderTextColor="#9CA3AF"
                                                    value={answers[answerKey] || ""}
                                                    onChangeText={(text) => setAnswers((prev) => ({ ...prev, [answerKey]: text }))}
                                                    multiline={num === 2}
                                                    style={num === 2 ? { minHeight: 100, textAlignVertical: "top" } : {}}
                                                />
                                            </View>
                                        );
                                    })}
                                </View>
                            )}

                            {/* =========================================
                            LEGO-BIT 5: SKICKA FORMULÄR-KNAPP 
                        ========================================= */}
                            {actionPage.showSubmitButton && (
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    disabled={isPending}
                                    className={`py-4 rounded-2xl items-center mt-2 shadow-sm ${isPending ? "bg-orange-300" : "bg-brand-orange"}`}
                                >
                                    {isPending ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text className="text-white font-bold text-lg">{content.submitButtonText || "Skicka in"}</Text>
                                    )}
                                </TouchableOpacity>
                            )}

                            {/* =========================================
                                LEGO-BIT 6: BEKRÄFTA-KNAPP (Uppdaterad)
                               ========================================= */}
                            {actionPage.showConfirmButtons && !actionPage.showSubmitButton && (
                                <View className="mt-8">
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        disabled={isPending || (actionPage.showChecklist && checkedItems.length !== content.checklistItems.length)}
                                        className={`py-4 rounded-2xl items-center shadow-sm ${
                                            isPending || (actionPage.showChecklist && checkedItems.length !== content.checklistItems.length)
                                                ? "bg-slate-300"
                                                : "bg-brand-orange"
                                        }`}
                                    >
                                        {isPending ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <Text className="text-white font-bold text-lg">{content.confirmButtonText || "Jag bekräftar"}</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </NotificationBackground>
    );
}

import { useLocalSearchParams, router } from "expo-router";
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PageHeader } from "../../../src/components/ui/DashboardHeader";
import { useNotifications, useResolveNotification } from "../../../src/hooks/useNotifications";

export default function NotificationActionPage() {
    // 1. Hämta ID från URL:en
    const { id } = useLocalSearchParams<{ id: string }>();

    // 2. Hämta notiserna och vår resolve-mutation
    const { data: notifications, isLoading } = useNotifications();
    const { mutate: resolveNotification, isPending } = useResolveNotification();

    // 3. Hitta just den här notisen
    const notification = notifications?.find((n) => n.id === id);

    // State för att spara vad användaren skriver i eventuella formulärfält
    const [answers, setAnswers] = useState<Record<string, string>>({});

    // --- LADDNINGS- OCH FELHANTERING ---
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
                <PageHeader title="Notis saknas" />
                <View className="px-5 mt-10 items-center">
                    <Text className="text-slate-500">Denna notifikation kunde inte hittas eller är redan löst.</Text>
                    <TouchableOpacity onPress={() => router.back()} className="mt-5 bg-slate-200 py-3 px-6 rounded-xl">
                        <Text className="text-slate-800 font-semibold">Gå tillbaka</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const { actionPage, card } = notification;
    const { content } = actionPage;

    // --- FUNKTION: NÄR LÄRAREN SKICKAR IN/BEKRÄFTAR ---
    const handleSubmit = () => {
        resolveNotification(
            { id: notification.id, answers },
            {
                onSuccess: () => {
                    // Navigera tillbaka till dashboarden, kortet kommer att vara borta!
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
        <SafeAreaView edges={["top"]} className="flex-1 bg-brand-bg">
            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Dynamisk rubrik baserad på kortets titel */}
                <PageHeader title="Notifikation" />

                {/* --- BACK BUTTON --- */}
                <View className="mb-2 mt-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-row items-center bg-brand-orange rounded-full px-3 py-1.5 self-start"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="arrow-back" size={16} color="white" />
                        <Text className="text-white text-xs font-semibold ml-1">Tillbaka</Text>
                    </TouchableOpacity>
                </View>

                <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mt-4">
                    {/* =========================================
                        LEGO-BIT 1: BILD 
                    ========================================= */}
                    {actionPage.showImage && content.imageUrl && (
                        <View className="mb-6 rounded-2xl overflow-hidden">
                            <Image source={{ uri: content.imageUrl }} className="w-full h-48" resizeMode="cover" />
                        </View>
                    )}

                    {/* =========================================
                        LEGO-BIT 2: TEXT & RUBRIK 
                    ========================================= */}
                    {actionPage.showText && (
                        <View className="mb-6">
                            {content.h1 ? <Text className="text-2xl font-bold text-slate-900 mb-3 leading-tight">{content.h1}</Text> : null}
                            {content.bodyText ? <Text className="text-base text-slate-600 leading-relaxed">{content.bodyText}</Text> : null}
                        </View>
                    )}

                    {/* =========================================
                        LEGO-BIT 3: CHECKLISTA (Visuell representation)
                    ========================================= */}
                    {actionPage.showChecklist && content.checklistItems.length > 0 && (
                        <View className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <Text className="font-bold text-slate-800 mb-3">Att göra:</Text>
                            {content.checklistItems.map((item, index) => (
                                <View key={index} className="flex-row items-center mb-2">
                                    <View className="w-5 h-5 rounded-full border-2 border-slate-300 mr-3 items-center justify-center" />
                                    <Text className="text-slate-700 flex-1">{item}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* =========================================
                        LEGO-BIT 4: FORMULÄRFÄLT (1-4)
                    ========================================= */}
                    <View className="mb-2">
                        {actionPage.showFormFields.field1 && (
                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-slate-700 mb-2 ml-1">{content.formFieldLabels.field1 || "Svar 1"}</Text>
                                <TextInput
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800"
                                    placeholder="Skriv här..."
                                    value={answers.formField1 || ""}
                                    onChangeText={(text) => setAnswers((prev) => ({ ...prev, formField1: text }))}
                                />
                            </View>
                        )}
                        {actionPage.showFormFields.field2 && (
                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-slate-700 mb-2 ml-1">{content.formFieldLabels.field2 || "Svar 2"}</Text>
                                <TextInput
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800"
                                    placeholder="Skriv här..."
                                    value={answers.formField2 || ""}
                                    onChangeText={(text) => setAnswers((prev) => ({ ...prev, formField2: text }))}
                                />
                            </View>
                        )}

                        {actionPage.showFormFields.field3 && (
                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-slate-700 mb-2 ml-1">{content.formFieldLabels.field3 || "Svar 3"}</Text>
                                <TextInput
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800"
                                    placeholder="Skriv här..."
                                    value={answers.formField3 || ""}
                                    onChangeText={(text) => setAnswers((prev) => ({ ...prev, formField3: text }))}
                                />
                            </View>
                        )}

                        {actionPage.showFormFields.field4 && (
                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-slate-700 mb-2 ml-1">{content.formFieldLabels.field4 || "Svar 3"}</Text>
                                <TextInput
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800"
                                    placeholder="Skriv här..."
                                    value={answers.formField4 || ""}
                                    onChangeText={(text) => setAnswers((prev) => ({ ...prev, formField4: text }))}
                                />
                            </View>
                        )}
                    </View>

                    {/* =========================================
                        LEGO-BIT 5: SKICKA FORMULÄR-KNAPP 
                    ========================================= */}
                    {actionPage.showSubmitButton && (
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={isPending}
                            className={`py-4 rounded-xl items-center mt-2 ${isPending ? "bg-orange-300" : "bg-[#F97316]"}`}
                        >
                            {isPending ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold text-lg">{content.submitButtonText || "Skicka in"}</Text>
                            )}
                        </TouchableOpacity>
                    )}

                    {/* =========================================
                        LEGO-BIT 6: BEKRÄFTA & FRÅGA-KNAPPAR
                    ========================================= */}
                    {actionPage.showConfirmButtons && !actionPage.showSubmitButton && (
                        <View className="mt-2 space-y-3">
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={isPending}
                                className={`py-4 rounded-xl items-center ${isPending ? "bg-orange-300" : "bg-[#F97316]"}`}
                            >
                                {isPending ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-bold text-lg">{content.confirmButtonText || "Jag bekräftar"}</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => Alert.alert("Kontakta admin", "Denna funktion kommer snart: skicka meddelande till admin.")}
                                className="py-4 rounded-xl items-center bg-slate-100 border border-slate-200"
                            >
                                <Text className="text-slate-700 font-bold text-lg">Jag har en fråga om detta</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

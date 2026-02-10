import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    LayoutAnimation,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InstrumentCard from "../../../src/components/onboarding/InstrumentCard";
import ProgressBar from "../../../src/components/onboarding/ProgressBar";
import { authService } from "../../../src/services/auth.service";
import { useAuthStore } from "../../../src/store/authStore";

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PRESET_INSTRUMENTS = [
    { id: "piano", label: "Piano", emoji: "🎹", iconBg: "bg-amber-100" },
    { id: "guitarr", label: "Guitarr", emoji: "🎸", iconBg: "bg-yellow-100" },
    { id: "fiol", label: "Fiol", emoji: "🎻", iconBg: "bg-green-200" },
    { id: "klarinett", label: "Klarinett", emoji: "🎵", iconBg: "bg-purple-200" },
    { id: "trummor", label: "Trummor", emoji: "🥁", iconBg: "bg-pink-200" },
    { id: "saxofon", label: "Saxofon", emoji: "🎷", iconBg: "bg-rose-100" },
];

export default function InstrumentsScreen() {
    const router = useRouter();
    const token = useAuthStore((state) => state.token);
    const setNeedsOnboarding = useAuthStore((state) => state.setNeedsOnboarding);
    const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customInstrument, setCustomInstrument] = useState("");

    const profileMutation = useMutation({
        mutationFn: async (instruments: string[]) => {
            if (!token) throw new Error("No token found");
            return authService.updateProfile(token, { instruments });
        },
        onSuccess: () => {
            setNeedsOnboarding(false);
            router.replace("/(auth)");
        },
        onError: (error: any) => {
            console.error("Profile update failed:", error);
            const message = error.response?.data?.message || "Något gick fel. Försök igen.";
            Alert.alert("Fel", message);
        },
    });

    const toggleInstrument = (label: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedInstruments((prev) => (prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]));
    };

    const addCustomInstrument = () => {
        const trimmed = customInstrument.trim();
        if (trimmed && !selectedInstruments.includes(trimmed)) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setSelectedInstruments((prev) => [...prev, trimmed]);
        }
        setCustomInstrument("");
        setShowCustomInput(false);
    };

    const removeInstrument = (label: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedInstruments((prev) => prev.filter((i) => i !== label));
    };

    const handleSubmit = () => {
        if (selectedInstruments.length === 0) return;
        profileMutation.mutate(selectedInstruments);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
                    {/* Progress Bar */}
                    <View className="px-5 pt-4">
                        <View className="flex-row items-center gap-3">
                            <View className="flex-1">
                                <ProgressBar step={2} total={2} />
                            </View>
                            <Text className="text-sm text-gray-400 font-medium">2 / 2</Text>
                        </View>
                    </View>

                    {/* Header */}
                    <View className="px-5 mt-6 mb-6">
                        <Text className="text-2xl font-bold text-slate-900 mb-1">Vad spelar du?</Text>
                        <Text className="text-base text-gray-400">Välj de instrument du kan lära ut.</Text>
                    </View>

                    {/* Instrument Grid */}
                    <View className="px-5 mb-2">
                        {[0, 1, 2].map((rowIndex) => (
                            <View key={rowIndex} className="flex-row gap-4 mb-4">
                                {PRESET_INSTRUMENTS.slice(rowIndex * 2, rowIndex * 2 + 2).map((instrument) => (
                                    <InstrumentCard
                                        key={instrument.id}
                                        label={instrument.label}
                                        emoji={instrument.emoji}
                                        iconBg={instrument.iconBg}
                                        selected={selectedInstruments.includes(instrument.label)}
                                        onPress={() => toggleInstrument(instrument.label)}
                                    />
                                ))}
                            </View>
                        ))}
                    </View>

                    {/* --- Dina instrument --- */}
                    <View className="px-5 mt-4">
                        <Text className="text-base font-bold text-slate-900 mb-3">Dina instrument</Text>

                        <View className="flex-row flex-wrap gap-2 mb-3">
                            {/* Selected Chips */}
                            {selectedInstruments.map((inst) => (
                                <TouchableOpacity
                                    key={inst}
                                    onPress={() => removeInstrument(inst)}
                                    activeOpacity={0.7}
                                    className="bg-slate-100 pl-4 pr-3 py-2 rounded-xl flex-row items-center border border-slate-200"
                                >
                                    <Text className="text-sm text-slate-800 font-medium mr-2">{inst}</Text>
                                    <Ionicons name="close-circle" size={16} color="#94a3b8" />
                                </TouchableOpacity>
                            ))}

                            {/* Add Custom Button (Inline with chips) */}
                            {!showCustomInput && (
                                <TouchableOpacity
                                    onPress={() => setShowCustomInput(true)}
                                    activeOpacity={0.7}
                                    className="px-4 py-2 rounded-xl border border-dashed border-slate-300 flex-row items-center"
                                >
                                    <Text className="text-slate-500 font-medium text-sm">+ Lägg till fler</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Custom Input Field */}
                        {showCustomInput && (
                            <View className="flex-row items-center gap-2 mb-2">
                                <TextInput
                                    className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-slate-800"
                                    placeholder=""
                                    placeholderTextColor="#9CA3AF"
                                    value={customInstrument}
                                    onChangeText={setCustomInstrument}
                                    autoFocus
                                    onSubmitEditing={addCustomInstrument}
                                    returnKeyType="done"
                                />
                                <TouchableOpacity onPress={addCustomInstrument} className="bg-slate-900 px-5 py-3 rounded-xl">
                                    <Text className="text-white font-semibold">Lägg till</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {selectedInstruments.length > 0 && (
                        <View className="px-5 mt-10">
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={profileMutation.isPending}
                                activeOpacity={0.8}
                                className={`p-4 rounded-2xl items-center shadow-sm ${profileMutation.isPending ? "bg-slate-300" : "bg-brand-green"}`}
                            >
                                {profileMutation.isPending ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text className="text-white font-bold text-lg">FÄRDIGSTÄLL PROFIL</Text>
                                )}
                            </TouchableOpacity>
                            <Text className="text-center text-gray-400 text-xs mt-3">Du kan lägga till fler instrument senare i din profil</Text>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

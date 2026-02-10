import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import ProgressBar from "../../../src/components/onboarding/ProgressBar";
import InstrumentCard from "../../../src/components/onboarding/InstrumentCard";
import { authService } from "../../../src/services/auth.service";
import { useAuthStore } from "../../../src/store/authStore";

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
            const message =
                error.response?.data?.message || "Något gick fel. Försök igen.";
            Alert.alert("Fel", message);
        },
    });

    const toggleInstrument = (label: string) => {
        setSelectedInstruments((prev) =>
            prev.includes(label)
                ? prev.filter((i) => i !== label)
                : [...prev, label]
        );
    };

    const addCustomInstrument = () => {
        const trimmed = customInstrument.trim();
        if (trimmed && !selectedInstruments.includes(trimmed)) {
            setSelectedInstruments((prev) => [...prev, trimmed]);
        }
        setCustomInstrument("");
        setShowCustomInput(false);
    };

    const removeInstrument = (label: string) => {
        setSelectedInstruments((prev) => prev.filter((i) => i !== label));
    };

    const handleSubmit = () => {
        if (selectedInstruments.length === 0) {
            Alert.alert("Välj instrument", "Välj minst ett instrument för att fortsätta.");
            return;
        }
        profileMutation.mutate(selectedInstruments);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 120 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Progress Bar */}
                    <View className="px-5 pt-4">
                        <View className="flex-row items-center gap-3">
                            <View className="flex-1">
                                <ProgressBar step={2} total={2} />
                            </View>
                            <Text className="text-sm text-gray-400 font-medium">
                                2 / 2
                            </Text>
                        </View>
                    </View>

                    {/* Header */}
                    <View className="px-5 mt-6 mb-6">
                        <Text className="text-2xl font-bold text-slate-900 mb-1">
                            Vad spelar du?
                        </Text>
                        <Text className="text-base text-gray-400">
                            Välj de instrument du kan lära ut.
                        </Text>
                    </View>

                    {/* Instrument Grid – 2 columns */}
                    <View className="px-5">
                        {[0, 1, 2].map((rowIndex) => (
                            <View key={rowIndex} className="flex-row gap-4 mb-4">
                                {PRESET_INSTRUMENTS.slice(
                                    rowIndex * 2,
                                    rowIndex * 2 + 2
                                ).map((instrument) => (
                                    <InstrumentCard
                                        key={instrument.id}
                                        label={instrument.label}
                                        emoji={instrument.emoji}
                                        iconBg={instrument.iconBg}
                                        selected={selectedInstruments.includes(
                                            instrument.label
                                        )}
                                        onPress={() =>
                                            toggleInstrument(instrument.label)
                                        }
                                    />
                                ))}
                            </View>
                        ))}
                    </View>

                    {/* "Dina instrument" Section */}
                    {selectedInstruments.length > 0 && (
                        <View className="px-5 mt-4">
                            <Text className="text-base font-bold text-slate-900 mb-3">
                                Dina instrument
                            </Text>
                            <View className="flex-row flex-wrap gap-2 mb-3">
                                {selectedInstruments.map((inst) => (
                                    <TouchableOpacity
                                        key={inst}
                                        onPress={() => removeInstrument(inst)}
                                        activeOpacity={0.7}
                                        className="bg-gray-100 px-4 py-2 rounded-full flex-row items-center"
                                    >
                                        <Text className="text-sm text-slate-800 font-medium">
                                            {inst}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Add Custom */}
                            {showCustomInput ? (
                                <View className="flex-row items-center gap-2 mb-2">
                                    <TextInput
                                        className="flex-1 bg-gray-100 px-4 py-3 rounded-xl text-slate-800"
                                        placeholder="Skriv instrumentnamn..."
                                        placeholderTextColor="#9CA3AF"
                                        value={customInstrument}
                                        onChangeText={setCustomInstrument}
                                        autoFocus
                                        onSubmitEditing={addCustomInstrument}
                                        returnKeyType="done"
                                    />
                                    <TouchableOpacity
                                        onPress={addCustomInstrument}
                                        className="bg-brand-green px-4 py-3 rounded-xl"
                                    >
                                        <Text className="text-white font-semibold">
                                            Lägg till
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => setShowCustomInput(true)}
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-purple-600 font-semibold text-sm">
                                        + Lägg till fler
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </ScrollView>

                {/* Bottom Action Area */}
                <View className="absolute bottom-0 left-0 right-0 bg-white px-5 pb-8 pt-3">
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={profileMutation.isPending}
                        activeOpacity={0.8}
                        className={`p-4 rounded-2xl items-center ${
                            profileMutation.isPending
                                ? "bg-gray-400"
                                : "bg-brand-green"
                        }`}
                    >
                        {profileMutation.isPending ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-white font-bold text-lg">
                                FÄRDIGSTÄLL PROFIL
                            </Text>
                        )}
                    </TouchableOpacity>
                    <Text className="text-center text-gray-400 text-xs mt-2">
                        Du kan lägga till fler instrument senare i din profil
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

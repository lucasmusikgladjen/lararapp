import React, { useState } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentPublicDTO } from "../../types/student.types";

interface StudentDetailModalProps {
    visible: boolean;
    student: StudentPublicDTO | null;
    onClose: () => void;
}

// Map instrument names to Ionicons icon names
const INSTRUMENT_ICONS: Record<string, string> = {
    piano: "musical-notes",
    gitarr: "guitar",
    fiol: "musical-notes",
    trummor: "disc",
    sång: "mic",
};

function getInstrumentIcon(instrument: string): string {
    return INSTRUMENT_ICONS[instrument.toLowerCase()] ?? "musical-notes";
}

export function StudentDetailModal({ visible, student, onClose }: StudentDetailModalProps) {
    const [greeting, setGreeting] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (!student) return null;

    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${student.id}`;
    const primaryInstrument = student.instruments[0] ?? "Instrument";

    const handleApply = () => {
        setSubmitting(true);
        // Mock: real API call comes later
        setTimeout(() => {
            setSubmitting(false);
            Alert.alert("Ansökan skickad!", "Vi hör av oss.");
            setGreeting("");
            onClose();
        }, 300);
    };

    const handleClose = () => {
        setGreeting("");
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 bg-white"
            >
                <ScrollView
                    className="flex-1"
                    bounces={false}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Drag Handle */}
                    <View className="items-center pt-3 pb-1">
                        <View className="w-10 h-1 rounded-full bg-gray-300" />
                    </View>

                    {/* Header with close button */}
                    <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
                        <Text className="text-xl font-bold text-slate-900">
                            Elev: {student.name}
                        </Text>
                        <TouchableOpacity
                            onPress={handleClose}
                            activeOpacity={0.7}
                            className="w-8 h-8 items-center justify-center"
                        >
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Hero Section - Avatar with badges */}
                    <View className="items-center px-5 pb-6">
                        <View className="relative">
                            {/* Avatar */}
                            <Image
                                source={{ uri: avatarUrl }}
                                className="w-28 h-28 rounded-full bg-slate-100"
                            />

                            {/* Star badge (bottom left) */}
                            <View
                                className="absolute -left-3 bottom-4 w-10 h-10 rounded-full items-center justify-center"
                                style={{ backgroundColor: "#34C759" }}
                            >
                                <Ionicons name="star" size={20} color="#FFFFFF" />
                            </View>

                            {/* Instrument badge (top right) */}
                            <View
                                className="absolute -right-3 top-2 w-10 h-10 rounded-full items-center justify-center"
                                style={{ backgroundColor: "#F97316" }}
                            >
                                <Ionicons
                                    name={getInstrumentIcon(primaryInstrument) as any}
                                    size={20}
                                    color="#FFFFFF"
                                />
                            </View>
                        </View>

                        {/* Instrument label */}
                        <Text className="text-base font-bold text-slate-900 mt-3">
                            {primaryInstrument.charAt(0).toUpperCase() + primaryInstrument.slice(1)}
                        </Text>
                    </View>

                    {/* About Section */}
                    <View className="px-5 pb-4">
                        <Text className="text-lg font-bold text-slate-900 mb-2">
                            Om eleven
                        </Text>
                        <Text className="text-sm text-gray-500 leading-5">
                            {student.name} söker en lärare i{" "}
                            {student.instruments.join(", ").toLowerCase()}.
                            Eleven bor i {student.city} och letar efter en pedagogisk lärare
                            som kan hjälpa till att ta nästa steg i sin musikaliska utveckling.
                        </Text>
                    </View>

                    {/* Divider */}
                    <View className="mx-5 border-b border-gray-200 mb-4" />

                    {/* Application Section */}
                    <View className="px-5 pb-4">
                        <Text className="text-lg font-bold text-slate-900 mb-3">
                            Skicka ansökan
                        </Text>

                        {/* Green card with input */}
                        <View
                            className="rounded-2xl p-4"
                            style={{ backgroundColor: "#F0FDF4" }}
                        >
                            <Text className="text-sm font-bold text-slate-900 mb-2">
                                Skriv en hälsning!
                            </Text>

                            <TextInput
                                className="bg-white rounded-xl p-4 text-sm text-slate-900 min-h-[100px]"
                                placeholder="Hej! Jag skulle gärna vilja bli din pianolärare och hjälpa dig utvecklas."
                                placeholderTextColor="#9CA3AF"
                                multiline
                                textAlignVertical="top"
                                value={greeting}
                                onChangeText={setGreeting}
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#E5E7EB",
                                }}
                            />

                            <Text className="text-xs text-gray-400 mt-2">
                                Din hälsning visas för eleven och Musikglädjens team direkt!
                            </Text>
                        </View>
                    </View>

                    {/* Apply Button */}
                    <View className="px-5 pb-2">
                        <TouchableOpacity
                            onPress={handleApply}
                            activeOpacity={0.85}
                            disabled={submitting}
                            className="rounded-2xl py-4 items-center"
                            style={{
                                backgroundColor: "#34C759",
                                opacity: submitting ? 0.6 : 1,
                            }}
                        >
                            <Text className="text-white font-bold text-base tracking-wider">
                                ANSÖK
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Subtitle */}
                    <View className="items-center pb-8">
                        <Text className="text-xs text-gray-400">
                            Vanligtvis får du svar samma dag!
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/authStore";
import { DashboardHeader } from "./DashboardHeader";

export const EmptyStateDashboard = () => {
    const user = useAuthStore((state) => state.user);
    const firstName = user?.name ? user.name.split(" ")[0] : "";

    return (
        <SafeAreaView className="flex-1 bg-brand-bg">
            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                {/* --- HEADER --- */}
                <DashboardHeader />

                {/* --- VÄLKOMST --- */}
                <Text className="text-2xl font-bold text-slate-900 text-center mb-4">
                    Välkommen, {firstName}! 🎉
                </Text>

                {/* --- PROFIL KLAR --- */}
                <View className="rounded-2xl py-4 px-5 mb-6 flex-row items-center" style={{ backgroundColor: "#34C759" }}>
                    <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: "rgba(255,255,255,0.25)" }}>
                        <Ionicons name="checkmark" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-base font-bold text-white">Profilen är 100% klar!</Text>
                        <Text className="text-sm text-white/70">Du är redo att börja undervisa.</Text>
                    </View>
                </View>

                {/* --- HERO CARD --- */}
                <View className="rounded-3xl p-6 mb-6 items-center" style={{ backgroundColor: "#7C6BF0" }}>
                    <View className="w-20 h-20 rounded-full items-center justify-center mb-4" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                        <Text className="text-4xl">🦁</Text>
                    </View>
                    <Text className="text-xl font-bold text-white mb-1">Dags att komma igång!</Text>
                    <Text className="text-sm text-white/70 mb-5">Din första elev väntar på dig.</Text>
                    <TouchableOpacity
                        className="bg-brand-orange rounded-full py-3.5 w-full items-center"
                        activeOpacity={0.85}
                        onPress={() => router.push("/(auth)/find-students")}
                    >
                        <Text className="text-base font-bold text-white tracking-wide">HITTA ELEVER</Text>
                    </TouchableOpacity>
                </View>

                {/* --- TOMT SCHEMA --- */}
                <Text className="text-xl font-bold text-slate-900 mb-3">Ditt schema</Text>
                <View className="rounded-3xl border-2 border-dashed border-gray-300 py-10 items-center">
                    <Ionicons name="calendar-outline" size={48} color="#D1D5DB" />
                    <Text className="text-base font-bold text-slate-900 mt-3">Inget inbokat</Text>
                    <Text className="text-sm text-gray-400 text-center mt-1 px-6">
                        {"När du får dina första elever\nkommer ditt schema att synas här."}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

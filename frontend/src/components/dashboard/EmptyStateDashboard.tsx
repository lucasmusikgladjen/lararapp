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

    // Define a reusable shadow style for consistency
    const cardShadow = {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, // Soft, premium shadow
        shadowRadius: 12,
        elevation: 5, // Required for Android
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                {/* --- HEADER --- */}
                <DashboardHeader />

                {/* --- VÄLKOMMEN --- */}
                <View className="mb-6 mt-2 items-center flex-row justify-center">
                    <Text className="text-2xl font-bold text-slate-900">Välkommen, {firstName}!</Text>
                    <Text className="text-2xl ml-2">🎉</Text>
                </View>

                {/* --- PROFIL KLAR CARD --- */}
                <View className="rounded-2xl p-5 mb-8 flex-row items-center bg-green-400 border border-emerald-100" style={cardShadow}>
                    {/* Icon Badge */}
                    <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-4 shadow-sm">
                        <Ionicons name="checkmark" size={24} color="black" />
                    </View>

                    {/* Text Section */}
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-slate-900">Din profil är färdig!</Text>
                        <Text className="text-sm font-medium text-slate-700 mt-0.5">Du är redo att börja undervisa.</Text>
                    </View>
                </View>

                {/* --- HERO CARD --- */}
                <View
                    className="rounded-2xl mb-8 overflow-hidden relative"
                    style={{
                        backgroundColor: "#6366f1",
                        ...cardShadow,
                        shadowColor: "#4f46e5",
                        shadowOpacity: 0.25,
                    }}
                >
                    {/* --- DECORATIVE SHAPES --- */}
                    <View className="absolute top-[-50] right-[-50] w-64 h-64 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
                    <View className="absolute bottom-[-30] left-[-20] w-52 h-52 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />

                    {/* --- CARD CONTENT --- */}
                    <View className="p-7">
                        <View className="flex-row items-center mb-7">
                            <View className="w-20 h-20 rounded-full bg-amber-100 items-center justify-center mr-4 border-2 border-amber-50">
                                <Text className="text-4xl">🦁</Text>
                            </View>

                            <View className="flex-1 justify-center">
                                <Text className="text-xl font-bold text-white leading-tight mb-2 shadow-sm">Dags att komma igång!</Text>
                                <Text className="text-lg text-indigo-100 font-medium leading-6 mr-4">Din första elev väntar på dig.</Text>
                            </View>
                        </View>

                        {/* Button */}
                        <TouchableOpacity
                            className="bg-brand-orange rounded-full py-3.5 w-full items-center shadow-sm"
                            activeOpacity={0.85}
                            onPress={() => router.push("/(auth)/find-students")}
                        >
                            <Text className="text-base font-bold text-white tracking-wide">HITTA ELEVER</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* --- DITT SCHEMA --- */}
                <Text className="text-xl font-bold text-slate-900 mb-4 ml-1">Ditt schema</Text>
                <View className="rounded-3xl border-2 border-dashed border-slate-400 bg-slate-50/50 py-12 items-center">
                    <View className="w-16 h-16 rounded-2xl bg-white items-center justify-center mb-4 shadow-sm border border-slate-100">
                        <Ionicons name="calendar-clear-outline" size={32} color="#94a3b8" />
                    </View>
                    <Text className="text-base font-bold text-slate-800 mb-1">Inget inbokat</Text>
                    <Text className="text-sm text-slate-500 text-center leading-5 ">Här visas ditt schema när du har elever</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

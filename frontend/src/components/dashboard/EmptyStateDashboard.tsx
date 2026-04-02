import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/authStore";
import { PageHeader } from "../ui/PageHeader";
import { DashboardBackground } from "../ui/DashboardBackground";

export const EmptyStateDashboard = () => {
    const user = useAuthStore((state) => state.user);
    const firstName = user?.name ? user.name.split(" ")[0] : "";

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "God morgon";
        if (hour < 18) return "God eftermiddag";
        return "God kväll";
    };

    return (
        <DashboardBackground>
            <SafeAreaView className="flex-1" edges={["top"]}>
                <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                    {/* --- HEADER --- */}
                    <PageHeader />

                    {/* --- VÄLKOMMEN --- */}
                    <View className="mb-10 mt-6 px-1">
                        {/* Greeting - Lite mer spacing och mindre storlek för elegans */}
                        <Text className="text-brand-orange text-[11px] font-black uppercase tracking-[4px] mb-2">{getGreeting()}</Text>

                        {/* Main Welcome */}
                        <View className="flex-row items-center">
                            <Text className="text-3xl font-black text-slate-900 tracking-tighter">Välkommen, {firstName}</Text>
                            <Text className="text-3xl ml-2">👋</Text>
                        </View>

                        {/* 70s Decorative Element: Linje + Punkt (Gör stor skillnad!) */}
                        <View className="flex-row items-center mt-5">
                            <View className="h-1.5 w-14 bg-brand-orange rounded-full" />
                            <View className="h-1.5 w-1.5 bg-brand-orange rounded-full ml-1.5" />
                        </View>
                    </View>

                    {/* --- PROFIL KLAR CARD --- */}
                    <View style={[styles.statusCard, styles.standardShadow]}>
                        {/* Dekorativa cirklar */}
                        <View style={[styles.circle, styles.emeraldCircle1]} />
                        <View style={[styles.circle, styles.emeraldCircle2]} />

                        <View className="flex-row items-center p-6">
                            <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center mr-4 border border-white/30">
                                <Ionicons name="checkmark-circle" size={32} color="white" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xl font-bold text-white tracking-tight">Din profil är färdig!</Text>
                                <Text className="text-emerald-50 font-medium opacity-90">Du är redo att börja undervisa.</Text>
                            </View>
                        </View>
                    </View>

                    {/* --- HERO CARD --- */}
                    <View style={[styles.heroCard, styles.heroShadow]}>
                        {/* Dekorativa cirklar */}
                        <View style={[styles.circle, styles.heroCircle1]} />
                        <View style={[styles.circle, styles.heroCircle2]} />

                        {/* Här behåller vi dina Tailwind-klasser som du önskade */}
                        <View className="p-7">
                            <View className="flex-row items-center mb-7">
                                {/* LEJON-CONTAINER */}
                                <View className="w-20 h-20 rounded-full bg-amber-100 items-center justify-center mr-4 border-2 border-amber-400 overflow-hidden">
                                    <Text style={styles.lionEmoji}>🦁</Text>
                                </View>
                                <View className="flex-1 justify-center">
                                    <Text className="text-xl font-bold text-white leading-tight mb-2 shadow-sm">Dags att komma igång!</Text>
                                    <Text className="text-lg text-indigo-100 font-medium leading-6 mr-4">Sök efter din första elev</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                className="bg-brand-orange rounded-full py-4 w-full items-center shadow-sm"
                                activeOpacity={0.85}
                                onPress={() => router.push("/(auth)/find-students")}
                            >
                                <Text className="text-base font-bold text-white tracking-wide">HITTA ELEVER</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* --- DITT SCHEMA PLACEHOLDER --- */}
                    <View className="rounded-3xl border-2 border-dashed border-slate-200 bg-white py-12 items-center overflow-hidden relative">
                        {/* Subtila dekorativa cirklar för visuell konsistens */}
                        <View style={[styles.circle, styles.placeholderCircle1]} />
                        <View style={[styles.circle, styles.placeholderCircle2]} />

                        {/* Innehåll (med z-10 för att ligga över cirklarna) */}
                        <View className="w-16 h-16 rounded-2xl bg-white items-center justify-center mb-4 shadow-sm border border-slate-100 z-10">
                            <Ionicons name="calendar-clear-outline" size={32} color="#94a3b8" />
                        </View>
                        <Text className="text-base font-bold text-slate-800 mb-1 z-10">Inget inbokat</Text>
                        <Text className="text-sm text-slate-500 text-center leading-5 px-10 z-10">
                            Här visas ditt schema när du får din första elev
                        </Text>
                    </View>

                    {/* Padding i botten för scrollen */}
                    <View className="h-10" />
                </ScrollView>
            </SafeAreaView>
        </DashboardBackground>
    );
};

const styles = StyleSheet.create({
    /* --- EMOJI FIX --- */
    lionEmoji: {
        fontSize: 48,
        lineHeight: 58,
        textAlign: "center",
        marginTop: 4,
    },
    /* --- SHADOWS --- */
    standardShadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    heroShadow: {
        shadowColor: "#4f46e5",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 10,
    },
    /* --- CARDS --- */
    statusCard: {
        backgroundColor: "#10b981",
        borderRadius: 24,
        marginBottom: 32,
        overflow: "hidden",
        position: "relative",
    },
    heroCard: {
        backgroundColor: "#6366f1",
        borderRadius: 24,
        marginBottom: 32,
        overflow: "hidden",
        position: "relative",
    },
    /* --- DECORATIVE CIRCLES --- */
    circle: {
        position: "absolute",
        borderRadius: 999,
    },
    emeraldCircle1: {
        top: -20,
        left: -20,
        width: 128,
        height: 128,
        backgroundColor: "rgba(255, 255, 255, 0.12)",
    },
    emeraldCircle2: {
        bottom: -40,
        right: -10,
        width: 96,
        height: 96,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    heroCircle1: {
        top: -50,
        right: -50,
        width: 256,
        height: 256,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    heroCircle2: {
        bottom: -30,
        left: -20,
        width: 208,
        height: 208,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    // Specifika cirklar för schema-placeholdern
    placeholderCircle1: {
        top: -30,
        left: -30,
        width: 140,
        height: 140,
        backgroundColor: "rgba(148, 163, 184, 0.1)", // Mycket subtil grå
    },
    placeholderCircle2: {
        bottom: -50,
        right: -20,
        width: 110,
        height: 110,
        backgroundColor: "rgba(148, 163, 184, 0.1)", // Ännu subtilare
    },
});

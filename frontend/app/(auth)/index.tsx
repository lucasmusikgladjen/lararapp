import React, { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DashboardHeader } from "../../src/components/dashboard/DashboardHeader";
import { ReportBanner } from "../../src/components/dashboard/ReportBanner";
import { SchemaToggle, ToggleOption } from "../../src/components/dashboard/SchemaToggle";
import { ScheduleCard } from "../../src/components/dashboard/ScheduleCard";
import { NextLessonCard } from "../../src/components/lessons/NextLessonCard";
import { useStudents } from "../../src/hooks/useStudents";
import { useAuthStore } from "../../src/store/authStore";
import { findNextLesson, getAllLessonEvents } from "../../src/utils/lessonHelpers";
import { router } from "expo-router";

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const { data: students, isLoading, error } = useStudents();
    const [activeTab, setActiveTab] = useState<ToggleOption>("kommande");

    const logout = useAuthStore((state) => state.logout);

    const handleLogout = async () => {
        await logout();
        router.replace("/(public)/login");
    };

    // Beräkna nästa lektion dynamiskt
    const nextLesson = useMemo(() => {
        if (!students) return null;
        return findNextLesson(students);
    }, [students]);

    // Hämta alla lektionshändelser
    const allLessons = useMemo(() => {
        if (!students) return [];
        return getAllLessonEvents(students);
    }, [students]);

    // Filtrera och sortera baserat på aktiv flik
    const scheduleLessons = useMemo(() => {
        if (activeTab === "kommande") {
            return allLessons.filter((l) => l.daysLeft >= 0).sort((a, b) => a.date.localeCompare(b.date));
        }
        return allLessons.filter((l) => l.daysLeft < 0).sort((a, b) => b.date.localeCompare(a.date));
    }, [allLessons, activeTab]);

    const firstName = user?.name ? user.name.split(" ")[0] : "Non";

    return (
        <SafeAreaView className="flex-1 bg-brand-bg">
            {/*   <TouchableOpacity onPress={handleLogout} className="bg-red-50 py-3 rounded-xl items-center">
                <Text className="text-red-600 font-bold">Logga ut</Text>
            </TouchableOpacity> */}

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                {/* --- HEADER --- */}
                <DashboardHeader />

                {/* --- VÄLKOMSTBOX --- */}
                <View className="bg-white rounded-2xl py-4 px-6 shadow-sm mb-3 items-center">
                    <Text className="text-lg font-semibold text-slate-800">Välkommen tillbaka, {firstName}!</Text>
                </View>

                {/* --- RAPPORT-BANNER --- */}
                <ReportBanner onPress={() => console.log("Report pressed")} />

                {/* --- NÄSTA LEKTION --- */}
                <View className="mb-6">
                    <Text className="text-xl font-bold text-slate-900 mb-3">Nästa lektion</Text>

                    {isLoading ? (
                        <ActivityIndicator size="small" color="#34C759" />
                    ) : nextLesson ? (
                        <NextLessonCard
                            lesson={nextLesson}
                            onPress={() => router.push(`/(auth)/student/${nextLesson.student.id}`)}
                        />
                    ) : (
                        <View className="bg-white rounded-3xl p-6 shadow-sm items-center border border-gray-100">
                            <Text className="text-gray-400 text-base">Inga inbokade lektioner just nu</Text>
                        </View>
                    )}
                </View>

                {/* --- DITT SCHEMA --- */}
                <View className="mb-6">
                    <Text className="text-xl font-bold text-slate-900 mb-3">Ditt schema</Text>

                    <SchemaToggle activeTab={activeTab} onToggle={setActiveTab} />

                    {isLoading && <ActivityIndicator size="large" color="#34C759" className="mt-10" />}

                    {error && <Text className="text-red-500 text-center mt-4">Kunde inte hämta schema.</Text>}

                    {!isLoading && !error && (
                        <View className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            {scheduleLessons.length > 0 ? (
                                scheduleLessons.map((lesson, index) => (
                                    <ScheduleCard
                                        key={`${lesson.student.id}-${lesson.date}`}
                                        lesson={lesson}
                                        onPress={() => router.push(`/(auth)/student/${lesson.student.id}`)}
                                        isLast={index === scheduleLessons.length - 1}
                                    />
                                ))
                            ) : (
                                <View className="py-10 items-center">
                                    <Text className="text-gray-400 text-base">
                                        {activeTab === "kommande" ? "Inga kommande lektioner" : "Inga tidigare lektioner"}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageHeader } from "../../../src/components/ui/DashboardHeader";
import { EmptyStateDashboard } from "../../../src/components/dashboard/EmptyStateDashboard";
import { ReportBanner } from "../../../src/components/dashboard/ReportBanner";
import { ScheduleCard } from "../../../src/components/dashboard/ScheduleCard";
import { SchemaToggle, ToggleOption } from "../../../src/components/dashboard/SchemaToggle";
import { NextLessonCard } from "../../../src/components/lessons/NextLessonCard";
import { useStudents } from "../../../src/hooks/useStudents";
import { useAuthStore } from "../../../src/store/authStore";
import { findNextLesson, getAllLessonEvents } from "../../../src/utils/lessonHelpers";

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const { data: students, isLoading, error } = useStudents();
    const [activeTab, setActiveTab] = useState<ToggleOption>("kommande");

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

    const firstName = user?.name ? user.name.split(" ")[0] : "No Name";

    // Visa laddningsindikator medan data hämtas
    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-brand-bg items-center justify-center">
                <ActivityIndicator size="large" color="#F97316" />
            </SafeAreaView>
        );
    }

    // Om läraren inte har några elever, visa Empty State Dashboard
    if (!students || students.length === 0) {
        return <EmptyStateDashboard />;
    }

    return (
        // LÖSNINGEN: edges={["top"]} tar bort blocket i botten
        <SafeAreaView edges={["top"]} className="flex-1 bg-brand-bg">
            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                <PageHeader title="Dashboard" />

                {/* --- VÄLKOMSTBOX --- */}
                <View className="bg-white rounded-2xl py-4 px-6 shadow-sm mb-3 items-center">
                    <Text className="text-lg font-semibold text-slate-800">Välkommen tillbaka, {firstName}!</Text>
                </View>

                {/* --- RAPPORT-BANNER --- */}
                <ReportBanner onPress={() => console.log("Report pressed")} />

                {/* --- NÄSTA LEKTION --- */}
                <View className="mb-6">
                    <Text className="text-xl font-bold text-slate-900 mb-3">Nästa lektion</Text>

                    {nextLesson ? (
                        <NextLessonCard lesson={nextLesson} onPress={() => router.push(`/(auth)/student/${nextLesson.student.id}`)} />
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

                    {error && <Text className="text-red-500 text-center mt-4">Kunde inte hämta schema.</Text>}

                    {!error && (
                        <View className="bg-white rounded-3xl shadow-sm border border-gray-100">
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

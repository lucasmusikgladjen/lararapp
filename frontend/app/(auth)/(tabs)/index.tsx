import { router, useFocusEffect } from "expo-router";
import React, { useMemo, useState, useCallback } from "react";
import { ActivityIndicator, ScrollView, Text, View, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageHeader } from "../../../src/components/ui/PageHeader";
import { EmptyStateDashboard } from "../../../src/components/dashboard/EmptyStateDashboard";
import { ScheduleCard } from "../../../src/components/dashboard/ScheduleCard";
import { SchemaToggle, ToggleOption } from "../../../src/components/dashboard/SchemaToggle";
import { NextLessonCard } from "../../../src/components/lessons/NextLessonCard";
import { useStudents } from "../../../src/hooks/useStudents";
import { useAuthStore } from "../../../src/store/authStore";
import { findNextLesson, getAllLessonEvents } from "../../../src/utils/lessonHelpers";
import { NotificationStack } from "../../../src/components/dashboard/NotificationStack";
import { useNotifications } from "../../../src/hooks/useNotifications";

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);

    const { data: students, isLoading: isStudentsLoading, error, refetch: refetchStudents } = useStudents();
    const { refetch: refetchNotifications } = useNotifications();
    const [activeTab, setActiveTab] = useState<ToggleOption>("kommande");
    const [refreshing, setRefreshing] = useState(false);

    // Funktion som körs när användaren "drar ner" skärmen
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        // Hämta både nya notiser och uppdaterade elever parallellt
        await Promise.all([refetchStudents(), refetchNotifications()]);
        setRefreshing(false);
    }, [refetchStudents, refetchNotifications]);

    // AUTO-REFRESH (Refetch on Focus)
    // Körs tyst i bakgrunden VARJE gång skärmen blir aktiv/synlig (när man tex byter till denna tab)
    useFocusEffect(
        useCallback(() => {
            refetchStudents();
            refetchNotifications();
        }, [refetchStudents, refetchNotifications]),
    );

    const nextLesson = useMemo(() => {
        if (!students) return null;
        return findNextLesson(students);
    }, [students]);

    const allLessons = useMemo(() => {
        if (!students) return [];
        return getAllLessonEvents(students);
    }, [students]);

    const scheduleLessons = useMemo(() => {
        if (activeTab === "kommande") {
            return allLessons.filter((l) => l.daysLeft >= 0).sort((a, b) => a.date.localeCompare(b.date));
        }
        return allLessons.filter((l) => l.daysLeft < 0).sort((a, b) => b.date.localeCompare(a.date));
    }, [allLessons, activeTab]);

    const firstName = user?.name ? user.name.split(" ")[0] : "No Name";

    if (isStudentsLoading) {
        return (
            <SafeAreaView className="flex-1 bg-brand-bg items-center justify-center">
                <ActivityIndicator size="large" color="#F97316" />
            </SafeAreaView>
        );
    }

    if (!students || students.length === 0) {
        return <EmptyStateDashboard />;
    }

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-brand-bg">
            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                // 6. Lägg till RefreshControl på ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#F97316" // Orange laddnings-spinner (iOS)
                        colors={["#F97316"]} // Orange laddnings-spinner (Android)
                    />
                }
            >
                {/* --- HEADER --- */}
                <PageHeader title="Dashboard" />

                {/* --- VÄLKOMSTBOX --- */}
                <View className="bg-white rounded-2xl py-4 px-6 shadow-sm mb-6 items-center">
                    <Text className="text-lg font-semibold text-slate-800">Välkommen tillbaka, {firstName}!</Text>
                </View>

                {/* --- NOTIFICATION STACK --- */}
                <NotificationStack />

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

                <View className="mb-6">
                    <Text className="text-xl font-bold text-slate-900 mb-3">Ditt schema</Text>

                    <SchemaToggle activeTab={activeTab} onToggle={setActiveTab} />

                    {error && <Text className="text-red-500 text-center mt-4">Kunde inte hämta schema.</Text>}

                    {!error && (
                        <View className="bg-white rounded-3xl shadow-sm border border-gray-100">
                            {scheduleLessons.length > 0 ? (
                                scheduleLessons.map((lesson, index) => (
                                    <ScheduleCard
                                        key={`${lesson.student.id}-${lesson.date}-${lesson.time}-${index}`}
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

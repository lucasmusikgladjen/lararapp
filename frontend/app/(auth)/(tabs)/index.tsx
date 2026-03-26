import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState, useRef } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { EmptyStateDashboard } from "../../../src/components/dashboard/EmptyStateDashboard";
import { NotificationStack } from "../../../src/components/dashboard/NotificationStack";
import { ScheduleCard } from "../../../src/components/dashboard/ScheduleCard";
import { SchemaToggle, ToggleOption } from "../../../src/components/dashboard/SchemaToggle";
import { PageHeader } from "../../../src/components/ui/PageHeader";
import { useNotifications } from "../../../src/hooks/useNotifications";
import { useStudents } from "../../../src/hooks/useStudents";
import { useAuthStore } from "../../../src/store/authStore";
import { getAllLessonEvents } from "../../../src/utils/lessonHelpers";

import { useCancelLesson, useCompleteLesson, useRescheduleLesson } from "../../../src/hooks/useLessonMutation";
import { CompleteLessonSheet } from "../../../src/components/lessons/actions/CompleteLessonSheet";
import { RescheduleLessonSheet } from "../../../src/components/lessons/actions/RescheduleLessonSheet";
import { CancelLessonSheet } from "../../../src/components/lessons/actions/CancelLessonSheet";

export default function Dashboard() {
    // Hämtar både user och logout | Nödbroms: Om user-objektet saknas, rendera nödknappen istället för att krascha/ladda oändligt
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const { data: students, isLoading: isStudentsLoading, error, refetch: refetchStudents } = useStudents();
    const { refetch: refetchNotifications } = useNotifications();
    const [activeTab, setActiveTab] = useState<ToggleOption>("kommande");
    const [refreshing, setRefreshing] = useState(false);

    // --------------- MODAL STATE ---------------
    const completeSheetRef = useRef<BottomSheetModal>(null);
    const rescheduleSheetRef = useRef<BottomSheetModal>(null);
    const cancelSheetRef = useRef<BottomSheetModal>(null);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    // --------------- MUTATIONS ---------------
    const completeMutation = useCompleteLesson({
        studentId: selectedStudentId || "",
        onSuccess: () => {
            completeSheetRef.current?.dismiss();
            setSelectedLessonId(null);
            refetchStudents();
            Alert.alert("Klart!", "Lektionen har markerats som genomförd.");
        },
    });

    const rescheduleMutation = useRescheduleLesson({
        studentId: selectedStudentId || "",
        onSuccess: () => {
            rescheduleSheetRef.current?.dismiss();
            setSelectedLessonId(null);
            refetchStudents();
            Alert.alert("Klart!", "Lektionen har bokats om.");
        },
    });

    const cancelMutation = useCancelLesson({
        studentId: selectedStudentId || "",
        onSuccess: () => {
            cancelSheetRef.current?.dismiss();
            setSelectedLessonId(null);
            refetchStudents();
            Alert.alert("Klart!", "Lektionen har ställts in.");
        },
    });

    // --------------- HANDLERS FÖR ATT ÖPPNA MODALER ---------------
    const handleMarkCompleted = (lessonId: string, studentId: string) => {
        setSelectedLessonId(lessonId);
        setSelectedStudentId(studentId);
        setTimeout(() => completeSheetRef.current?.present(), 10);
    };

    const handleReschedule = (lessonId: string, studentId: string) => {
        setSelectedLessonId(lessonId);
        setSelectedStudentId(studentId);
        setTimeout(() => rescheduleSheetRef.current?.present(), 10);
    };

    const handleCancel = (lessonId: string, studentId: string) => {
        setSelectedLessonId(lessonId);
        setSelectedStudentId(studentId);
        setTimeout(() => cancelSheetRef.current?.present(), 10);
    };

    // --------------- HANDLERS FÖR ATT BEKRÄFTA INUTI MODALER ---------------
    const handleConfirmComplete = (notes: string, homework: string) => {
        if (!selectedLessonId) return;
        completeMutation.mutate({ lessonId: selectedLessonId, payload: { notes, homework } });
    };

    const handleConfirmReschedule = (newDate: string, newTime: string, reason: string) => {
        if (!selectedLessonId) return;
        rescheduleMutation.mutate({ lessonId: selectedLessonId, payload: { newDate, newTime, reason } });
    };

    const handleConfirmCancel = (cancelledBy: "Läraren" | "Vårdnadshavaren", reason: string) => {
        if (!selectedLessonId) return;
        cancelMutation.mutate({ lessonId: selectedLessonId, payload: { cancelledBy, reason } });
    };

    // --------------- DATA FETCHING ---------------
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([refetchStudents(), refetchNotifications()]);
        setRefreshing(false);
    }, [refetchStudents, refetchNotifications]);

    useFocusEffect(
        useCallback(() => {
            refetchStudents();
            refetchNotifications();
        }, [refetchStudents, refetchNotifications]),
    );

    const allLessons = useMemo(() => {
        if (!students) return [];
        return getAllLessonEvents(students);
    }, [students]);

    // FILTRERA FÖRSENADE LEKTIONER
    const delayedLessons = useMemo(() => {
        return allLessons.filter((l) => l.daysLeft < 0 && !l.isCompleted).sort((a, b) => a.date.localeCompare(b.date));
    }, [allLessons]);

    // FILTRERA SCHEMAT (Kommande vs Senaste)
    const scheduleLessons = useMemo(() => {
        if (activeTab === "kommande") {
            return allLessons.filter((l) => l.daysLeft >= 0).sort((a, b) => a.date.localeCompare(b.date));
        }

        return allLessons.filter((l) => l.daysLeft < 0 && l.isCompleted).sort((a, b) => b.date.localeCompare(a.date));
    }, [allLessons, activeTab]);

    // ⚠️ NÖDBROMS: Om user-objektet saknas, rendera nödknappen istället för att krascha/ladda oändligt!
    if (!user) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-brand-bg px-5">
                <Text className="text-gray-500 mb-6">Kan inte läsa in din profil...</Text>
                <TouchableOpacity
                    onPress={async () => {
                        await logout();
                        router.replace("/(public)/login");
                    }}
                    className="bg-red-500 px-6 py-3 rounded-2xl shadow-sm"
                >
                    <Text className="text-white font-bold">Tvinga utloggning</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const firstName = user.name ? user.name.split(" ")[0] : "No Name";

    if (isStudentsLoading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#F97316" />
            </SafeAreaView>
        );
    }

    if (!students || students.length === 0) {
        return <EmptyStateDashboard />;
    }

    return (
        <SafeAreaView edges={["top"]} className="flex-1">
            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" colors={["#F97316"]} />}
            >
                <PageHeader />

                <View className="py-2 px-6 mb-2 items-center">
                    <Text className="text-3xl font-bold text-slate-800">Hej, {firstName}!</Text>
                </View>

                <NotificationStack />

                {/* --------------- FÖRSENADE LEKTIONER --------------- */}
                {delayedLessons.length > 0 && (
                    <View className="mb-6 mt-2">
                        <View className="bg-white rounded-3xl border border-slate-100 shadow-sm">
                            {delayedLessons.map((lesson, index) => (
                                <ScheduleCard
                                    key={`delayed-${lesson.student.id}-${lesson.date}-${index}`}
                                    lesson={lesson}
                                    onPress={() => {}}
                                    isLast={index === delayedLessons.length - 1}
                                    isKommande={false}
                                    isDelayed={true}
                                    onMarkCompleted={handleMarkCompleted}
                                    onReschedule={handleReschedule}
                                    onCancel={handleCancel}
                                />
                            ))}
                        </View>
                    </View>
                )}

                {/* --------------- VANLIGA SCHEMAT --------------- */}
                <View className="mb-6">
                    <SchemaToggle activeTab={activeTab} onToggle={setActiveTab} />

                    {error && <Text className="text-red-500 text-center mt-4">Kunde inte hämta schema.</Text>}

                    {!error && (
                        <View className="bg-white rounded-3xl border border-slate-100 shadow-sm">
                            {scheduleLessons.length > 0 ? (
                                scheduleLessons.map((lesson, index) => (
                                    <ScheduleCard
                                        key={`regular-${lesson.student.id}-${lesson.date}-${index}`}
                                        lesson={lesson}
                                        onPress={() => router.push(`/(auth)/student/${lesson.student.id}`)}
                                        isLast={index === scheduleLessons.length - 1}
                                        isKommande={activeTab === "kommande"}
                                        onMarkCompleted={handleMarkCompleted}
                                        onReschedule={handleReschedule}
                                        onCancel={handleCancel}
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

            {/* =============== MODALER =============== */}
            <CompleteLessonSheet
                ref={completeSheetRef}
                onClose={() => completeSheetRef.current?.dismiss()}
                onConfirm={handleConfirmComplete}
                isPending={completeMutation.isPending}
            />
            <RescheduleLessonSheet
                ref={rescheduleSheetRef}
                onClose={() => rescheduleSheetRef.current?.dismiss()}
                onConfirm={handleConfirmReschedule}
                isPending={rescheduleMutation.isPending}
            />
            <CancelLessonSheet
                ref={cancelSheetRef}
                onClose={() => cancelSheetRef.current?.dismiss()}
                onConfirm={handleConfirmCancel}
                isPending={cancelMutation.isPending}
            />
        </SafeAreaView>
    );
}

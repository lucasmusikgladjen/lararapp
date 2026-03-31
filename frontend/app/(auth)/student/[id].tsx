import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Komponenter
import { GuardianCard } from "../../../src/components/students/GuardianCard";
import { NoteCard } from "../../../src/components/students/NoteCard";
import { CompleteLessonSheet } from "../../../src/components/lessons/actions/CompleteLessonSheet";
import { RescheduleLessonSheet } from "../../../src/components/lessons/actions/RescheduleLessonSheet";
import { CancelLessonSheet } from "../../../src/components/lessons/actions/CancelLessonSheet";
import { PageHeader } from "../../../src/components/ui/PageHeader";
import { ScheduleCard } from "../../../src/components/dashboard/ScheduleCard";

// Hooks & Typer
import { useUpdateStudent } from "../../../src/hooks/useStudentMutation";
import { useStudents } from "../../../src/hooks/useStudents";
import { Guardian } from "../../../src/types/student.types";
import { useCancelLesson, useCompleteLesson, useRescheduleLesson } from "../../../src/hooks/useLessonMutation";
import { LessonEvent } from "../../../src/utils/lessonHelpers";
import { StudentIDBackground } from "../../../src/components/ui/StudentIDBackground";

type ActiveView = "info" | "lektioner" | "anteckningar" | "mal";

// Konfiguration de färgglada "tags" med HEX-koder
const HUB_TAGS: { id: ActiveView; label: string; activeBackground: string; activeText: string }[] = [
    { id: "info", label: "Info", activeBackground: "#DBEAFE", activeText: "#1E40AF" },
    { id: "lektioner", label: "Lektioner", activeBackground: "#FCE7F3", activeText: "#9D174D" },
    { id: "anteckningar", label: "Anteckningar", activeBackground: "#D1FAE5", activeText: "#065F46" },
    { id: "mal", label: "Mål", activeBackground: "#FFEDD5", activeText: "#9A3412" },
];

export default function StudentProfile() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [activeView, setActiveView] = useState<ActiveView>("info");
    const [savingNotes, setSavingNotes] = useState(false);
    const [savingGoals, setSavingGoals] = useState(false);

    const completeSheetRef = useRef<BottomSheetModal>(null);
    const rescheduleSheetRef = useRef<BottomSheetModal>(null);
    const cancelSheetRef = useRef<BottomSheetModal>(null);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

    const completeMutation = useCompleteLesson({
        studentId: id as string,
        onSuccess: () => {
            completeSheetRef.current?.dismiss();
            setSelectedLessonId(null);
            Alert.alert("Klart!", "Lektionen har markerats som genomförd.");
        },
    });

    const rescheduleMutation = useRescheduleLesson({
        studentId: id as string,
        onSuccess: () => {
            rescheduleSheetRef.current?.dismiss();
            setSelectedLessonId(null);
            Alert.alert("Klart!", "Lektionen har bokats om.");
        },
    });

    const cancelMutation = useCancelLesson({
        studentId: id as string,
        onSuccess: () => {
            cancelSheetRef.current?.dismiss();
            setSelectedLessonId(null);
            Alert.alert("Klart!", "Lektionen har ställts in.");
        },
    });

    const { data: students, isLoading } = useStudents();

    const student = useMemo(() => {
        return students?.find((s) => s.id === id);
    }, [students, id]);

    const updateMutation = useUpdateStudent({
        studentId: id || "",
        onSuccess: () => {
            setSavingNotes(false);
            setSavingGoals(false);
        },
        onError: () => {
            setSavingNotes(false);
            setSavingGoals(false);
            Alert.alert("Fel", "Kunde inte spara. Försök igen.");
        },
    });

    const guardian: Guardian | null = useMemo(() => {
        if (!student) return null;
        return {
            name: student.guardianName || "Namn saknas",
            address: student.address || "",
            city: student.city || "",
            postalCode: "",
            email: student.guardianEmail || "E-post saknas",
            phone: student.guardianPhone || "Telefon saknas",
        };
    }, [student]);

    // Omskriven för att skapa LessonEvents kompatibla med ScheduleCard
    const allLessons: LessonEvent[] = useMemo(() => {
        if (!student) return [];
        const lessons: LessonEvent[] = [];

        student.upcomingLessons?.forEach((date, index) => {
            const realId = student.upcomingLessonIds?.[index];
            const fallbackId = `${student.id}-${date}-${index}`;

            // Beräkna om lektionen är genomförd via lookup
            const isCompleted = student.upcomingLessonCompleted?.[index] ?? false;

            // Beräkna daysLeft
            const todayStr = new Date().toISOString().split("T")[0];
            const diffTime = new Date(date).getTime() - new Date(todayStr).getTime();
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            lessons.push({
                id: realId || fallbackId,
                date,
                time: student.upcomingLessonTimes?.[index] || "Tid saknas",
                daysLeft,
                isCompleted,
                student: student,
            });
        });

        return lessons.sort((a, b) => a.date.localeCompare(b.date));
    }, [student]);

    const today = new Date().toISOString().split("T")[0];

    // Filtrera framtida och försenade/genomförda
    const upcomingLessons = allLessons.filter((l) => l.daysLeft >= 0);
    const pastLessons = allLessons.filter((l) => l.daysLeft < 0).sort((a, b) => b.date.localeCompare(a.date));

    const avatarUrl = student ? `https://api.dicebear.com/7.x/avataaars/png?seed=${student.id}` : "";

    const handleSaveNotes = (notes: string) => {
        setSavingNotes(true);
        updateMutation.mutate({ notes });
    };

    const handleSaveGoals = (goals: string) => {
        setSavingGoals(true);
        updateMutation.mutate({ goals });
    };

    const handleMarkCompleted = (lessonId: string) => {
        setSelectedLessonId(lessonId);
        setTimeout(() => completeSheetRef.current?.present(), 10);
    };

    const handleConfirmComplete = (notes: string, homework: string) => {
        if (!selectedLessonId) return;
        completeMutation.mutate({ lessonId: selectedLessonId, payload: { notes, homework } });
    };

    const handleReschedule = (lessonId: string) => {
        setSelectedLessonId(lessonId);
        setTimeout(() => rescheduleSheetRef.current?.present(), 10);
    };

    const handleConfirmReschedule = (newDate: string, newTime: string, reason: string) => {
        if (!selectedLessonId) return;
        rescheduleMutation.mutate({ lessonId: selectedLessonId, payload: { newDate, newTime, reason } });
    };

    const handleCancel = (lessonId: string) => {
        setSelectedLessonId(lessonId);
        setTimeout(() => cancelSheetRef.current?.present(), 10);
    };

    const handleConfirmCancel = (cancelledBy: "Läraren" | "Vårdnadshavaren", reason: string) => {
        if (!selectedLessonId) return;
        cancelMutation.mutate({ lessonId: selectedLessonId, payload: { cancelledBy, reason } });
    };

    const handleBookLesson = () => {
        router.push({
            pathname: "/(auth)/schedule",
            params: { action: "skapa", studentId: id },
        });
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-brand-bg">
                <ActivityIndicator size="large" color="#F97316" />
            </View>
        );
    }

    if (!student) {
        return (
            <View className="flex-1 items-center justify-center bg-brand-bg">
                <Text className="text-slate-900 text-lg">Elev hittades inte</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-brand-orange px-6 py-3 rounded-full">
                    <Text className="text-white font-semibold">Gå tillbaka</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderUpcomingLesson = ({ item, index }: { item: LessonEvent; index: number }) => (
        <ScheduleCard
            lesson={item}
            isLast={index === upcomingLessons.length - 1}
            isKommande={true}
            onMarkCompleted={handleMarkCompleted}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
        />
    );

    const renderPastLesson = ({ item, index }: { item: LessonEvent; index: number }) => {
        const isDelayed = !item.isCompleted;
        return (
            <ScheduleCard
                lesson={item}
                isLast={index === pastLessons.length - 1}
                isKommande={false}
                isDelayed={isDelayed} // Färgar eventuellt brickan röd
                onMarkCompleted={handleMarkCompleted}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
            />
        );
    };

    return (
        <StudentIDBackground>
            <View className="flex-1" style={{ paddingTop: insets.top }}>
                {/* Header */}
                <View className="px-5">
                    <PageHeader title={student.name} />
                </View>

                {/* Back Button */}
                <View className="px-5 mb-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-row items-center bg-brand-orange rounded-full px-3 py-1.5 self-start shadow-sm"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="arrow-back" size={18} color="white" />
                        <Text className="text-white text-xs font-semibold ml-1">Tillbaka</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* =============== HERO CARD (Avatar + Tags) =============== */}
                    <View className="mx-5 bg-white rounded-3xl p-4 shadow-sm mb-6 flex-row items-center mt-2 border border-slate-100">
                        {/* Vänster: Avatar */}
                        <View className="w-[84px] h-[84px] rounded-full overflow-hidden bg-gray-50 border border-slate-200 mr-4">
                            <Image source={{ uri: avatarUrl }} className="w-full h-full" resizeMode="cover" />
                        </View>

                        {/* Höger: Tags */}
                        <View className="flex-1 flex-row flex-wrap gap-2">
                            {HUB_TAGS.map((tag) => {
                                const isActive = activeView === tag.id;
                                return (
                                    <TouchableOpacity
                                        key={tag.id}
                                        onPress={() => setActiveView(tag.id)}
                                        activeOpacity={0.7}
                                        className="px-3 py-1.5 rounded-md border"
                                        style={{
                                            backgroundColor: isActive ? tag.activeBackground : "#FFFFFF",
                                            borderColor: isActive ? "transparent" : "#E2E8F0",
                                            shadowOpacity: isActive ? 0.05 : 0,
                                            shadowRadius: 2,
                                            shadowOffset: { width: 0, height: 1 },
                                        }}
                                    >
                                        <Text className="text-[13px] font-bold" style={{ color: isActive ? tag.activeText : "#64748B" }}>
                                            {tag.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Separator Line */}
                    <View className="h-1 bg-slate-200 mx-16 mb-6 rounded-full" />

                    {/* ---------- DYNAMIC CONTENT AREA ---------- */}
                    <View className="px-5 flex-1">
                        {/* =============== INFO =============== */}
                        <View style={{ display: activeView === "info" ? "flex" : "none" }}>
                            {guardian ? (
                                <GuardianCard guardian={guardian} />
                            ) : (
                                <View className="bg-white rounded-3xl border border-slate-100 p-8 items-center shadow-sm">
                                    <Text className="text-slate-500">Ingen kontaktinfo tillgänglig.</Text>
                                </View>
                            )}
                        </View>

                        {/* =============== LEKTIONER =============== */}
                        <View style={{ display: activeView === "lektioner" ? "flex" : "none" }}>
                            <Text className="text-[17px] font-bold text-slate-900 mb-3 ml-2">Kommande lektioner</Text>
                            {/* bg-white rounded-3xl border border-slate-100 shadow-sm */}
                            <View className="bg-white border rounded-3xl border-slate-100 shadow-sm mb-6">
                                {upcomingLessons.length > 0 ? (
                                    <FlatList
                                        data={upcomingLessons}
                                        renderItem={renderUpcomingLesson}
                                        keyExtractor={(item) => item.id}
                                        scrollEnabled={false}
                                    />
                                ) : (
                                    <View className="p-8 items-center ">
                                        <Text className="text-slate-500">Inga inplanerade lektioner.</Text>
                                    </View>
                                )}
                            </View>

                            <Text className="text-[17px] font-bold text-slate-900 mb-3 ml-2">Tidigare lektioner</Text>
                            <View className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                                {pastLessons.length > 0 ? (
                                    <FlatList
                                        data={pastLessons}
                                        renderItem={renderPastLesson}
                                        keyExtractor={(item) => item.id}
                                        scrollEnabled={false}
                                    />
                                ) : (
                                    <View className="p-8 items-center">
                                        <Text className="text-slate-500">Historik saknas.</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* =============== ANTECKNINGAR =============== */}
                        <View style={{ display: activeView === "anteckningar" ? "flex" : "none" }}>
                            <NoteCard
                                title="Dina anteckningar"
                                value={student.notes}
                                onSave={handleSaveNotes}
                                isSaving={savingNotes}
                                placeholder="Skriv dina anteckningar om eleven här..."
                            />
                        </View>

                        {/* =============== MÅL =============== */}
                        <View style={{ display: activeView === "mal" ? "flex" : "none" }}>
                            <NoteCard
                                title="Terminsmål"
                                value={student.goals}
                                onSave={handleSaveGoals}
                                isSaving={savingGoals}
                                placeholder="Skriv elevens mål för terminen här..."
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* CTA Button | "Boka lektion" */}
                <View className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-3">
                    <TouchableOpacity
                        onPress={handleBookLesson}
                        className="bg-brand-green rounded-2xl py-4 flex-row items-center justify-center shadow-lg"
                        activeOpacity={0.9}
                    >
                        <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mr-3">
                            <Ionicons name="add" size={20} color="white" />
                        </View>
                        <Text className="text-white font-bold text-lg">Boka lektion</Text>
                    </TouchableOpacity>
                </View>

                {/* =============== MODALS =============== */}
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
            </View>
        </StudentIDBackground>
    );
}

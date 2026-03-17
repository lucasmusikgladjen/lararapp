import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExpandableLessonCard } from "../../../src/components/lessons/ExpandableLessonCard";
import { StaticLessonCard } from "../../../src/components/lessons/StaticLessonCard";
import { GuardianCard } from "../../../src/components/students/GuardianCard";
import { NoteCard } from "../../../src/components/students/NoteCard";
import { TabToggle } from "../../../src/components/ui/TabToggle";
import { useUpdateStudent } from "../../../src/hooks/useStudentMutation";
import { useStudents } from "../../../src/hooks/useStudents";
import { Guardian } from "../../../src/types/student.types";
import { useCancelLesson, useCompleteLesson, useRescheduleLesson } from "../../../src/hooks/useLessonMutation";
import { CompleteLessonSheet } from "../../../src/components/lessons/actions/CompleteLessonSheet";
import { RescheduleLessonSheet } from "../../../src/components/lessons/actions/RescheduleLessonSheet";
import { CancelLessonSheet } from "../../../src/components/lessons/actions/CancelLessonSheet";
import { PageHeader } from "../../../src/components/ui/PageHeader";

type MainTab = "oversikt" | "lektioner";
type LessonTab = "kommande" | "senaste";

interface LessonData {
    id: string;
    date: string;
    time: string;
    studentName: string;
    instrument: string;
}

export default function StudentProfile() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [mainTab, setMainTab] = useState<MainTab>("oversikt");
    const [lessonTab, setLessonTab] = useState<LessonTab>("kommande");
    const [savingNotes, setSavingNotes] = useState(false);
    const [savingGoals, setSavingGoals] = useState(false);

    // --- BOTTOM SHEET REFS & STATES ---
    const completeSheetRef = useRef<BottomSheetModal>(null);
    const rescheduleSheetRef = useRef<BottomSheetModal>(null);
    const cancelSheetRef = useRef<BottomSheetModal>(null);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

    // --- MUTATIONS ---
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

    // Fetch student data from the existing students query
    const { data: students, isLoading } = useStudents();

    // Find the specific student
    const student = useMemo(() => {
        return students?.find((s) => s.id === id);
    }, [students, id]);

    // Update mutation
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

    // Create guardian object from student data
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

    // Parse lessons from student data
    const allLessons: LessonData[] = useMemo(() => {
        if (!student) return [];
        const lessons: LessonData[] = [];

        student.upcomingLessons?.forEach((date, index) => {
            const realId = student.upcomingLessonIds?.[index];
            const fallbackId = `${student.id}-${date}-${index}`;

            lessons.push({
                id: realId || fallbackId,
                date,
                time: student.upcomingLessonTimes?.[index] || "Tid saknas",
                studentName: student.name,
                instrument: student.instrument,
            });
        });

        return lessons.sort((a, b) => a.date.localeCompare(b.date));
    }, [student]);

    // Split lessons into upcoming and past
    const today = new Date().toISOString().split("T")[0];
    const upcomingLessons = allLessons.filter((l) => l.date >= today);
    const pastLessons = allLessons.filter((l) => l.date < today).sort((a, b) => b.date.localeCompare(a.date));

    const nextLesson = upcomingLessons[0];

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

        // Let React state commit before animating the bottom sheet
        setTimeout(() => {
            completeSheetRef.current?.present();
        }, 10);
    };

    // Function that runs when the user clicks "Bekräfta" inside the modal
    const handleConfirmComplete = (notes: string, homework: string) => {
        if (!selectedLessonId) return;
        completeMutation.mutate({
            lessonId: selectedLessonId,
            payload: { notes, homework },
        });
    };

    const handleReschedule = (lessonId: string) => {
        setSelectedLessonId(lessonId);

        setTimeout(() => {
            rescheduleSheetRef.current?.present();
        }, 10);
    };

    // Function that runs when the user clicks "Bekräfta" inside the reschedule modal
    const handleConfirmReschedule = (newDate: string, newTime: string, reason: string) => {
        if (!selectedLessonId) return;
        rescheduleMutation.mutate({
            lessonId: selectedLessonId,
            payload: { newDate, newTime, reason },
        });
    };

    const handleCancel = (lessonId: string) => {
        setSelectedLessonId(lessonId);

        // Timeout to allow state to settle before animating
        setTimeout(() => {
            cancelSheetRef.current?.present();
        }, 10);
    };

    const handleConfirmCancel = (cancelledBy: "Läraren" | "Vårdnadshavaren", reason: string) => {
        if (!selectedLessonId) return;
        cancelMutation.mutate({
            lessonId: selectedLessonId,
            payload: { cancelledBy, reason },
        });
    };

    const handleBookLesson = () => {
        router.push({
            pathname: "/(auth)/schedule",
            params: {
                action: "skapa",
                studentId: id,
            },
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

    const renderUpcomingLesson = ({ item, index }: { item: LessonData; index: number }) => (
        <ExpandableLessonCard
            lesson={item}
            onMarkCompleted={handleMarkCompleted}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
            isLast={index === upcomingLessons.length - 1}
        />
    );

    const renderPastLesson = ({ item, index }: { item: LessonData; index: number }) => (
        <StaticLessonCard lesson={item} isLast={index === pastLessons.length - 1} />
    );

    return (
        <View className="flex-1 bg-brand-bg" style={{ paddingTop: insets.top }}>
            {/* Header */}

            <View className="px-5">
                <PageHeader />
            </View>

            {/* Back Button */}
            <View className="px-5 mb-2">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="flex-row items-center bg-brand-orange rounded-full px-3 py-1.5 self-start"
                    activeOpacity={0.8}
                >
                    <Ionicons name="arrow-back" size={18} color="white" />
                    <Text className="text-white text-xs font-semibold ml-1">Tillbaka</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Student Header */}
                <View className="items-center py-4">
                    <Text className="text-xl font-bold text-slate-900 mb-3">{student.name}</Text>
                    <View className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                        <Image source={{ uri: avatarUrl }} className="w-full h-full" resizeMode="cover" />
                    </View>
                </View>

                {/* Guardian Card */}
                {guardian && (
                    <View className="px-5 mb-4">
                        <GuardianCard guardian={guardian} />
                    </View>
                )}

                {/* Main Tab Toggle */}
                <View className="px-5 mb-4">
                    <TabToggle
                        options={[
                            { value: "oversikt", label: "Översikt" },
                            { value: "lektioner", label: "Lektioner" },
                        ]}
                        activeTab={mainTab}
                        onToggle={setMainTab}
                        variant="pill"
                        activeColor="orange"
                    />
                </View>

                {/* Content based on main tab */}
                {mainTab === "oversikt" ? (
                    <View className="px-5">
                        {/* Kommande Section */}
                        <Text className="text-base font-bold text-slate-900 mb-3">Kommande</Text>

                        {nextLesson ? (
                            // HÄR ÄR ÄNDRINGEN:
                            // Vi använder en container med samma styling som listan för att få "kort-känslan"
                            // och använder ExpandableLessonCard istället för OverviewLessonCard.
                            <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                <ExpandableLessonCard
                                    lesson={nextLesson}
                                    onMarkCompleted={handleMarkCompleted}
                                    onReschedule={handleReschedule}
                                    onCancel={handleCancel}
                                    isLast={true} // Tar bort border-bottom eftersom det är ett ensamt kort
                                />
                            </View>
                        ) : (
                            <View className="bg-white rounded-2xl p-4 items-center">
                                <Text className="text-gray-500">Inga kommande lektioner</Text>
                            </View>
                        )}

                        {/* Separator */}
                        <View className="h-px bg-gray-200 my-6" />

                        {/* Notes Card */}
                        <View className="mb-4">
                            <NoteCard
                                title="Senaste anteckningar"
                                value={student.notes}
                                onSave={handleSaveNotes}
                                isSaving={savingNotes}
                                placeholder="Skriv dina anteckningar om eleven här..."
                            />
                        </View>

                        {/* Goals Card */}
                        <NoteCard
                            title="Terminsmål"
                            value={student.goals}
                            onSave={handleSaveGoals}
                            isSaving={savingGoals}
                            placeholder="Skriv elevens mål för terminen här..."
                        />
                    </View>
                ) : (
                    <View className="flex-1">
                        {/* Lesson Sub-Tab Toggle */}
                        <View className="flex-row items-center justify-between px-5 mb-4">
                            <TabToggle
                                options={[
                                    { value: "kommande", label: "Kommande" },
                                    { value: "senaste", label: "Senaste" },
                                ]}
                                activeTab={lessonTab}
                                onToggle={setLessonTab}
                                variant="underline"
                            />
                            <TouchableOpacity>
                                <Ionicons name="options-outline" size={22} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Lesson List */}
                        <View className="mx-5 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            {lessonTab === "kommande" ? (
                                upcomingLessons.length > 0 ? (
                                    <FlatList
                                        data={upcomingLessons}
                                        renderItem={renderUpcomingLesson}
                                        keyExtractor={(item) => item.id}
                                        scrollEnabled={false}
                                    />
                                ) : (
                                    <View className="p-8 items-center">
                                        <Text className="text-gray-500">Inga kommande lektioner</Text>
                                    </View>
                                )
                            ) : pastLessons.length > 0 ? (
                                <FlatList data={pastLessons} renderItem={renderPastLesson} keyExtractor={(item) => item.id} scrollEnabled={false} />
                            ) : (
                                <View className="p-8 items-center">
                                    <Text className="text-gray-500">Inga tidigare lektioner</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* CTA Button | "Boka lektion" */}
            <View className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-3 bg-brand-bg">
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

            {/* ========== MODALS ========== */}
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
    );
}

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DatePickerField } from "../../../src/components/ui/DatePickerField";
import { PageHeader } from "../../../src/components/ui/PageHeader";
import { SelectField, SelectOption } from "../../../src/components/ui/SelectField";
import { TabOption, TabToggle } from "../../../src/components/ui/TabToggle";
import { TimePickerField } from "../../../src/components/ui/TimePickerField";
import { useAdjustLessons, useCreateLessons, useDeleteFutureLessons } from "../../../src/hooks/useLessonMutation";
import { useStudents } from "../../../src/hooks/useStudents";
import { useAuthStore } from "../../../src/store/authStore";

type ScheduleTab = "justera" | "skapa" | "avsluta";

// --- DATA FÖR VÄLJARE ---
const layoutOptions: SelectOption[] = [
    { label: "Behåll nuvarande upplägg", value: "" },
    { label: "45-60 min", value: "45-60 min" },
    { label: "90 min", value: "90 min" },
    { label: "120 min", value: "120 min" },
];

const weekdayOptions: SelectOption[] = [
    { label: "Måndag", value: "Måndag" },
    { label: "Tisdag", value: "Tisdag" },
    { label: "Onsdag", value: "Onsdag" },
    { label: "Torsdag", value: "Torsdag" },
    { label: "Fredag", value: "Fredag" },
    { label: "Lördag", value: "Lördag" },
    { label: "Söndag", value: "Söndag" },
];

const getNextDateForWeekday = (targetWeekday: string): string => {
    const today = new Date();
    const daysMap: Record<string, number> = {
        Söndag: 0,
        Måndag: 1,
        Tisdag: 2,
        Onsdag: 3,
        Torsdag: 4,
        Fredag: 5,
        Lördag: 6,
    };

    const targetDayIndex = daysMap[targetWeekday];
    let daysUntilTarget = targetDayIndex - today.getDay();

    if (daysUntilTarget <= 0) {
        daysUntilTarget += 7;
    }

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilTarget);
    return nextDate.toISOString().split("T")[0];
};

export default function SchedulePage() {
    const router = useRouter();
    const { data: students = [] } = useStudents();
    const user = useAuthStore((state) => state.user);
    const params = useLocalSearchParams<{ action?: string; studentId?: string }>();

    const studentOptions: SelectOption[] = students.map((student) => ({
        label: student.name,
        value: student.id,
    }));

    // Endast upplägg med faktiska tider (för "Skapa"-fliken)
    const createLayoutOptions = layoutOptions.filter((opt) => opt.value !== "");

    const [activeTab, setActiveTab] = useState<ScheduleTab>("justera");

    // --- State för JUSTERA ---
    const [selectedStudent, setSelectedStudent] = useState("");
    const [selectedLayout, setSelectedLayout] = useState(layoutOptions[0].value); // Sätter "Behåll nuvarande upplägg" direkt
    const [selectedWeekday, setSelectedWeekday] = useState(weekdayOptions[0].value); // Sätter "Måndag" direkt
    const [selectedTime, setSelectedTime] = useState("");

    // --- State för SKAPA ---
    const [createStudent, setCreateStudent] = useState("");
    const [createDate, setCreateDate] = useState("");
    const [createTime, setCreateTime] = useState("");
    const [createLayout, setCreateLayout] = useState(createLayoutOptions[0].value); // Sätter "45-60 min" direkt
    const [repeatTerm, setRepeatTerm] = useState(false);

    // --- State för AVSLUTA ---
    const [deleteStudent, setDeleteStudent] = useState("");
    const [understandDeletion, setUnderstandDeletion] = useState(false);

    // Ladda in rätt flik/elev från navigation params
    useEffect(() => {
        if (params.action === "skapa") {
            setActiveTab("skapa");
        }
    }, [params.action]);

    // AUTO-VÄLJ FÖRSTA ELEVEN NÄR DATAN LADDATS IN
    useEffect(() => {
        if (students.length > 0) {
            // Om listan har laddats och ingen elev är vald ännu, sätt den första eleven i listan som standard.
            // Om en studentId skickades med via navigation (deep-link) prioriteras den för Skapa-fliken.
            setSelectedStudent((prev) => prev || students[0].id);
            setCreateStudent((prev) => prev || params.studentId || students[0].id);
            setDeleteStudent((prev) => prev || students[0].id);
        }
    }, [students, params.studentId]);

    const tabs: TabOption<ScheduleTab>[] = [
        { label: "Justera", value: "justera" },
        { label: "Skapa lektion", value: "skapa" },
        { label: "Avsluta", value: "avsluta" },
    ];

    const { mutate: adjustLessons, isPending } = useAdjustLessons({
        onSuccess: () => {
            Alert.alert("Klart!", "Lektionsschemat har uppdaterats framgångsrikt.");
            router.back();
        },
        onError: () => Alert.alert("Ett fel uppstod", "Kunde inte uppdatera schemat."),
    });

    const handleSaveAdjustments = () => {
        if (!selectedStudent) {
            Alert.alert("Välj elev", "Du måste välja en elev för att justera schemat.");
            return;
        }

        const student = students.find((s) => s.id === selectedStudent);
        if (!student) return;

        const today = new Date().toISOString().split("T")[0];
        const nextDate = selectedWeekday ? getNextDateForWeekday(selectedWeekday) : today;

        adjustLessons({
            studentId: student.id,
            payload: {
                studentName: student.name,
                fromDate: today,
                newStartDate: nextDate,
                timeHHMM: selectedTime || undefined,
                layout: selectedLayout || undefined,
            },
        });
    };

    const { mutate: createLessonMutation, isPending: isCreating } = useCreateLessons({
        onSuccess: () => {
            Alert.alert("Klart!", "Lektionerna har skapats framgångsrikt.");
            router.back();
        },
        onError: () => Alert.alert("Ett fel uppstod", "Kunde inte skapa lektionerna."),
    });

    const handleCreateLessons = () => {
        if (!createStudent || !createDate || !createTime || !createLayout) {
            Alert.alert("Saknad info", "Vänligen fyll i alla fält.");
            return;
        }

        if (!user?.id) return;

        const repeatUntil = repeatTerm ? user.termEnd || "2026-06-10" : undefined;

        createLessonMutation({
            teacherId: user.id,
            studentId: createStudent,
            startDate: createDate,
            timeHHMM: createTime,
            layout: createLayout,
            repeatUntil: repeatUntil,
        });
    };

    const { mutate: deleteLessonsMutation, isPending: isDeleting } = useDeleteFutureLessons({
        onSuccess: () => {
            Alert.alert("Klart!", "De framtida lektionerna har raderats.");
            router.back();
        },
        onError: () => Alert.alert("Ett fel uppstod", "Kunde inte radera lektionerna."),
    });

    const handleDeleteLessons = () => {
        if (!deleteStudent) {
            Alert.alert("Välj elev", "Du måste välja en elev för att avsluta schemat.");
            return;
        }

        const student = students.find((s) => s.id === deleteStudent);
        if (!student) return;

        const today = new Date().toISOString().split("T")[0];

        Alert.alert("Är du helt säker?", `Detta kommer att ta bort alla framtida lektioner för ${student.name}.`, [
            { text: "Avbryt", style: "cancel" },
            {
                text: "Ja, ta bort",
                style: "destructive",
                onPress: () => {
                    deleteLessonsMutation({
                        studentId: student.id,
                        payload: {
                            studentName: student.name,
                            fromDate: today,
                        },
                    });
                },
            },
        ]);
    };

    return (
        <SafeAreaView className="flex-1 bg-brand-bg">
            <View className="px-5 pt-2 flex-1">
                <PageHeader />

                <Text className="text-lg font-bold text-slate-900 mb-4">Hantera lektionsschema</Text>
                <TabToggle
                    options={tabs}
                    activeTab={activeTab}
                    onToggle={setActiveTab}
                    variant="pill"
                    activeColor={activeTab === "avsluta" ? "orange" : "green"}
                />

                <ScrollView className="flex-1 mt-6" showsVerticalScrollIndicator={false}>
                    {/* =============== JUSTERA  =============== */}
                    {activeTab === "justera" && (
                        <View className="pb-10">
                            <Text className="text-slate-500 text-[15px] leading-relaxed mb-6">
                                Här ändrar du elevens stående tid och upplägg. Ändringen appliceras på{" "}
                                <Text className="font-bold text-slate-700">alla framtida lektioner</Text> resten av terminen.
                            </Text>

                            <SelectField
                                label="Elev"
                                placeholder="Välj elev"
                                options={studentOptions}
                                value={selectedStudent}
                                onSelect={setSelectedStudent}
                            />

                            <SelectField
                                label="Upplägg"
                                placeholder="Behåll nuvarande upplägg"
                                options={layoutOptions}
                                value={selectedLayout}
                                onSelect={setSelectedLayout}
                            />

                            <View className="flex-row gap-x-4">
                                <View className="flex-1">
                                    <SelectField
                                        label="Veckodag"
                                        placeholder="Måndag"
                                        options={weekdayOptions}
                                        value={selectedWeekday}
                                        onSelect={setSelectedWeekday}
                                    />
                                </View>
                                <View className="flex-1">
                                    <TimePickerField label="Tid" placeholder="Välj tid" value={selectedTime} onSelect={setSelectedTime} />
                                </View>
                            </View>

                            <View className="flex-row items-center bg-blue-50 border border-blue-100 rounded-xl p-4 mt-2">
                                <View className="bg-blue-500 rounded-full w-8 h-8 items-center justify-center mr-3">
                                    <Ionicons name="information" size={20} color="white" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-blue-800 font-bold text-[14px]">Tips</Text>
                                    <Text className="text-blue-700 text-[13px] leading-tight">
                                        Ändra endast de fält du vill uppdatera.{"\n"}
                                        Resten förblir helt oförändrat.
                                    </Text>
                                </View>
                            </View>

                            <View className="mt-10 gap-y-3">
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={handleSaveAdjustments}
                                    disabled={isPending}
                                    className={`py-4 rounded-xl items-center shadow-sm ${isPending ? "bg-[#86ef92]" : "bg-[#09b806]"}`}
                                >
                                    {isPending ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text className="text-white font-bold text-[17px]">Spara ändringarna</Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => router.back()}
                                    className="bg-[#ef4444] py-4 rounded-xl items-center shadow-sm"
                                >
                                    <Text className="text-white font-bold text-[17px]">Avbryt</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* =============== SKAPA  =============== */}
                    {activeTab === "skapa" && (
                        <View className="pb-10">
                            <SelectField
                                label="Elev"
                                placeholder="Välj elev"
                                options={studentOptions}
                                value={createStudent}
                                onSelect={setCreateStudent}
                            />

                            <View className="flex-row gap-x-4">
                                <View className="flex-1">
                                    <DatePickerField label="Första lektion" placeholder="åååå-mm-dd" value={createDate} onSelect={setCreateDate} />
                                </View>
                                <View className="flex-1">
                                    <TimePickerField label="Tid" placeholder="Välj tid" value={createTime} onSelect={setCreateTime} />
                                </View>
                            </View>

                            <SelectField
                                label="Upplägg"
                                placeholder="Välj upplägg"
                                options={createLayoutOptions}
                                value={createLayout}
                                onSelect={setCreateLayout}
                            />

                            <View className="flex-row bg-blue-50 border border-blue-100 rounded-xl p-4 mt-2 mb-4">
                                <View className="bg-blue-500 rounded-full w-6 h-6 items-center justify-center mr-3 mt-0.5">
                                    <Ionicons name="information" size={16} color="white" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-blue-800 font-bold text-[14px] mb-1">Så fungerar det</Text>
                                    <Text className="text-blue-700 text-[13px] leading-tight">
                                        Som standard lägger vi bara till en lektion på det datum du har valt. Vill du att samma lektionstid ska
                                        fortsätta resten av terminen? Markera då <Text className="font-bold">Upprepa lektion hela terminen</Text> så
                                        skapas en lektion varje vecka fram till nästa terminsslut.
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setRepeatTerm(!repeatTerm)}
                                className="flex-row items-center bg-slate-100 border border-slate-300 rounded-xl p-4"
                            >
                                <View
                                    className={`w-6 h-6 rounded border items-center justify-center mr-3 ${
                                        repeatTerm ? "bg-brand-green border-brand-green" : "border-slate-400 bg-white"
                                    }`}
                                >
                                    {repeatTerm && <Ionicons name="checkmark" size={16} color="white" />}
                                </View>
                                <Text className="text-slate-900 font-semibold text-[15px]">Upprepa lektion hela terminen</Text>
                            </TouchableOpacity>

                            <View className="mt-10 gap-y-3">
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={handleCreateLessons}
                                    disabled={isCreating}
                                    className={`py-4 rounded-xl items-center shadow-sm ${isCreating ? "bg-[#86efac]" : "bg-[#09b806]"}`}
                                >
                                    {isCreating ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text className="text-white font-bold text-[17px]">Spara ändringarna</Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => router.back()}
                                    className="bg-[#ef4444] py-4 rounded-xl items-center shadow-sm"
                                >
                                    <Text className="text-white font-bold text-[17px]">Avbryt</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* =============== AVSLUTA  =============== */}
                    {activeTab === "avsluta" && (
                        <View className="pb-10">
                            <SelectField
                                label="Elev"
                                placeholder="Välj elev"
                                options={studentOptions}
                                value={deleteStudent}
                                onSelect={setDeleteStudent}
                            />

                            <View className="bg-red-50 border border-red-200 rounded-xl p-5 mt-4 mb-6 flex-row items-start">
                                <Ionicons name="warning" size={24} color="#ef4444" className="mr-3 mt-0.5" />
                                <View className="flex-1 ml-3">
                                    <Text className="text-red-700 font-bold text-[15px] mb-1">Detta går inte att ångra.</Text>
                                    <Text className="text-red-700/80 text-[14px] leading-tight">
                                        Alla framtida lektioner för eleven tas bort, även de som är ombokade eller inställda men ännu inte genomförda.
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setUnderstandDeletion(!understandDeletion)}
                                className="flex-row items-center bg-white border border-slate-300 rounded-xl p-4"
                            >
                                <View
                                    className={`w-6 h-6 rounded border items-center justify-center mr-3 ${
                                        understandDeletion ? "bg-slate-800 border-slate-800" : "border-slate-400 bg-white"
                                    }`}
                                >
                                    {understandDeletion && <Ionicons name="checkmark" size={16} color="white" />}
                                </View>
                                <Text className="text-slate-900 font-medium text-[15px] flex-1">Jag förstår att lektionerna tas bort permanent.</Text>
                            </TouchableOpacity>

                            <View className="mt-10 gap-y-3">
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={handleDeleteLessons}
                                    disabled={isDeleting || !understandDeletion}
                                    className={`py-4 rounded-xl items-center shadow-sm ${
                                        !understandDeletion ? "bg-red-300" : isDeleting ? "bg-red-400" : "bg-[#ef4444]"
                                    }`}
                                >
                                    {isDeleting ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text className="text-white font-bold text-[17px]">Ta bort kommande lektioner</Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => router.back()}
                                    className="bg-slate-200 py-4 rounded-xl items-center"
                                >
                                    <Text className="text-slate-600 font-bold text-[17px]">Avbryt</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

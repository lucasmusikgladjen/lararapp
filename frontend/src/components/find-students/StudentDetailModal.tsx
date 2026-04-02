import React, { useMemo, useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert, Keyboard, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetScrollView, BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { StudentPublicDTO } from "../../types/student.types";
import { useRequestToTeach } from "../../hooks/useStudentMutation";
import { DashboardBackground } from "../ui/DashboardBackground";

interface StudentDetailSheetProps {
    student: StudentPublicDTO | null;
    onClose: () => void;
}

export function StudentDetailModal({ student, onClose }: StudentDetailSheetProps) {
    // Uppdaterat till 3 fält
    const [field1, setField1] = useState("");
    const [field2, setField2] = useState("");
    const [field3, setField3] = useState("");

    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["35%", "87%"], []);

    const requestMutation = useRequestToTeach({
        studentId: student?.id || "",
        onSuccess: () => {
            Alert.alert("Ansökan skickad!", "Vi har tagit emot din intresseanmälan.");
            setField1("");
            setField2("");
            setField3("");
            setAgreedToTerms(false);
            onClose();
        },
        onError: (error: any) => {
            const backendMsg = error.response?.data?.error || error.response?.data?.message || "Något gick fel.";
            Alert.alert("Hoppsan!", backendMsg);
        },
    });

    useEffect(() => {
        setField1("");
        setField2("");
        setField3("");
        setAgreedToTerms(false);
        sheetRef.current?.snapToIndex(0);
    }, [student]);

    if (!student) return null;

    const currentYear = new Date().getFullYear();
    const studentAge = student.birthYear ? `${currentYear - Number(student.birthYear)} år` : "Okänd";
    const displayId = student.studentNumber ? student.studentNumber : student.id.slice(-4).toUpperCase();

const handleApply = () => {
        if (!agreedToTerms) return;
        Keyboard.dismiss();

        // Formatera meddelandet med de exakta frågorna som rubriker för tydlighet i Airtable
        const combinedMessage = 
`1. Hur bra passar eleven dig? (Skala 1-10 + motivering):
${field1 || "Inget svar."}

2. Dagar/tider för första lektion närmaste 2 veckorna:
${field2 || "Inget svar."}

3. Övrig info eller frågor:
${field3 || "Inget svar."}`;

        requestMutation.mutate({ message: combinedMessage.trim() });
    };

    const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({ style }) => (
        <View style={[style, styles.sheetBackground, { overflow: "hidden" }]}>
            <DashboardBackground>
                <View />
            </DashboardBackground>
        </View>
    );

    return (
        <BottomSheet
            ref={sheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onClose={onClose}
            backgroundComponent={CustomBackground}
            handleIndicatorStyle={styles.dragHandle}
        >
            <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center justify-end px-5 pt-1 pb-4">
                    <TouchableOpacity onPress={onClose} className="w-8 h-8 bg-white/60 rounded-full items-center justify-center">
                        <MaterialCommunityIcons name="close" size={18} color="#64748B" />
                    </TouchableOpacity>
                </View>

                {/* Om eleven */}
                <View className="px-5 py-4 bg-white rounded-3xl mx-5 shadow-sm border border-gray-100">
                    <Text className="text-[17px] font-bold text-slate-900 mb-1">Elev #{displayId}</Text>
                    <Text className="text-[15px] text-slate-700 leading-6 mb-5">
                        Den här eleven söker en engagerad lärare i {student.instruments.join(", ").toLowerCase()} för att ta nästa steg i sin
                        musikaliska utveckling.
                    </Text>

                    <View className="flex-row items-center">
                        <View className="flex-1">
                            <Text className="text-[16px] font-bold text-slate-900">Instrument</Text>
                            <Text className="text-[15px] text-slate-700 mt-0.5">{student.instruments.join(", ")}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-[16px] font-bold text-slate-900">Ålder</Text>
                            <Text className="text-[15px] text-slate-700 mt-0.5">{studentAge}</Text>
                        </View>
                    </View>
                </View>

                {/* Din ansökan */}
                <View className="px-5 py-6 mt-2">
                    <Text className="text-[17px] font-bold text-slate-900 mb-4">Din ansökan</Text>

                    {/* Fråga 1 - Fixed: No uppercase, increased text size for professional look */}
                    <Text className="text-[14px] font-semibold text-slate-700 mb-2 ml-1">
                        Hur bra passar den här eleven dig? {"\n"}Skala 1-10 och motivera
                    </Text>
                    <TextInput
                        className={`rounded-2xl p-4 text-[15px] mb-5 border shadow-sm ${student.hasApplied ? "bg-white/50 border-slate-200" : "bg-white border-white"}`}
                        placeholder="Skriv din motivering här..."
                        placeholderTextColor="#9CA3AF"
                        value={field1}
                        onChangeText={setField1}
                        editable={!student.hasApplied && !requestMutation.isPending}
                    />

                    {/* Fråga 2 - Fixed: No uppercase, direct style */}
                    <Text className="text-[14px] font-semibold text-slate-700 mb-2 ml-1">
                        Vilka dagar och tider hade du kunnat ha en {"\n"}första lektion de närmaste två veckorna?
                    </Text>
                    <TextInput
                        className={`rounded-2xl p-4 text-[15px] mb-5 border shadow-sm ${student.hasApplied ? "bg-white/50 border-slate-200" : "bg-white border-white"}`}
                        placeholder="Föreslå dagar och tider..."
                        placeholderTextColor="#9CA3AF"
                        value={field2}
                        onChangeText={setField2}
                        editable={!student.hasApplied && !requestMutation.isPending}
                    />

                    {/* Fråga 3 - Fixed: No uppercase */}
                    <Text className="text-[14px] font-semibold text-slate-700 mb-2 ml-1">Övrig info eller frågor?</Text>
                    <TextInput
                        className={`rounded-2xl p-4 text-[15px] border shadow-sm ${student.hasApplied ? "bg-white/50 border-slate-200" : "bg-white border-white"}`}
                        placeholder="Skriv dina frågor här..."
                        placeholderTextColor="#9CA3AF"
                        value={field3}
                        onChangeText={setField3}
                        editable={!student.hasApplied && !requestMutation.isPending}
                        multiline={true}
                        textAlignVertical="top" // Professional multiline look
                    />
                </View>

                {/* Vad händer sen? - Uppdaterad */}
                <View className="px-5 mb-6">
                    <Text className="text-[17px] font-bold text-slate-900 mb-4">Vad händer sen?</Text>

                    <View className="flex-row items-start mb-4 pr-6">
                        <View className="w-7 h-7 rounded-full bg-brand-orange items-center justify-center mr-3 mt-0.5 shadow-sm">
                            <Text className="text-white font-bold text-sm">1</Text>
                        </View>
                        <Text className="text-[15px] text-slate-800 leading-tight flex-1">
                            Vi kontaktar vårdnadshavaren och föreslår dig som lärare.
                        </Text>
                    </View>

                    <View className="flex-row items-start pr-6">
                        <View className="w-7 h-7 rounded-full bg-brand-orange items-center justify-center mr-3 mt-0.5 shadow-sm">
                            <Text className="text-white font-bold text-sm">2</Text>
                        </View>
                        <Text className="text-[15px] text-slate-800 leading-tight flex-1">
                            Om de vill börja sätter vi er i kontakt med varandra - håll koll på din mail.
                        </Text>
                    </View>
                </View>

                {/* Checkbox & Submit */}
                <View className="px-5 pt-2">
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => !student.hasApplied && setAgreedToTerms(!agreedToTerms)}
                        disabled={student.hasApplied}
                        className="flex-row items-center mb-5"
                    >
                        <View
                            className={`w-6 h-6 rounded-md border items-center justify-center mr-3 ${student.hasApplied ? "bg-white/50 border-slate-300" : agreedToTerms ? "bg-brand-orange border-brand-orange shadow-sm" : "bg-white border-slate-300 shadow-sm"}`}
                        >
                            {(agreedToTerms || student.hasApplied) && <Ionicons name="checkmark" size={16} color="white" />}
                        </View>
                        <Text className={`text-[15px] flex-1 leading-tight font-medium ${student.hasApplied ? "text-slate-500" : "text-slate-800"}`}>
                            Jag bekräftar att jag vill bli matchad med den här eleven.
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleApply}
                        disabled={requestMutation.isPending || student.hasApplied || !agreedToTerms}
                        className="rounded-2xl py-4 flex-row justify-center items-center shadow-sm"
                        style={{
                            backgroundColor:
                                student.hasApplied || (!agreedToTerms && !requestMutation.isPending)
                                    ? "#CBD5E1"
                                    : requestMutation.isPending
                                      ? "#FDBA74"
                                      : "#F97316",
                        }}
                    >
                        <Text className="text-white font-bold text-[17px]">
                            {student.hasApplied ? "ANSÖKAN SKICKAD" : requestMutation.isPending ? "SKICKAR..." : "Önska"}
                        </Text>
                        {!student.hasApplied && !requestMutation.isPending && (
                            <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
                        )}
                    </TouchableOpacity>
                </View>
            </BottomSheetScrollView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    sheetBackground: {
        backgroundColor: "white",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    dragHandle: {
        backgroundColor: "#CBD5E1",
        width: 40,
        height: 5,
        borderRadius: 10,
        marginTop: 10,
    },
});

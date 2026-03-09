import React, { useMemo, useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Image, Alert, Keyboard, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StudentPublicDTO } from "../../types/student.types";
import { useRequestToTeach } from "../../hooks/useStudentMutation";

interface StudentDetailSheetProps {
    student: StudentPublicDTO | null;
    onClose: () => void;
}

const INSTRUMENT_ICONS: Record<string, string> = {
    piano: "piano",
    gitarr: "guitar-acoustic",
    fiol: "violin",
    trummor: "drum",
    sång: "microphone",
};

function getInstrumentIcon(instrument: string): string {
    return INSTRUMENT_ICONS[instrument.toLowerCase()] ?? "musical-notes";
}

export function StudentDetailModal({ student, onClose }: StudentDetailSheetProps) {
    const [greeting, setGreeting] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const sheetRef = useRef<BottomSheet>(null);

    // GOOGLE MAPS BEHAVIOR:
    // 25% = "Peek" (See name + rating + small info)
    // 90% = "Full" (See reviews, photos, etc.)
    const snapPoints = useMemo(() => ["25%", "90%"], []);

    const requestMutation = useRequestToTeach({
        studentId: student?.id || "",
        onSuccess: () => {
            Alert.alert("Ansökan skickad!", "Vi hör av oss så snart som möjligt.");
            setGreeting(""); // Clear input on success
            onClose(); // Close the modal
        },
        onError: (error: any) => {
            // Safely extract the backend error message if it exists (e.g. "You have already sent a request for this student")
            const backendMsg = error.response?.data?.error || error.response?.data?.message || "Något gick fel. Försök igen.";

            Alert.alert("Hoppsan!", backendMsg);
        },
    });

    useEffect(() => {
        setGreeting("");
        // When a new student is selected, snap to the "Peek" position (index 0)
        // or "Full" (index 1) depending on preference. Google Maps usually peeks first.
        sheetRef.current?.snapToIndex(0);
    }, [student]);

    if (!student) return null;

    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${student.id}`;
    const primaryInstrument = student.instruments[0] ?? "Instrument";

    const handleApply = () => {
        Keyboard.dismiss();
        requestMutation.mutate({ message: greeting.trim() });
    };

    return (
        <BottomSheet
            ref={sheetRef}
            index={0} // Start at 25% (Peek)
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onClose={onClose}
            backgroundStyle={styles.sheetBackground}
            handleIndicatorStyle={styles.dragHandle}
        >
            <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                {/* Header / Close (Visible in Peek) */}
                <View className="flex-row items-center justify-between px-5 pt-1 pb-2">
                    <View className="w-8" />
                    <Text className="text-lg font-bold text-slate-900">Elevprofil</Text>
                    <TouchableOpacity onPress={onClose} className="w-8 h-8 bg-slate-50 rounded-full items-center justify-center">
                        <MaterialCommunityIcons name={getInstrumentIcon(primaryInstrument) as any} size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* Hero Section (Visible in Peek) */}
                <View className="items-center px-5 py-2">
                    <View className="relative">
                        <Image source={{ uri: avatarUrl }} className="w-20 h-20 rounded-full bg-slate-100" />
                        <View className="absolute -right-1 top-0 w-8 h-8 rounded-full items-center justify-center bg-orange-500 border-2 border-white">
                            <MaterialCommunityIcons name={getInstrumentIcon(primaryInstrument) as any} size={16} color="#FFFFFF" />
                        </View>
                    </View>
                    <Text className="text-2xl font-bold text-slate-900 mt-2">{student.name}</Text>
                    <Text className="text-gray-500 text-sm font-medium">{student.instruments.join(", ")}</Text>
                </View>

                {/* Everything below here is revealed when swiping up to 90% */}
                <View className="px-5 py-4 mt-2">
                    <Text className="text-lg font-bold text-slate-900 mb-2">Om eleven</Text>
                    <Text className="text-base text-gray-600 leading-6">
                        {student.name} söker en lärare i {student.instruments.join(", ").toLowerCase()}. Eleven vill utvecklas och söker en pedagogisk
                        lärare.
                    </Text>
                </View>

                <View className="h-[1px] bg-gray-100 mx-5 my-2" />

                <View className="px-5 py-4">
                    <Text className="text-lg font-bold text-slate-900 mb-3">Skicka ansökan</Text>
                    <View
                        className={`rounded-2xl p-4 border ${student.hasApplied ? "bg-slate-100 border-slate-200" : "bg-green-50 border-green-100"}`}
                    >
                        <TextInput
                            className={`rounded-xl p-3 text-base min-h-[100px] border ${
                                student.hasApplied ? "bg-slate-50 text-slate-500 border-slate-200" : "bg-white text-slate-900 border-gray-200"
                            }`}
                            placeholder={
                                student.hasApplied ? "Du har redan skickat en ansökan till den här eleven." : "Hej! Jag hjälper dig gärna..."
                            }
                            placeholderTextColor="#9CA3AF"
                            multiline
                            textAlignVertical="top"
                            value={greeting}
                            onChangeText={setGreeting}
                            editable={!student.hasApplied && !requestMutation.isPending}
                        />
                    </View>
                </View>

                <View className="px-5 pt-2">
                    <TouchableOpacity
                        onPress={handleApply}
                        disabled={requestMutation.isPending || student.hasApplied} // Disable button if applied!
                        className="rounded-full py-4 items-center shadow-sm"
                        style={{
                            // Grey if applied, light green if loading, bright green if ready
                            backgroundColor: student.hasApplied ? "#94A3B8" : requestMutation.isPending ? "#86efac" : "#22c55e",
                            opacity: requestMutation.isPending || student.hasApplied ? 0.7 : 1,
                        }}
                    >
                        <Text className="text-white font-bold text-lg">
                            {student.hasApplied ? "ANSÖKAN SKICKAD" : requestMutation.isPending ? "SKICKAR..." : "SKICKA ANSÖKAN"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </BottomSheetScrollView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    sheetBackground: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    dragHandle: {
        backgroundColor: "#E2E8F0",
        width: 40,
        height: 5,
        borderRadius: 10,
        marginTop: 8,
    },
});

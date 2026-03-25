import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

interface CancelLessonSheetProps {
    onClose: () => void;
    onConfirm: (cancelledBy: "Läraren" | "Vårdnadshavaren", reason: string) => void;
    isPending: boolean;
}

export const CancelLessonSheet = forwardRef<BottomSheetModal, CancelLessonSheetProps>(({ onClose, onConfirm, isPending }, ref) => {
    // Vårdnadshavare som default
    const [cancelledBy, setCancelledBy] = useState<"Läraren" | "Vårdnadshavaren">("Vårdnadshavaren");
    const [reason, setReason] = useState("");

    const snapPoints = useMemo(() => ["60%"], []);

    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />,
        [],
    );

    const handleConfirm = () => {
        if (!reason) return;
        onConfirm(cancelledBy, reason);
        setTimeout(() => {
            setReason("");
            setCancelledBy("Vårdnadshavaren");
        }, 500);
    };

    const isFormValid = reason.trim() !== "";

    return (
        <BottomSheetModal
            ref={ref}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            onDismiss={onClose}
            handleIndicatorStyle={{ backgroundColor: "#CBD5E1" }}
        >
            <BottomSheetView className="flex-1 px-5 pt-2 pb-8 bg-white">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-xl font-bold text-slate-900">Ställ in lektion</Text>
                    <TouchableOpacity onPress={onClose} className="p-1">
                        <Ionicons name="close" size={24} color="#64748B" />
                    </TouchableOpacity>
                </View>

                {/* Segmented Control for 'Vem ställer in?' */}
                <Text className="text-[14px] font-bold text-slate-900 mb-2 ml-1">Vem ställer in?</Text>
                <View className="flex-row bg-slate-100 rounded-xl p-1 mb-6">
                    {/* 1. VÅRDNADSHAVAREN LIGGER NU FÖRST (VÄNSTER) */}
                    <TouchableOpacity
                        onPress={() => setCancelledBy("Vårdnadshavaren")}
                        className="flex-1 py-2.5 rounded-lg items-center"
                        style={
                            cancelledBy === "Vårdnadshavaren"
                                ? {
                                      backgroundColor: "white",
                                      shadowColor: "#000",
                                      shadowOffset: { width: 0, height: 1 },
                                      shadowOpacity: 0.05,
                                      shadowRadius: 2,
                                      elevation: 1,
                                  }
                                : {}
                        }
                        activeOpacity={0.8}
                    >
                        <Text className="font-semibold" style={{ color: cancelledBy === "Vårdnadshavaren" ? "#0f172a" : "#64748b" }}>
                            Vårdnadshavaren
                        </Text>
                    </TouchableOpacity>

                    {/* 2. LÄRAREN LIGGER NU SOM ANDRA VAL (HÖGER) */}
                    <TouchableOpacity
                        onPress={() => setCancelledBy("Läraren")}
                        className="flex-1 py-2.5 rounded-lg items-center"
                        style={
                            cancelledBy === "Läraren"
                                ? {
                                      backgroundColor: "white",
                                      shadowColor: "#000",
                                      shadowOffset: { width: 0, height: 1 },
                                      shadowOpacity: 0.05,
                                      shadowRadius: 2,
                                      elevation: 1,
                                  }
                                : {}
                        }
                        activeOpacity={0.8}
                    >
                        <Text className="font-semibold" style={{ color: cancelledBy === "Läraren" ? "#0f172a" : "#64748b" }}>
                            Läraren
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Reason Input */}
                <Text className="text-[14px] font-bold text-slate-900 mb-2 ml-1">Anledning för inställning</Text>
                <BottomSheetTextInput
                    className="bg-white border border-slate-300 rounded-xl p-4 text-[15px] text-slate-900 mb-8 min-h-[100px]"
                    placeholder="Skriv en kort anledning..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    textAlignVertical="top"
                    value={reason}
                    onChangeText={setReason}
                />

                {/* Buttons */}
                <TouchableOpacity
                    onPress={handleConfirm}
                    disabled={isPending || !isFormValid}
                    className="py-4 rounded-xl items-center shadow-sm mb-3 flex-row justify-center"
                    style={{ backgroundColor: isPending ? "#f87171" : isFormValid ? "#ef4444" : "#cbd5e1" }}
                    activeOpacity={0.8}
                >
                    <Text className="text-white font-bold text-[17px] ml-2">{isPending ? "Sparar..." : "Bekräfta inställning"}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onClose} className="bg-slate-200 py-4 rounded-xl items-center" activeOpacity={0.7}>
                    <Text className="text-slate-600 font-bold text-[17px]">Avbryt</Text>
                </TouchableOpacity>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

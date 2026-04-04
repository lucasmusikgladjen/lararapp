import { forwardRef, useCallback, useMemo, useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

interface CompleteLessonSheetProps {
    onClose: () => void;
    onConfirm: (notes: string, homework: string) => void;
    isPending: boolean;
    initialNotes?: string;
    initialHomework?: string;
}

export const CompleteLessonSheet = forwardRef<BottomSheetModal, CompleteLessonSheetProps>(
    ({ onClose, onConfirm, isPending, initialNotes, initialHomework }, ref) => {
        const [notes, setNotes] = useState("");
        const [homework, setHomework] = useState("");
        const snapPoints = useMemo(() => ["65%"], []);

        // Fyll i existerande data när modalen öppnas
        useEffect(() => {
            setNotes(initialNotes || "");
            setHomework(initialHomework || "");
        }, [initialNotes, initialHomework]);

        const renderBackdrop = useCallback(
            (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />,
            [],
        );

        const handleConfirm = () => {
            onConfirm(notes, homework);
        };

        const isEditing = !!(initialNotes || initialHomework);

        return (
            <BottomSheetModal
                ref={ref}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                onDismiss={onClose}
                handleIndicatorStyle={{ backgroundColor: "#CBD5E1" }}
            >
                <BottomSheetView className="flex-1 px-5 pt-2 pb-8 bg-white">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold text-slate-900">{isEditing ? "Redigera anteckningar" : "Markera som genomförd"}</Text>
                        <TouchableOpacity onPress={onClose} className="p-1">
                            <Ionicons name="close" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-[14px] font-bold text-slate-900 mb-2 ml-1">Vad gjorde ni på lektionen?</Text>
                    <BottomSheetTextInput
                        className="bg-white border border-slate-300 rounded-xl p-4 text-[15px] text-slate-900 mb-5 min-h-[100px]"
                        placeholder="Övade på ackordföljder..."
                        placeholderTextColor="#94A3B8"
                        multiline
                        textAlignVertical="top"
                        value={notes}
                        onChangeText={setNotes}
                    />

                    <Text className="text-[14px] font-bold text-slate-900 mb-2 ml-1">Läxa för nästa gång:</Text>
                    <BottomSheetTextInput
                        className="bg-white border border-slate-300 rounded-xl p-4 text-[15px] text-slate-900 mb-8 min-h-[80px]"
                        placeholder="Öva på refrängen i 15 min..."
                        placeholderTextColor="#94A3B8"
                        multiline
                        textAlignVertical="top"
                        value={homework}
                        onChangeText={setHomework}
                    />

                    <TouchableOpacity
                        onPress={handleConfirm}
                        disabled={isPending}
                        className={`py-4 rounded-xl items-center shadow-sm mb-3 flex-row justify-center ${isPending ? "bg-green-400" : "bg-[#22c55e]"}`}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold text-[17px] ml-2">
                            {isPending ? "Sparar..." : isEditing ? "Spara ändringar" : "Bekräfta genomförd"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} className="items-center py-4 rounded-xl shadow-sm mb-3 flex-row justify-center bg-red-400">
                        <Text className="text-white font-bold text-[17px] ">Avbryt</Text>
                    </TouchableOpacity>
                </BottomSheetView>
            </BottomSheetModal>
        );
    },
);

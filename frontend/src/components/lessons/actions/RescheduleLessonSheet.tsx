import { forwardRef, useCallback, useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { DatePickerField } from "../../ui/DatePickerField";
import { TimePickerField } from "../../ui/TimePickerField"; 

interface RescheduleLessonSheetProps {
    onClose: () => void;
    onConfirm: (newDate: string, newTime: string, reason: string) => void;
    isPending: boolean;
}

export const RescheduleLessonSheet = forwardRef<BottomSheetModal, RescheduleLessonSheetProps>(({ onClose, onConfirm, isPending }, ref) => {
    // Local state for the inputs
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");
    const [reason, setReason] = useState("");

    // Snap to 75% to give room for the keyboard and pickers
    const snapPoints = useMemo(() => ["75%"], []);

    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />,
        [],
    );

    const handleConfirm = () => {
        if (!newDate || !reason) return;
        onConfirm(newDate, newTime, reason);

        // Optional: reset fields after confirming
        setTimeout(() => {
            setNewDate("");
            setNewTime("");
            setReason("");
        }, 500);
    };

    // Validation to enable/disable the button
    const isFormValid = newDate.trim() !== "" && reason.trim() !== "";

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
                    <Text className="text-xl font-bold text-slate-900">Boka om lektion</Text>
                    <TouchableOpacity onPress={onClose} className="p-1">
                        <Ionicons name="close" size={24} color="#64748B" />
                    </TouchableOpacity>
                </View>

                {/* Date Picker (Reused) */}
                <DatePickerField label="Nytt datum" placeholder="Välj datum" value={newDate} onSelect={setNewDate} />

                {/* Time Picker (Reused) */}
                <TimePickerField label="Ny tid (valfritt)" placeholder="Välj tid" value={newTime} onSelect={setNewTime} />

                {/* Reason Input */}
                <Text className="text-[14px] font-bold text-slate-900 mb-2 ml-1 mt-2">Anledning för ombokning</Text>
                <BottomSheetTextInput
                    className="bg-white border border-slate-300 rounded-xl p-4 text-[15px] text-slate-900 mb-6 min-h-[100px]"
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
                    className={`py-4 rounded-xl items-center shadow-sm mb-3 flex-row justify-center ${
                        isPending ? "bg-blue-400" : isFormValid ? "bg-blue-500" : "bg-slate-300"
                    }`}
                    activeOpacity={0.8}
                >
                    <Text className="text-white font-bold text-[17px] ml-2">{isPending ? "Sparar..." : "Bekräfta ombokning"}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onClose}
                    className="items-center py-4 rounded-xl shadow-sm mb-3 flex-row justify-center bg-red-400"
                    activeOpacity={0.7}
                >
                    <Text className="text-white font-bold text-[17px] ">Avbryt</Text>
                </TouchableOpacity>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

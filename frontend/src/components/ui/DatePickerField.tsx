import { useState } from "react";
import { View, Text, TouchableOpacity, Platform, Modal, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

interface DatePickerFieldProps {
    label: string;
    placeholder: string;
    value: string; // Värdet är en sträng "YYYY-MM-DD"
    onSelect: (value: string) => void;
}

export const DatePickerField = ({ label, placeholder, value, onSelect }: DatePickerFieldProps) => {
    const [showPicker, setShowPicker] = useState(false);

    // Hjälpfunktion för att få ut rätt datum-objekt (antingen valt värde eller IDAG)
    const getInitialDate = () => {
        return value ? new Date(value) : new Date();
    };

    // Temp-state för iOS så vi kan bekräfta med "Klar"-knappen
    const [tempDate, setTempDate] = useState(getInitialDate());

    const handleOpen = () => {
        setTempDate(getInitialDate());
        setShowPicker(true);
    };

    const handleConfirm = () => {
        // Körs när användaren trycker "Klar" på iOS
        // Vi formaterar tempDate till YYYY-MM-DD
        const year = tempDate.getFullYear();
        const month = String(tempDate.getMonth() + 1).padStart(2, "0");
        const day = String(tempDate.getDate()).padStart(2, "0");

        onSelect(`${year}-${month}-${day}`);
        setShowPicker(false);
    };

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === "android") {
            setShowPicker(false);
            if (selectedDate && event.type !== "dismissed") {
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                const day = String(selectedDate.getDate()).padStart(2, "0");
                onSelect(`${year}-${month}-${day}`);
            }
        } else {
            // På iOS uppdaterar vi bara tempDate medan användaren klickar runt.
            // onSelect anropas först när de trycker på "Klar".
            if (selectedDate) {
                setTempDate(selectedDate);
            }
        }
    };

    return (
        <View className="mb-4">
            <Text className="text-[15px] font-bold text-slate-900 mb-1.5 ml-1">{label}</Text>

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleOpen}
                className="flex-row items-center justify-between bg-white border border-slate-300 px-4 py-3.5 rounded-xl"
            >
                <Text className={`text-[16px] ${value ? "text-slate-900" : "text-slate-500"}`}>{value || placeholder}</Text>
                <Ionicons name="calendar-outline" size={20} color="#64748b" />
            </TouchableOpacity>

            {Platform.OS === "ios" ? (
                <Modal visible={showPicker} transparent animationType="slide">
                    <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
                        <View className="flex-1 justify-end">
                            <TouchableWithoutFeedback>
                                <View className="bg-white rounded-t-3xl pb-10 shadow-lg shadow-black/20 border-t border-slate-100">
                                    <View className="flex-row justify-between items-center p-4 border-b border-slate-100">
                                        <Text className="text-lg font-bold text-slate-900 ml-2">Välj {label.toLowerCase()}</Text>
                                        {/* Ändrade från () => setShowPicker(false) till handleConfirm */}
                                        <TouchableOpacity onPress={handleConfirm} className="bg-brand-green px-4 py-2 rounded-full">
                                            <Text className="text-white font-bold">Klar</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View className="py-4 px-4 justify-center items-center">
                                        <DateTimePicker
                                            value={tempDate}
                                            mode="date"
                                            display="inline"
                                            onChange={onChange}
                                            locale="sv-SE"
                                            themeVariant="light"
                                            textColor="#0f172a"
                                        />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            ) : (
                showPicker && (
                    <DateTimePicker value={getInitialDate()} mode="date" display="inline" onChange={onChange} locale="sv-SE" themeVariant="light" />
                )
            )}
        </View>
    );
};

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, Modal, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

interface TimePickerFieldProps {
    label: string;
    placeholder: string;
    value: string; // Värdet är en sträng i formatet "HH:mm"
    onSelect: (value: string) => void;
}

export const TimePickerField = ({ label, placeholder, value, onSelect }: TimePickerFieldProps) => {
    const [showPicker, setShowPicker] = useState(false);

    const dateValue = new Date();
    if (value) {
        const [hours, minutes] = value.split(":");
        dateValue.setHours(parseInt(hours, 10));
        dateValue.setMinutes(parseInt(minutes, 10));
    } else {
        dateValue.setHours(15, 0, 0, 0);
    }

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === "android") {
            setShowPicker(false);
        }

        if (selectedDate && event.type !== "dismissed") {
            const hours = selectedDate.getHours().toString().padStart(2, "0");
            const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
            onSelect(`${hours}:${minutes}`);
        }
    };

    return (
        <View className="mb-4">
            <Text className="text-[15px] font-bold text-slate-900 mb-1.5 ml-1">{label}</Text>

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowPicker(true)}
                className="flex-row items-center justify-between bg-white border border-slate-300 px-4 py-3.5 rounded-xl"
            >
                <Text className={`text-[16px] ${value ? "text-slate-900" : "text-slate-500"}`}>{value || placeholder}</Text>
                <Ionicons name="time-outline" size={20} color="#64748b" />
            </TouchableOpacity>

            {Platform.OS === "ios" ? (
                <Modal visible={showPicker} transparent animationType="slide">
                    <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
                        {/* Tog bort bg-black/40 här för att behålla skärmen ljus */}
                        <View className="flex-1 justify-end">
                            <TouchableWithoutFeedback>
                                {/* Lade till shadow-lg för att separera den från bakgrunden istället */}
                                <View className="bg-white rounded-t-3xl pb-10 shadow-lg shadow-black/20 border-t border-slate-100">
                                    <View className="flex-row justify-between items-center p-4 border-b border-slate-100">
                                        <Text className="text-lg font-bold text-slate-900 ml-2">Välj {label.toLowerCase()}</Text>
                                        <TouchableOpacity onPress={() => setShowPicker(false)} className="bg-brand-green px-4 py-2 rounded-full">
                                            <Text className="text-white font-bold">Klar</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View className="py-4 justify-center items-center">
                                        <DateTimePicker
                                            value={dateValue}
                                            mode="time"
                                            display="spinner"
                                            minuteInterval={5}
                                            onChange={onChange}
                                            locale="sv-SE"
                                            textColor="#0f172a"
                                            themeVariant="light"
                                        />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            ) : (
                showPicker && (
                    <DateTimePicker value={dateValue} mode="time" display="spinner" is24Hour={true} minuteInterval={5} onChange={onChange} />
                )
            )}
        </View>
    );
};

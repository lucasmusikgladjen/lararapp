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

    // Beräknar datumet som hjulet ska visa när det öppnas
    const getInitialDate = () => {
        const d = new Date();
        if (value) {
            const [hours, minutes] = value.split(":");
            d.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        } else {
            // Om inget är valt: Använd nuvarande tid, men avrunda till närmaste 5 minuter
            // så att det matchar ditt minuteInterval={5} perfekt.
            const minutes = d.getMinutes();
            const roundedMinutes = Math.round(minutes / 5) * 5;
            d.setMinutes(roundedMinutes, 0, 0);
        }
        return d;
    };

    // Vi behöver ett temp-state för iOS. Om användaren öppnar hjulet och 
    // direkt trycker "Klar" utan att snurra, måste vi veta vad vi ska spara.
    const [tempDate, setTempDate] = useState(getInitialDate());

    const handleOpen = () => {
        setTempDate(getInitialDate());
        setShowPicker(true);
    };

    const handleConfirm = () => {
        // Körs när användaren trycker "Klar" på iOS
        const hours = tempDate.getHours().toString().padStart(2, "0");
        const minutes = tempDate.getMinutes().toString().padStart(2, "0");
        onSelect(`${hours}:${minutes}`);
        setShowPicker(false);
    };

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === "android") {
            setShowPicker(false);
            if (selectedDate && event.type !== "dismissed") {
                const hours = selectedDate.getHours().toString().padStart(2, "0");
                const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
                onSelect(`${hours}:${minutes}`);
            }
        } else {
            // På iOS uppdaterar vi bara tempDate medan hjulet snurrar.
            // onSelect anropas först när de klickar på "Klar".
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
                <Ionicons name="time-outline" size={20} color="#64748b" />
            </TouchableOpacity>

            {Platform.OS === "ios" ? (
                <Modal visible={showPicker} transparent animationType="slide">
                    <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
                        <View className="flex-1 justify-end">
                            <TouchableWithoutFeedback>
                                <View className="bg-white rounded-t-3xl pb-10 shadow-lg shadow-black/20 border-t border-slate-100">
                                    <View className="flex-row justify-between items-center p-4 border-b border-slate-100">
                                        <Text className="text-lg font-bold text-slate-900 ml-2">Välj {label.toLowerCase()}</Text>
                                        <TouchableOpacity onPress={handleConfirm} className="bg-brand-green px-4 py-2 rounded-full">
                                            <Text className="text-white font-bold">Klar</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View className="py-4 justify-center items-center">
                                        <DateTimePicker
                                            value={tempDate}
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
                    <DateTimePicker 
                        value={getInitialDate()} 
                        mode="time" 
                        display="spinner" 
                        is24Hour={true} 
                        minuteInterval={5} 
                        onChange={onChange} 
                    />
                )
            )}
        </View>
    );
};
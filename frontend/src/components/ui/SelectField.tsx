import React, { useState } from "react";
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface SelectOption {
    label: string;
    value: string;
}

interface SelectFieldProps {
    label: string;
    placeholder: string;
    value: string;
    options: SelectOption[];
    onSelect: (value: string) => void;
}

export const SelectField = ({ label, placeholder, value, options, onSelect }: SelectFieldProps) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <View className="mb-4">
            <Text className="text-[15px] font-bold text-slate-900 mb-1.5 ml-1">{label}</Text>

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleExpand}
                className={`flex-row items-center justify-between bg-white border border-slate-300 px-4 py-3.5 ${
                    expanded ? "rounded-t-xl border-b-0" : "rounded-xl"
                }`}
            >
                {/* Visar alltid valt alternativ om det finns, annars placeholder */}
                <Text className={`text-[16px] ${selectedOption ? "text-slate-900" : "text-slate-500"}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#64748b" />
            </TouchableOpacity>

            {expanded && (
                <View className="bg-slate-50 border border-slate-300 border-t-0 rounded-b-xl overflow-hidden justify-center">
                    <Picker
                        selectedValue={value}
                        onValueChange={(itemValue) => {
                            onSelect(itemValue);
                        }}
                        itemStyle={{ height: 140, fontSize: 18, color: "#0f172a" }}
                    >
                        {/* Vi tog bort -- Välj -- raden här. Nu visas BARA riktiga val! */}
                        {options.map((item) => (
                            <Picker.Item key={item.value} label={item.label} value={item.value} />
                        ))}
                    </Picker>
                </View>
            )}
        </View>
    );
};
import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface FilterChipProps {
    label: string;
    selected: boolean;
    onPress: () => void;
}

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={`px-4 py-2 rounded-full mr-2 ${
                selected ? "bg-[#8B5CF6]" : "bg-white"
            }`}
            style={
                selected
                    ? undefined
                    : {
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.05,
                          shadowRadius: 2,
                          elevation: 1,
                      }
            }
        >
            <Text
                className={`text-sm font-semibold ${
                    selected ? "text-white" : "text-slate-900"
                }`}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

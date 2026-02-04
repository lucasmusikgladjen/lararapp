import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export type ToggleOption = "kommande" | "senaste";

interface SchemaToggleProps {
    activeTab: ToggleOption;
    onToggle: (tab: ToggleOption) => void;
}

export const SchemaToggle = ({ activeTab, onToggle }: SchemaToggleProps) => {
    return (
        <View className="flex-row bg-gray-200 rounded-full p-1 mb-4">
            <TouchableOpacity
                onPress={() => onToggle("kommande")}
                className={`flex-1 py-2.5 rounded-full items-center ${activeTab === "kommande" ? "bg-brand-green" : ""}`}
                activeOpacity={0.8}
            >
                <Text className={`font-semibold text-sm ${activeTab === "kommande" ? "text-white" : "text-gray-500"}`}>Kommande</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => onToggle("senaste")}
                className={`flex-1 py-2.5 rounded-full items-center ${activeTab === "senaste" ? "bg-brand-green" : ""}`}
                activeOpacity={0.8}
            >
                <Text className={`font-semibold text-sm ${activeTab === "senaste" ? "text-white" : "text-gray-500"}`}>Senaste</Text>
            </TouchableOpacity>
        </View>
    );
};

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export interface TabOption<T extends string> {
    value: T;
    label: string;
}

interface TabToggleProps<T extends string> {
    options: [TabOption<T>, TabOption<T>];
    activeTab: T;
    onToggle: (tab: T) => void;
    variant?: "pill" | "underline";
    activeColor?: "green" | "orange";
}

export function TabToggle<T extends string>({
    options,
    activeTab,
    onToggle,
    variant = "pill",
    activeColor = "green",
}: TabToggleProps<T>) {
    const activeBgClass = activeColor === "green" ? "bg-brand-green" : "bg-brand-orange";

    if (variant === "underline") {
        return (
            <View className="flex-row">
                {options.map((option) => {
                    const isActive = activeTab === option.value;
                    return (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => onToggle(option.value)}
                            className={`mr-6 pb-2 ${isActive ? "border-b-2 border-slate-900" : ""}`}
                            activeOpacity={0.7}
                        >
                            <Text
                                className={`text-sm font-semibold ${
                                    isActive ? "text-slate-900" : "text-gray-400"
                                }`}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }

    return (
        <View className="flex-row bg-gray-200 rounded-full p-1">
            {options.map((option) => {
                const isActive = activeTab === option.value;
                return (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => onToggle(option.value)}
                        className={`flex-1 py-2.5 rounded-full items-center ${
                            isActive ? activeBgClass : ""
                        }`}
                        activeOpacity={0.8}
                    >
                        <Text
                            className={`font-semibold text-sm ${
                                isActive ? "text-white" : "text-gray-500"
                            }`}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

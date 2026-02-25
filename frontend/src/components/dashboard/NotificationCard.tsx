import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface NotificationData {
    id: string;
    title: string;
    message: string;
    type: "alert" | "success" | "info";
    icon: keyof typeof Ionicons.glyphMap;
}

interface Props {
    item: NotificationData;
    onPress?: () => void;
}

export const NotificationCard = ({ item, onPress }: Props) => {
    const colors = {
        alert: "bg-[#EA4335]",
        success: "bg-[#58CC02]",
        info: "bg-[#4B96F8]",
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            className={`${colors[item.type]} rounded-[24px] p-5 flex-row items-center h-full w-full`}
        >
            <View className="mr-4">
                <Ionicons name={item.icon} size={32} color="white" />
            </View>
            <View className="flex-1">
                <Text className="text-white font-extrabold text-lg leading-tight mb-1">{item.title}</Text>
                <Text className="text-white font-medium text-sm" numberOfLines={1}>
                    {item.message}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
    );
};

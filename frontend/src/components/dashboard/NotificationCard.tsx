import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NotificationDTO } from "../../types/notification.types";

interface NotificationCardProps {
    item: NotificationDTO;
    onPress?: () => void;
}

export const NotificationCard = ({ item, onPress }: NotificationCardProps) => {
    // Välj ikon baserat på severity (critical, warning, info)
    const getIcon = (): keyof typeof Ionicons.glyphMap => {
        switch (item.card.severity) {
            case "critical":
                return "megaphone-outline";
            case "warning":
                return "document-text-outline";
            case "info":
            default:
                return "information-circle-outline";
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            className="rounded-[24px] p-5 flex-row items-center h-full w-full border-[1.5px] border-white/30 shadow-sm"
            style={{ backgroundColor: item.card.color || "#4B96F8" }}
        >
            <View className="mr-4">
                <Ionicons name={getIcon()} size={32} color="white" />
            </View>
            <View className="flex-1">
                <Text className="text-white font-extrabold text-lg leading-tight mb-1">{item.card.title}</Text>
                <Text className="text-white font-medium text-sm" numberOfLines={1}>
                    {item.card.description}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
    );
};

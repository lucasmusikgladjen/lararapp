import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PageHeaderProps {
    title: string;
}

export const PageHeader = ({ title }: PageHeaderProps) => {
    return (
        <View className="flex-row items-center justify-between py-3 mb-1">
            {/* Vinyl Record Logo */}
            <View className="w-10 h-10 rounded-full bg-black items-center justify-center overflow-hidden">
                <View className="w-7 h-7 rounded-full border border-orange-400/50 items-center justify-center">
                    <View className="w-4 h-4 rounded-full border border-orange-400/40 items-center justify-center">
                        <View className="w-2 h-2 rounded-full bg-orange-400" />
                    </View>
                </View>
            </View>

            <Text className="text-xl font-bold text-slate-900">{title}</Text>

            {/* Notification Bell */}
            <View className="w-10 h-10 items-center justify-center">
                <Ionicons name="notifications-outline" size={24} color="#1E293B" />
            </View>
        </View>
    );
};

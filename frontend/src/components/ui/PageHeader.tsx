import React from "react";
import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PageHeaderProps {
    title: string;
}

export const PageHeader = ({ title }: PageHeaderProps) => {
    return (
        <View className="flex-row items-center justify-between py-3 mb-2">
            {/* Vinyl Record Logo */}
            <Image source={require("../../../assets/vinyl.png")} className="w-10 h-10 rounded-full" resizeMode="contain" />

            <Text className="text-xl font-bold text-slate-900">{title}</Text>

            {/* Notification Bell */}
            <View className="w-10 h-10 items-center justify-center">
                <Ionicons name="help-circle" size={34} color="#1E293B" />
            </View>
        </View>
    );
};

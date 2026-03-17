import React from "react";
import { View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const PageHeader = () => {
    return (
        <View className="flex-row items-center justify-between py-3 mb-2">
            {/* Vinyl Record Logo */}
            <Image source={require("../../../assets/vinyl.png")} className="w-10 h-10 rounded-full" resizeMode="contain" />

            {/* Help Question Icon */}
            <View className="w-10 h-10 items-center justify-center">
                <Ionicons name="help-circle" size={34} color="#1E293B" />
            </View>
        </View>
    );
};

import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../../src/store/authStore"; 

export default function Settings() {
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = async () => {
        await logout();
        router.replace("/(public)/login");
    };

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-2xl font-bold">Inställningar</Text>
            <Text className="text-gray-500 mt-2 mb-5">App-inställningar</Text>

            <TouchableOpacity onPress={handleLogout} className="bg-red-100 py-3 px-6 rounded-xl items-center">
                <Text className="text-red-600 font-bold">Logga ut</Text>
            </TouchableOpacity>
        </View>
    );
}

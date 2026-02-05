import React from "react";
import { View, Text } from "react-native";
import { Guardian } from "../../types/student.types";

interface GuardianCardProps {
    guardian: Guardian;
}

export const GuardianCard = ({ guardian }: GuardianCardProps) => {
    const formattedAddress = guardian.address
        ? `${guardian.address}, ${guardian.city}`
        : guardian.city || "Adress saknas";

    return (
        <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <Text className="text-base font-bold text-slate-900 mb-3">
                Vårdnadshavare
            </Text>

            <View className="space-y-1.5">
                <View className="flex-row">
                    <Text className="text-sm text-gray-500 w-16">Namn:</Text>
                    <Text className="text-sm text-slate-800 flex-1">
                        {guardian.name || "Namn saknas"}
                    </Text>
                </View>

                <View className="flex-row">
                    <Text className="text-sm text-gray-500 w-16">Adress:</Text>
                    <Text className="text-sm text-slate-800 flex-1">
                        {formattedAddress}
                    </Text>
                </View>

                <View className="flex-row">
                    <Text className="text-sm text-gray-500 w-16">E-post:</Text>
                    <Text className="text-sm text-slate-800 flex-1">
                        {guardian.email || "E-post saknas"}
                    </Text>
                </View>

                <View className="flex-row">
                    <Text className="text-sm text-gray-500 w-16">Telefon:</Text>
                    <Text className="text-sm text-slate-800 flex-1">
                        {guardian.phone || "Telefon saknas"}
                    </Text>
                </View>
            </View>
        </View>
    );
};

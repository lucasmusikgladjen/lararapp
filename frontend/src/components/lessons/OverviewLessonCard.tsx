// ELEVPROFIL --> 'ÖVERSIKT' BUTTON 

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OverviewLessonCardProps {
    date: string;
    time: string;
    studentName: string;
    instrument: string;
    onPress?: () => void;
}

export const OverviewLessonCard = ({
    date,
    time,
    studentName,
    instrument,
    onPress,
}: OverviewLessonCardProps) => {
    const formatDate = (dateString: string): { day: string; month: string } => {
        const dateObj = new Date(dateString);
        const day = dateObj.getDate().toString();
        const monthNames = [
            "Januari", "Februari", "Mars", "April", "Maj", "Juni",
            "Juli", "Augusti", "September", "Oktober", "November", "December"
        ];
        const month = monthNames[dateObj.getMonth()];
        return { day, month };
    };

    const { day, month } = formatDate(date);

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row items-center"
            activeOpacity={0.7}
        >
            {/* Date Column */}
            <View className="items-center mr-4">
                <Text className="text-3xl font-bold text-brand-orange">
                    {day}
                </Text>
                <Text className="text-sm text-gray-500">{month}</Text>
            </View>

            {/* Divider */}
            <View className="w-px h-14 bg-gray-200 mr-4" />

            {/* Info */}
            <View className="flex-1">
                <Text className="text-base font-semibold text-slate-900">
                    {studentName}
                </Text>
                <Text className="text-sm font-semibold text-brand-orange">
                    {time}
                </Text>
                <Text className="text-sm text-gray-500">{instrument}</Text>
            </View>

            {/* Chevron */}
            <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
        </TouchableOpacity>
    );
};

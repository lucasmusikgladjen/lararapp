import React from "react";
import { View, Text } from "react-native";

interface LessonData {
    id: string;
    date: string;
    time: string;
    studentName: string;
    instrument: string;
}

interface StaticLessonCardProps {
    lesson: LessonData;
    isLast?: boolean;
}

export const StaticLessonCard = ({ lesson, isLast = false }: StaticLessonCardProps) => {
    const formatDate = (dateString: string): { day: string; month: string } => {
        const date = new Date(dateString);
        const day = date.getDate().toString();
        const monthNames = [
            "Januari", "Februari", "Mars", "April", "Maj", "Juni",
            "Juli", "Augusti", "September", "Oktober", "November", "December"
        ];
        const month = monthNames[date.getMonth()];
        return { day, month };
    };

    const { day, month } = formatDate(lesson.date);

    return (
        <View
            className={`bg-white flex-row items-center py-4 px-5 ${
                !isLast ? "border-b border-gray-100" : ""
            }`}
        >
            {/* Date Column */}
            <View className="w-16 items-center">
                <Text className="text-2xl font-bold text-brand-orange">
                    {day}
                </Text>
                <Text className="text-xs text-gray-500">{month}</Text>
            </View>

            {/* Divider Line */}
            <View className="w-px h-12 bg-gray-200 mx-3" />

            {/* Lesson Info */}
            <View className="flex-1">
                <Text className="text-base font-semibold text-slate-900">
                    {lesson.studentName}
                </Text>
                <Text className="text-sm font-semibold text-brand-orange">
                    {lesson.time}
                </Text>
                <Text className="text-sm text-gray-500">{lesson.instrument}</Text>
            </View>
        </View>
    );
};

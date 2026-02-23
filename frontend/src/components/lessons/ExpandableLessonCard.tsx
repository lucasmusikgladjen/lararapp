import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface LessonData {
    id: string;
    date: string;
    time: string;
    studentName: string;
    instrument: string;
}

interface ExpandableLessonCardProps {
    lesson: LessonData;
    onMarkCompleted?: (lessonId: string) => void;
    onReschedule?: (lessonId: string) => void;
    onCancel?: (lessonId: string) => void;
    isLast?: boolean;
}

export const ExpandableLessonCard = ({ lesson, onMarkCompleted, onReschedule, onCancel, isLast = false }: ExpandableLessonCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const rotation = useSharedValue(0);

    const formatDate = (dateString: string): { day: string; month: string } => {
        const date = new Date(dateString);
        const day = date.getDate().toString();
        const monthNames = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];
        const month = monthNames[date.getMonth()];
        return { day, month };
    };

    const { day, month } = formatDate(lesson.date);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        rotation.value = withTiming(isExpanded ? 0 : 180, { duration: 200 });
    };

    const arrowStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
        <View className={`bg-white ${!isLast ? "border-b border-gray-100" : ""}`}>
            <TouchableOpacity onPress={toggleExpand} className="flex-row items-center py-4 px-5" activeOpacity={0.7}>
                {/* Date Column */}
                <View className="w-16 items-center">
                    <Text className="text-3xl font-bold text-brand-orange">{day}</Text>
                    <Text className="text-xs text-gray-600">{month}</Text>
                </View>

                {/* Divider Line */}
                <View className="w-px h-12 bg-gray-200 mx-3" />

                {/* Lesson Info */}
                <View className="flex-1">
                    <Text className="text-base font-semibold text-slate-900">{lesson.studentName}</Text>
                    <Text className="text-sm font-semibold text-brand-orange">{lesson.time}</Text>
                    <Text className="text-sm text-gray-600">{lesson.instrument}</Text>
                </View>

                {/* Chevron */}
                <Animated.View style={arrowStyle}>
                    <Ionicons name="chevron-down" size={24} color="#9CA3AF" />
                </Animated.View>
            </TouchableOpacity>

            {/* Expanded Actions */}
            {isExpanded && (
                <View className="flex-row px-5 pb-4 pt-1 justify-start gap-3">
                    {/* 1. Genomförd (Green) */}
                    <TouchableOpacity
                        onPress={() => onMarkCompleted?.(lesson.id)}
                        className="flex-1 bg-green-600 rounded-xl py-4 items-center justify-center shadow-sm"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="checkmark-circle-outline" size={32} color="white" />
                        <Text className="text-white font-bold text-xs mt-1">Genomförd</Text>
                    </TouchableOpacity>

                    {/* 2. Boka om (Blue) */}
                    <TouchableOpacity
                        onPress={() => onReschedule?.(lesson.id)}
                        className="flex-1 bg-blue-500 rounded-xl py-4 items-center justify-center shadow-sm"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="calendar-outline" size={32} color="white" />
                        <Text className="text-white font-bold text-xs mt-1">Boka om</Text>
                    </TouchableOpacity>

                    {/* 3. Ställ in (Red) */}
                    <TouchableOpacity
                        onPress={() => onCancel?.(lesson.id)}
                        className="flex-1 bg-red-500 rounded-xl py-4 items-center justify-center shadow-sm"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="close-circle-outline" size={32} color="white" />
                        <Text className="text-white font-bold text-xs mt-1">Ställ in</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

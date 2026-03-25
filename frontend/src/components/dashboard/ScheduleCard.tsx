import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LessonEvent } from "../../utils/lessonHelpers";

interface ScheduleCardProps {
    lesson: LessonEvent;
    onPress?: () => void; // <-- 1. Gjorde onPress valfri (?)
    isLast: boolean;
    isKommande: boolean;
    isDelayed?: boolean;
    onMarkCompleted?: (lessonId: string, studentId: string) => void;
    onReschedule?: (lessonId: string, studentId: string) => void;
    onCancel?: (lessonId: string, studentId: string) => void;
}

export const ScheduleCard = ({
    lesson,
    onPress,
    isLast,
    isKommande,
    isDelayed = false,
    onMarkCompleted,
    onReschedule,
    onCancel,
}: ScheduleCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { student, date, time } = lesson;

    const lessonId = (lesson as any).id || `${student.id}-${date}`;

    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${student.id}`;

    const dateObj = new Date(date);
    const weekday = dateObj.toLocaleDateString("sv-SE", { weekday: "long" });
    const day = dateObj.getDate();
    const month = dateObj.toLocaleDateString("sv-SE", { month: "short" }).replace(".", "");
    const capitalWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    const capitalMonth = month.charAt(0).toUpperCase() + month.slice(1);
    const formattedDate = `${capitalWeekday} ${day} ${capitalMonth} -  ${time}`;

    const today = new Date();
    const isToday = dateObj.getFullYear() === today.getFullYear() && dateObj.getMonth() === today.getMonth() && dateObj.getDate() === today.getDate();

    // En hjälpvariabel: Kan kortet fällas ut med åtgärder?
    const isExpandable = isKommande || isDelayed;

    // En hjälpvariabel: Ska kortet överhuvudtaget reagera på klick?
    const isInteractive = isExpandable || !!onPress;

    const handleCardPress = () => {
        if (isExpandable) {
            setIsExpanded(!isExpanded);
        } else if (onPress) {
            onPress();
        }
    };

    return (
        <View className={`py-4 px-5 ${!isLast ? "border-b border-gray-100" : ""}`}>
            <TouchableOpacity
                onPress={handleCardPress}
                className="flex-row items-center"
                activeOpacity={isInteractive ? 0.7 : 1} // Ingen klick-effekt om ointeraktiv
                disabled={!isInteractive} // Stäng av klickandet helt
            >
                <Image source={{ uri: avatarUrl }} className="w-14 h-14 rounded-full bg-gray-100 mr-4" />

                <View className="flex-1">
                    <Text className="text-base font-bold text-slate-900">{student.name}</Text>
                    <Text className="text-sm font-semibold text-gray-500">{formattedDate}</Text>
                    <Text className="text-sm font-semibold text-brand-orange">{student.instrument}</Text>
                </View>

                {/* HÖGER SIDA LOGIK */}
                {isDelayed ? (
                    <View className="bg-red-500 px-4 py-1.5 rounded-full ml-2">
                        <Text className="text-white font-bold text-xs tracking-wide">Försenad</Text>
                    </View>
                ) : isKommande && isToday ? (
                    <View className="bg-yellow-400 px-4 py-1.5 rounded-full ml-2">
                        <Text className="text-slate-900 font-bold text-xs tracking-wide">Rapportera</Text>
                    </View>
                ) : isInteractive ? (
                    /* 2. Visar bara pil om kortet faktiskt gör något */
                    <Ionicons name={isExpanded ? "chevron-down" : "chevron-forward"} size={20} color="#D1D5DB" />
                ) : null}
            </TouchableOpacity>

            {/* EXPANDERAD RAPPORT TOGGLE */}
            {isExpanded && isExpandable && (
                <View className="flex-row gap-x-2 mt-4 pt-4 border-t border-gray-100">
                    <TouchableOpacity
                        className="flex-[2] bg-brand-green rounded-xl items-center justify-center py-4 shadow-sm"
                        activeOpacity={0.8}
                        onPress={() => onMarkCompleted && onMarkCompleted(lessonId, student.id)}
                    >
                        <Ionicons name="checkmark-circle-outline" size={32} color="white" />
                        <Text className="text-white font-bold text-sm mt-1">genomförd</Text>
                    </TouchableOpacity>

                    <View className="flex-1 gap-y-2">
                        <TouchableOpacity
                            className="flex-1 bg-slate-200 rounded-lg items-center justify-center py-2 shadow-sm"
                            activeOpacity={0.8}
                            onPress={() => onReschedule && onReschedule(lessonId, student.id)}
                        >
                            <Text className="text-slate-600 font-bold text-xs">boka om</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 bg-slate-200 rounded-lg items-center justify-center py-2 shadow-sm"
                            activeOpacity={0.8}
                            onPress={() => onCancel && onCancel(lessonId, student.id)}
                        >
                            <Text className="text-slate-600 font-bold text-xs">inställd</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

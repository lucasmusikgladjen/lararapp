import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LessonEvent } from "../../utils/lessonHelpers";

interface ScheduleCardProps {
    lesson: LessonEvent;
    onPress?: () => void;
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

    const formattedDateTime = `${capitalWeekday} ${day} ${capitalMonth} • ${time}`;

    const today = new Date();
    const isToday = dateObj.getFullYear() === today.getFullYear() && dateObj.getMonth() === today.getMonth() && dateObj.getDate() === today.getDate();

    const isExpandable = isKommande || isDelayed;
    const isInteractive = isExpandable || !!onPress;

    const handleCardPress = () => {
        if (isExpandable) {
            setIsExpanded(!isExpanded);
        } else if (onPress) {
            onPress();
        }
    };

    return (
        <View className={`py-5 px-5 ${!isLast ? "border-b border-slate-200" : ""}`}>
            <TouchableOpacity
                onPress={handleCardPress}
                className="flex-row items-center"
                activeOpacity={isInteractive ? 0.7 : 1}
                disabled={!isInteractive}
            >
                <View className="w-14 h-14 rounded-full bg-slate-100 mr-4 border border-slate-200 overflow-hidden shrink-0">
                    <Image source={{ uri: avatarUrl }} className="w-full h-full" />
                </View>

                <View className="flex-1 justify-center gap-y-0.5">
                    {/* RAD 1: Namn + Badge/Pil */}
                    <View className="flex-row justify-between items-center w-full">
                        {/* Namnet flexar så långt det kan, men bryts snyggt om det krockar */}
                        <Text className="text-base font-bold text-slate-800">{student.name}</Text>

                        {/* HÖGER SIDA LOGIK (Badges / Pilar) - Ligger nu PÅ SAMMA RAD som namnet */}
                        {isDelayed ? (
                            <View className="bg-[#E35453] px-2.5 py-1 rounded-md shadow-sm shrink-0">
                                <Text className="text-white font-extrabold text-[10px] tracking-wider uppercase">Försenad</Text>
                            </View>
                        ) : isKommande && isToday ? (
                            <View className="bg-[#FBBF24] px-2.5 py-1 rounded-md shadow-sm shrink-0">
                                <Text className="text-slate-900 font-extrabold text-[10px] tracking-wider uppercase">Rapportera</Text>
                            </View>
                        ) : isInteractive ? (
                            <Ionicons name={isExpanded ? "chevron-down" : "chevron-forward"} size={20} color="#CBD5E1" className="shrink-0" />
                        ) : null}
                    </View>

                    {/* RAD 2: Datum & Tid */}
                    <Text className="text-[13px] font-semibold text-slate-500 leading-tight">{formattedDateTime}</Text>

                    {/* RAD 3: Instrument */}
                    <Text className="text-[13px] font-bold text-brand-orange leading-tight">{student.instrument}</Text>
                </View>
            </TouchableOpacity>

            {/* EXPANDERAD RAPPORT TOGGLE (MODERN DESIGN) */}
            {isExpanded && isExpandable && (
                <View className="flex-row gap-x-3 mt-5 pt-5 border-t border-slate-100">
                    <TouchableOpacity
                        className="flex-[1.3] bg-[#006e28] rounded-[24px] items-center justify-center py-5 shadow-sm"
                        activeOpacity={0.8}
                        onPress={() => onMarkCompleted && onMarkCompleted(lessonId, student.id)}
                    >
                        <View className="w-[52px] h-[52px] rounded-full bg-white/20 items-center justify-center mb-3">
                            <View className="w-9 h-9 rounded-full bg-white items-center justify-center">
                                <Ionicons name="checkmark" size={24} color="#006e28" />
                            </View>
                        </View>
                        <Text className="text-white font-bold text-[14px] tracking-widest uppercase">genomförd</Text>
                    </TouchableOpacity>

                    <View className="flex-1 gap-y-2">
                        <TouchableOpacity
                            className="flex-1 bg-[#F1F5F9] rounded-2xl flex-row items-center justify-center gap-x-2 border border-slate-200"
                            activeOpacity={0.7}
                            onPress={() => onReschedule && onReschedule(lessonId, student.id)}
                        >
                            <Ionicons name="calendar-outline" size={16} color="#475569" />
                            <Text className="text-slate-600 font-bold text-[12px] uppercase tracking-wider">boka om</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 bg-[#F1F5F9] rounded-2xl flex-row items-center justify-center gap-x-2 border border-slate-200"
                            activeOpacity={0.7}
                            onPress={() => onCancel && onCancel(lessonId, student.id)}
                        >
                            <Ionicons name="close-circle-outline" size={16} color="#475569" />
                            <Text className="text-slate-600 font-bold text-[12px] uppercase tracking-wider">inställd</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

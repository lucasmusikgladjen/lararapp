import React from "react";
import { Image, Text, View } from "react-native";
import { LessonEvent } from "../../utils/lessonHelpers";

interface Props {
    lesson: LessonEvent;
}

export const NextLessonCard = ({ lesson }: Props) => {
    const { student, date, time, daysLeft } = lesson;
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${student.id}`;

    // Formatera datum: "Januari 23"
    const dateObj = new Date(date);
    const month = dateObj.toLocaleDateString("sv-SE", { month: "short" }).replace(".", "");
    const day = dateObj.getDate();
    const formattedMonthDay = month.charAt(0).toUpperCase() + month.slice(1) + " " + day;

    // Formatera veckodag: "Fredag"
    const weekday = dateObj.toLocaleDateString("sv-SE", { weekday: "long" });
    const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

    // Beräkna sluttid (antar 1 timmes lektion)
    let timeRange = time;
    if (time !== "Tid saknas") {
        const [h, m] = time.split(":").map(Number);
        const endTime = `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        timeRange = `${time}-${endTime}`;
        // timeRange = `${time}`;
    }

    const formattedDate = `${capitalizedWeekday}, ${formattedMonthDay}`;

    // Badge-text baserat på dagar kvar
    const getBadgeText = (): string => {
        if (daysLeft === 0) return "IDAG";
        if (daysLeft === 1) return "IMORGON";
        return `${daysLeft} DAGAR`;
    };

    return (
        <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <View className="flex-row items-center">
                {/* Avatar */}
                <Image source={{ uri: avatarUrl }} className="w-16 h-16 rounded-full bg-gray-100 mr-4" />

                {/* Lektionsinformation */}
                <View className="flex-1">
                    <Text className="text-base font-bold text-slate-900">{student.name}</Text>
                    {/* <Text className="text-lg font-bold text-slate-900">{formattedMonthDay}</Text> */}
                    <Text className="text-sm font-semibold text-gray-500">{formattedDate}</Text>
                    <Text className="text-sm font-semibold text-gray-500">{timeRange}</Text>
                    <Text className="text-sm font-semibold  text-brand-orange">{student.instrument}</Text>
                </View>

                {/* IDAG / IMORGON badge */}
                <View className="bg-brand-green px-3 py-1.5 rounded-full">
                    <Text className="text-white text-xs font-bold">{getBadgeText()}</Text>
                </View>
            </View>
        </View>
    );
};

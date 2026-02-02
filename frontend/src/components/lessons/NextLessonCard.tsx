import React from "react";
import { Image, Text, View } from "react-native";
import { LessonEvent } from "../../utils/lessonHelpers";


interface Props {
    lesson: LessonEvent;
}

export const NextLessonCard = ({ lesson }: Props) => {
    const { student, date, time, daysLeft } = lesson;
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${student.id}`;

    // Formatera datum snyggt (t.ex. "Fredag, 23 Jan")
    const dateObj = new Date(date);
    const dateString = dateObj.toLocaleDateString("sv-SE", {
        weekday: "long",
        day: "numeric",
        month: "short",
    });

    return (
        <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6">
            <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-bold text-slate-800">Nästa lektion</Text>

                {/* Badge: IDAG eller Dagar kvar */}
                <View className={`${daysLeft === 0 ? "bg-indigo-600" : "bg-slate-200"} px-3 py-1 rounded-full`}>
                    <Text className={`${daysLeft === 0 ? "text-white" : "text-slate-600"} text-xs font-bold uppercase`}>
                        {daysLeft === 0 ? "Idag" : `${daysLeft} dagar kvar`}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center mt-2">
                <Image source={{ uri: avatarUrl }} className="w-16 h-16 rounded-full bg-slate-50 mr-4" />

                <View>
                    <Text className="text-xl font-bold text-slate-900 capitalize">{dateString}</Text>
                    <Text className="text-slate-500 text-base mb-1">
                        {/* Vi har ingen tid i backend än, så vi hårdkodar 15:00 tills vidare */}
                        kl. {time}
                    </Text>
                    <Text className="text-indigo-600 font-bold">
                        {student.name} • {student.instrument}
                    </Text>
                </View>
            </View>
        </View>
    );
};

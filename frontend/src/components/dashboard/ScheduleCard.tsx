import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LessonEvent } from "../../utils/lessonHelpers";

interface ScheduleCardProps {
  lesson: LessonEvent;
  onPress: () => void;
  isLast: boolean;
}

export const ScheduleCard = ({ lesson, onPress, isLast }: ScheduleCardProps) => {
  const { student, date, time } = lesson;
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${student.id}`;

  // Formatera datum: "Fredag 23 Jan - 15:00"
  const dateObj = new Date(date);
  const weekday = dateObj.toLocaleDateString("sv-SE", { weekday: "long" });
  const day = dateObj.getDate();
  const month = dateObj
    .toLocaleDateString("sv-SE", { month: "short" })
    .replace(".", "");

  const capitalWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const capitalMonth = month.charAt(0).toUpperCase() + month.slice(1);

  const formattedDate = `${capitalWeekday} ${day} ${capitalMonth} -  ${time}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center py-4 px-5 ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <Image
        source={{ uri: avatarUrl }}
        className="w-14 h-14 rounded-full bg-gray-100 mr-4"
      />

      {/* Info */}
      <View className="flex-1">
        <Text className="text-base font-bold text-slate-900">
          {student.name}
        </Text>
        <Text className="text-sm text-gray-400">{formattedDate}</Text>
        <Text className="text-sm font-semibold text-brand-orange">
          {student.instrument}
        </Text>
      </View>

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
    </TouchableOpacity>
  );
};

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ReportBannerProps {
  onPress: () => void;
}

export const ReportBanner = ({ onPress }: ReportBannerProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-brand-orange rounded-2xl px-5 py-4 flex-row items-center mb-6"
      activeOpacity={0.85}
    >
      {/* Megaphone Icon */}
      <View className="mr-4" style={{ transform: [{ rotate: "-15deg" }] }}>
        <Ionicons name="megaphone" size={28} color="white" />
      </View>

      {/* Text Content */}
      <View className="flex-1">
        <Text className="text-white font-bold text-base">
          Glöm inte att rapportera!
        </Text>
        <Text className="text-white/70 text-sm">
          Rapportera dina lektioner här
        </Text>
      </View>

      {/* Chevron Arrow */}
      <View
        className="w-8 h-8 rounded-full items-center justify-center"
        style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
      >
        <Ionicons name="chevron-forward" size={18} color="white" />
      </View>
    </TouchableOpacity>
  );
};

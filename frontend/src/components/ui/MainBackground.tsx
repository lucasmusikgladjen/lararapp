import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export const MainBackground = ({ children }: { children: React.ReactNode }) => {
    return (
        <View className="flex-1 bg-white">
            {/* 1. Base light mint/green background */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "#F0FFF4" }]} />

            {/* 2. THE WAVE/RIVER LAYER */}
            <View style={StyleSheet.absoluteFill}>
                <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                    {/* Darker Green River/Wave */}
                    <Path
                        d={`M0 ${height * 0.2} Q${width * 0.5} ${height * 0.1} ${width} ${height * 0.3} V${height} H0 Z`}
                        fill="#D1FAE5" // Emerald 100
                        opacity="0.6"
                    />

                    {/* Lighter Green River/Wave overlay */}
                    <Path
                        d={`M0 ${height * 0.4} Q${width * 0.6} ${height * 0.5} ${width} ${height * 0.35} V${height} H0 Z`}
                        fill="#ECFDF5" // Emerald 50
                        opacity="0.8"
                    />

                    {/* Accent "Stream" at the top */}
                    <Path
                        d={`M${width} ${height * 0.05} Q${width * 0.4} ${height * 0.15} 0 ${height * 0.02}`}
                        stroke="#34C759"
                        strokeWidth="80"
                        strokeLinecap="round"
                        opacity="0.04"
                    />
                </Svg>
            </View>

            {/* 3. THE CONTENT */}
            <View className="flex-1">{children}</View>
        </View>
    );
};

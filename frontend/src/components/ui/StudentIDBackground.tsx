import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path, Circle, G } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export const StudentIDBackground = ({ children }: { children: React.ReactNode }) => {
    return (
        <View className="flex-1 bg-white">
            {/* 1. Bas-bakgrund: Varm krämvit */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "#FFFBEB" }]} />

            {/* 2. SVG-LAGER: "The Harmonic Horizon" */}
            <View style={StyleSheet.absoluteFill}>
                <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                    
                    {/* Top Left: En mjuk, blek "sol" som balanserar logotypen */}
                    <Circle
                        cx={width * 0.1}
                        cy={height * 0.05}
                        r="140"
                        fill="#FEF3C7"
                        opacity="0.1"
                    />

                    {/* THE HORIZON STRIPES - Diagonalt stigande flöde (icke-S form) */}
                    <G opacity="0.12">
                        {/* Linje 1: Mustard - Den bärande linjen */}
                        <Path
                            d={`M-20 ${height * 0.8} Q${width * 0.4} ${height * 0.75} ${width + 20} ${height * 0.4}`}
                            stroke="#F59E0B"
                            strokeWidth="14"
                            fill="none"
                            strokeLinecap="round"
                        />
                        {/* Linje 2: Rust - Som en skugga under */}
                        <Path
                            d={`M-20 ${height * 0.84} Q${width * 0.4} ${height * 0.79} ${width + 20} ${height * 0.44}`}
                            stroke="#B45309"
                            strokeWidth="10"
                            fill="none"
                            strokeLinecap="round"
                        />
                        {/* Linje 3: Teal - En tunn accent på toppen */}
                        <Path
                            d={`M-20 ${height * 0.76} Q${width * 0.4} ${height * 0.71} ${width + 20} ${height * 0.36}`}
                            stroke="#0D9488"
                            strokeWidth="6"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </G>

                    {/* Bottom Right: En massiv, mjuk cirkel som ankrar sidan */}
                    <Circle
                        cx={width}
                        cy={height}
                        r="220"
                        fill="#B45309"
                        opacity="0.08"
                    />

                    {/* Bottom Left: Liten mjuk accent */}
                    <Circle
                        cx={width * 0.05}
                        cy={height * 0.9}
                        r="60"
                        fill="#FEF3C7"
                        opacity="0.2"
                    />
                </Svg>
            </View>

            {/* 3. INNEHÅLLET */}
            <View className="flex-1">{children}</View>
        </View>
    );
};

import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export const NotificationBackground = ({ children }: { children: React.ReactNode }) => {
    return (
        <View className="flex-1 bg-white">
            {/* 1. Base light cream background */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "#FFFBEB" }]} />

            {/* 2. SVG LAYER: Integrated "Deep Pocket" Flow and Large Soft Circles */}
            <View style={StyleSheet.absoluteFill}>
                <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                    {/* Definitions for Gradient and Soft Forms */}
                    <Defs>
                        {/* A very subtle, faded gradient for the main shape */}
                        <LinearGradient id="pocketGradient" x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.25" />
                            {/* Soft Mustard */}
                            <Stop offset="100%" stopColor="#B45309" stopOpacity="0.1" />
                            {/* Soft Rust */}
                        </LinearGradient>
                    </Defs>

                    {/* The Giant Deep Pocket Curve - Replacing discrete stripes with an integrated shape */}
                    {/* --- FEASIBILITY: This large shape is a single path with extremely low visibility (0.05 opacity) --- */}
                    {/* This shape creates a soft "cradle" that holds the dashboard cards. */}
                    <G opacity="0.15">
                        <Path
                            d={`M-50 ${height * 0.25} C${width * 0.3} ${height * 0.1}, ${width * 0.7} ${height * 0.5}, ${width + 50} ${height * 0.3} V${height + 50} H-50 Z`}
                            fill="url(#pocketGradient)"
                        />
                    </G>

                    {/* The Interweaving "Staff" - Extremely subtle parallel wavy lines within the pocket area */}
                    {/* --- FEASIBILITY: 0.1 opacity and thin strokeWidth to ensure foreground legibility --- */}
                    <G opacity="0.1" fill="none" strokeWidth="2">
                        {/* Wavy staff lines flowing along the bottom-right of the screen */}
                        <Path
                            d={`M${width * 0.1} ${height * 0.8} C${width * 0.4} ${height * 0.7}, ${width * 0.6} ${height * 0.9}, ${width + 50} ${height * 0.8}`}
                            stroke="#0D9488" // Faded Teal
                        />
                        <Path
                            d={`M${width * 0.05} ${height * 0.83} C${width * 0.35} ${height * 0.73}, ${width * 0.55} ${height * 0.93}, ${width + 50} ${height * 0.83}`}
                            stroke="#B45309" // Faded Rust
                        />
                        <Path
                            d={`M${width * 0.0} ${height * 0.86} C${width * 0.3} ${height * 0.76}, ${width * 0.5} ${height * 0.96}, ${width + 50} ${height * 0.86}`}
                            stroke="#F59E0B" // Faded Mustard
                        />
                    </G>

                    {/* Bottom Left: Very Large, Soft Round Cirkel - Fixing previous turn's feedback for a clean round form */}
                    {/* Placed extremely faded, almost merging with the cream base. */}
                    {/* --- FEASIBILITY: Very high radius, very low opacity --- */}
                    <Circle
                        cx="0"
                        cy={height}
                        r="200"
                        fill="#B45309" // Rust (Amber 900 base)
                        opacity="0.08"
                    />

                    {/* Top Right: Accent geometry peek - Updated to match the large round fix */}
                    {/* A large, soft circle instead of a jagged corner. */}
                    {/* --- FEASIBILITY: Opacity 0.1 --- */}
                    <Circle
                        cx={width * 0.9}
                        cy={height * 0.05}
                        r="180"
                        fill="#FEF3C7" // Soft Mustard
                        opacity="0.1"
                    />

                    {/* Subtila vibrationslinjer uppe till vänster (Musical rhythm hint) */}
                    <Path
                        d={`M0 ${height * 0.05} Q${width * 0.15} ${height * 0.1} 0 ${height * 0.15}`}
                        stroke="#B45309"
                        strokeWidth="1.5"
                        fill="none"
                        opacity="0.1"
                    />
                </Svg>
            </View>

            {/* 3. INNEHÅLLET (Dashboard cards, header, etc.) */}
            {/* The flex-1 view allows your content (like Hej Non!, NotificationStack, elevers list cards) to sit naturally in the foreground. */}
            <View className="flex-1">{children}</View>
        </View>
    );
};

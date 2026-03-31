import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export const SettingsBackground = ({ children }: { children: React.ReactNode }) => {
    return (
        <View className="flex-1 bg-white">
            {/* 1. Base light peach background */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "#FFF7ED" }]} />

            {/* 2. RETRO RIPPLES LAYER */}
            <View style={StyleSheet.absoluteFill}>
                <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                    {/* Top Left: Concentric Arcs (Vinyl Grooves) */}
                    {/* --- STRONGER VISIBILITY: Increased strokeWidth and much higher opacity --- */}
                    {/* We still use a gradient fade effect, but it starts much stronger */}
                    <Circle cx="40" cy="40" r="120" stroke="#FDBA74" strokeWidth="4" fill="none" opacity="0.2" />
                    <Circle cx="40" cy="40" r="160" stroke="#FDBA74" strokeWidth="3" fill="none" opacity="0.25" />
                    <Circle cx="40" cy="40" r="200" stroke="#FDBA74" strokeWidth="2" fill="none" opacity="0.15" />
                    <Circle cx="40" cy="40" r="240" stroke="#FDBA74" strokeWidth="1" fill="none" opacity="0.08" />

                    {/* Bottom Right: Soft Organic "Lobe" */}
                    {/* --- STRONGER VISIBILITY: Increased opacity to 0.85 (almost solid) --- */}
                    <Path d={`M${width} ${height * 0.7} Q${width * 0.7} ${height * 0.85} ${width} ${height}`} fill="#FFEDD5" opacity="0.85" />

                    {/* Mid-screen Subtle Horizontal STAFF line */}
                    {/* --- STRONGER VISIBILITY: Increased strokeWidth to 2.5 and opacity to 0.3 --- */}
                    <Path
                        d={`M0 ${height * 0.5} C${width * 0.3} ${height * 0.45}, ${width * 0.7} ${height * 0.55}, ${width} ${height * 0.5}`}
                        stroke="#FDBA74"
                        strokeWidth="2.5"
                        fill="none"
                        opacity="0.3"
                    />

                    {/* Bottom Left: Deep Accent Blob */}
                    {/* --- STRONGER VISIBILITY: Increased opacity to 0.9 (very solid) --- */}
                    <Circle cx="0" cy={height} r="120" fill="#FEF3C7" opacity="0.5" />
                </Svg>
            </View>

            {/* 3. THE CONTENT */}
            <View className="flex-1">{children}</View>
        </View>
    );
};

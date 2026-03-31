import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path, Circle, G } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export const StudentBackground = ({ children }: { children: React.ReactNode }) => {
    return (
        <View className="flex-1 bg-white">
            {/* 1. Bas-bakgrund */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "#FFFBEB" }]} />

            {/* 2. SVG-LAGER */}
            <View style={StyleSheet.absoluteFill}>
                <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                    {/* Top Right: Mjuk bakgrundsform */}
                    <Circle cx={width * 0.9} cy={height * 0.05} r="150" fill="#FEF3C7" opacity="0.1" />

                    {/* THE S-GROOVE - Följer din röda linje med Cubic Bézier */}
                    <G opacity="0.15">
                        {/* Linje 1: Mustard */}
                        <Path
                            d={`M-20 ${height * 0.15} C${width * 0.8} ${height * 0.2}, ${width * -0.4} ${height * 0.7}, ${width + 50} ${height * 0.85}`}
                            stroke="#F59E0B"
                            strokeWidth="12"
                            fill="none"
                        />
                        {/* Linje 2: Rust */}
                        <Path
                            d={`M-20 ${height * 0.19} C${width * 0.8} ${height * 0.24}, ${width * -0.4} ${height * 0.74}, ${width + 50} ${height * 0.89}`}
                            stroke="#B45309"
                            strokeWidth="10"
                            fill="none"
                        />
                        {/* Linje 3: Teal */}
                        <Path
                            d={`M-20 ${height * 0.23} C${width * 0.8} ${height * 0.28}, ${width * -0.4} ${height * 0.78}, ${width + 50} ${height * 0.93}`}
                            stroke="#0D9488"
                            strokeWidth="8"
                            fill="none"
                        />
                    </G>

                    {/* Bottom Left: Den stora runda cirkeln du ville ha */}
                    <Circle cx="0" cy={height} r="140" fill="#B45309" opacity="0.15" />

                    {/* Bottom Right: Accent cirkel */}
                    <Circle cx={width * 0.95} cy={height * 0.95} r="80" fill="#FEF3C7" opacity="0.2" />
                </Svg>
            </View>

            {/* 3. INNEHÅLLET */}
            <View className="flex-1">{children}</View>
        </View>
    );
};

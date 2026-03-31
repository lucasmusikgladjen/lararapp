import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export const DashboardBackground = ({ children }: { children: React.ReactNode }) => {
    return (
        <View className="flex-1 bg-white">
            {/* 1. Bas-bakgrund: Mjuk krämvit */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "#FFFBEB" }]} />

            {/* 2. SVG-LAGER */}
            <View style={StyleSheet.absoluteFill}>
                <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                    {/* Definitioner för Gradienten */}
                    <Defs>
                        <LinearGradient id="smileGradient" x1="0" y1="0" x2="1" y2="0">
                            <Stop offset="0%" stopColor="#65A30D" />
                            {/* Mossgrön */}
                            <Stop offset="100%" stopColor="#B45309" />
                            {/* Terracotta */}
                        </LinearGradient>
                    </Defs>

                    {/* Top Right: Bakgrunds-accent */}
                    <Path
                        d={`M${width} 0 L${width * 0.65} 0 Q${width * 0.7} ${height * 0.1}, ${width} ${height * 0.17} Z`}
                        fill="#D97706"
                        opacity="0.1"
                    />

                    {/* THE REFONATED ECHO - En Gradient-våg med ett Eko */}
                    <G opacity="0.1">
                        {/* Linje 1 - Huvudvågen med en Gradient på linjen */}
                        <Path
                            d={`M-50 ${height * 0.32} Q${width * 0.5} ${height * 0.52} ${width + 50} ${height * 0.32}`}
                            stroke="url(#smileGradient)"
                            strokeWidth="12"
                            fill="none"
                        />
                        {/* Linje 2 - Ekot, solid Terracotta och tunnare */}
                        <Path
                            d={`M-50 ${height * 0.36} Q${width * 0.5} ${height * 0.56} ${width + 50} ${height * 0.36}`}
                            stroke="#B45309"
                            strokeWidth="4"
                            fill="none"
                        />
                    </G>

                    {/* Bottom Left: SPECIFIK FIX - En tydlig, stor och rund Cirkel-form */}
                    {/* Placerad så att den är klart en cirkel som sitter i hörnet */}
                    <Circle cx="0" cy={height} r="120" fill="#B45309" opacity="0.2" />

                    {/* Accent-cirkel nere i hörnet */}
                    <Circle cx="60" cy={height * 0.85} r="80" fill="#F59E0B" opacity="0.1" />
                </Svg>
            </View>

            {/* 3. INNEHÅLLET */}
            <View className="flex-1">{children}</View>
        </View>
    );
};

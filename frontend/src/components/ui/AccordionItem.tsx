import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { 
    useAnimatedStyle, 
    useSharedValue, 
    withTiming,
    Easing 
} from "react-native-reanimated";

interface AccordionItemProps {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    iconBgColor: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export const AccordionItem = ({ title, icon, iconColor, iconBgColor, children, defaultOpen = false }: AccordionItemProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    
    // Shared values
    const height = useSharedValue(0);
    const contentHeight = useSharedValue(0);

    const toggle = () => {
        if (isOpen) {
            height.value = withTiming(0, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
        } else {
            height.value = withTiming(contentHeight.value, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
        }
        setIsOpen(!isOpen);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        height: height.value,
        opacity: height.value === 0 ? 0 : 1,
    }));

    const chevronStyle = useAnimatedStyle(() => ({
        // Rotate 180deg: Points DOWN (0deg) when closed, Points UP (180deg) when open
        transform: [{ rotate: withTiming(isOpen ? '180deg' : '0deg', { duration: 250 }) }],
    }));

    return (
        <View className="bg-white">
            <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={toggle} 
                className="flex-row items-center justify-between p-4 border-b border-slate-100"
            >
                <View className="flex-row items-center gap-3">
                    <View className={`w-8 h-8 rounded-lg items-center justify-center ${iconBgColor}`}>
                        <Ionicons name={icon} size={18} color={iconColor} />
                    </View>
                    <Text className="font-medium text-base text-slate-900">{title}</Text>
                </View>
                
                <Animated.View style={chevronStyle}>
                     {/* UX CHANGE: Use chevron-down instead of chevron-forward */}
                     <Ionicons name="chevron-down" size={20} color="#CBD5E1" />
                </Animated.View>
            </TouchableOpacity>

            <Animated.View style={[animatedStyle, { overflow: 'hidden' }]}>
                <View 
                    style={{ position: 'absolute', width: '100%', top: 0 }}
                    onLayout={(event) => {
                        contentHeight.value = event.nativeEvent.layout.height;
                        if (defaultOpen && height.value === 0) {
                            height.value = event.nativeEvent.layout.height;
                        }
                    }}
                >
                    <View className="bg-slate-50 border-b border-slate-100">
                        <View className="p-4 space-y-4">{children}</View>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};
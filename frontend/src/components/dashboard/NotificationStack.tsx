import React from "react";
import { View, Dimensions, ActivityIndicator } from "react-native";
import Carousel from "react-native-reanimated-carousel";
// 1. Importera Reanimated-verktygen vi behöver
import Animated, { interpolate, useSharedValue, useAnimatedStyle, withTiming, SharedValue } from "react-native-reanimated";
import { router } from "expo-router";
import { NotificationCard } from "./NotificationCard";
import { useNotifications } from "../../hooks/useNotifications";

const { width } = Dimensions.get("window");

// 2. Skapa en ny underkomponent som lever HELT på UI-tråden
const PaginationDot = ({ index, progress, total }: { index: number; progress: SharedValue<number>; total: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
        // Eftersom karusellen loopar oändligt kan progress bli 4, 5, 6 eller negativa tal.
        // Vi använder modulo (%) för att alltid översätta det till rätt index (0, 1, 2, 3).
        let activeIndex = Math.round(progress.value) % total;
        if (activeIndex < 0) {
            activeIndex += total;
        }

        const isActive = activeIndex === index;

        return {
            // Animerar bredd och färg smidigt utan att störa React!
            width: withTiming(isActive ? 20 : 8, { duration: 150 }), // 20px för aktiv, 8px för inaktiv
            backgroundColor: withTiming(isActive ? "#F97316" : "#D1D5DB", { duration: 150 }), // Orange vs Grå
        };
    });

    return <Animated.View style={[{ height: 8, borderRadius: 4, marginHorizontal: 3 }, animatedStyle]} />;
};

export const NotificationStack = () => {
    const { data: notifications, isLoading } = useNotifications();
    
    // 3. Byt ut useState mot en SharedValue
    const progress = useSharedValue(0);

    const CARD_HEIGHT = 90;
    const CONTAINER_HEIGHT = 160;

    if (isLoading) {
        return (
            <View className="w-full mt-3 mb-4 items-center justify-center" style={{ height: CONTAINER_HEIGHT }}>
                <ActivityIndicator size="small" color="#F97316" />
            </View>
        );
    }

    if (!notifications || notifications.length === 0) {
        return null;
    }

    if (notifications.length === 1) {
        return (
            <View className="w-full mt-3 mb-4 items-center" style={{ height: CONTAINER_HEIGHT }}>
                <View style={{ height: CARD_HEIGHT, width: width - 40 }}>
                    <NotificationCard
                        item={notifications[0]}
                        onPress={() => router.push(`/(auth)/notification/${notifications[0].id}`)}
                    />
                </View>
            </View>
        );
    }

    const shouldLoop = notifications.length >= 4;

    return (
        <View className="w-full mt-3 mb-4" style={{ height: CONTAINER_HEIGHT }}>
            <View className="w-full overflow-hidden" style={{ height: 135 }}>
                <Carousel
                    loop={shouldLoop}
                    vertical={true}
                    width={width - 40}
                    height={CARD_HEIGHT}
                    style={{ overflow: "visible" }}
                    data={notifications}
                    scrollAnimationDuration={400}
                    // 4. Ta bort onSnapToItem och använd onProgressChange
                    onProgressChange={(_, absoluteProgress) => {
                        progress.value = absoluteProgress;
                    }}
                    customAnimation={(value: number) => {
                        "worklet";

                        const translateY = interpolate(value, [-1, 0, 1, 2, 3], [-CARD_HEIGHT, 0, 26, 50, 50], "clamp");
                        const scale = interpolate(value, [-1, 0, 1, 2, 3], [1, 1, 0.92, 0.84, 0.84], "clamp");
                        const opacity = interpolate(value, [-1, 0, 1, 2, 3], [0, 1, 1, 1, 0], "clamp");
                        const zIndex = Math.round(interpolate(value, [-1, 0, 1, 2, 3], [30, 30, 20, 10, 0], "clamp"));

                        return {
                            transform: [{ translateY }, { scale }],
                            opacity,
                            zIndex,
                        };
                    }}
                    renderItem={({ item }) => (
                        <View style={{ height: CARD_HEIGHT, width: "100%" }}>
                            <NotificationCard
                                item={item}
                                onPress={() => router.push(`/(auth)/notification/${item.id}`)}
                            />
                        </View>
                    )}
                />
            </View>

            {/* 5. Rendera våra nya UI-tråds-animerade dots */}
            <View className="flex-row justify-center items-center mt-3">
                {notifications.map((_, index) => (
                    <PaginationDot key={index} index={index} progress={progress} total={notifications.length} />
                ))}
            </View>
        </View>
    );
};
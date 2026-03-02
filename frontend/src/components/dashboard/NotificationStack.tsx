import React from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { router } from "expo-router";
import Animated, { interpolate, SharedValue, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useNotifications } from "../../hooks/useNotifications";
import { NotificationCard } from "./NotificationCard";

const { width } = Dimensions.get("window");

// 2. Skapa en ny underkomponent som lever HELT på UI-tråden
const PaginationDot = ({ index, progress, total }: { index: number; progress: SharedValue<number>; total: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
        let activeIndex = Math.round(progress.value) % total;
        if (activeIndex < 0) {
            activeIndex += total;
        }

        const isActive = activeIndex === index;

        return {
            backgroundColor: isActive ? "#F97316" : "#D1D5DB",
        };
    });

    return <Animated.View style={[{ width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 }, animatedStyle]} />;
};

export const NotificationStack = () => {
    const { data: notifications, isLoading } = useNotifications();
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
            <View className="w-full mt-3 mb-6 items-center">
                <View style={{ height: CARD_HEIGHT, width: width - 40 }}>
                    <NotificationCard item={notifications[0]} onPress={() => router.push(`/(auth)/notification/${notifications[0].id}`)} />
                </View>
            </View>
        );
    }

    const shouldLoop = notifications.length >= 4;

    return (
        <View className="w-full mt-3 mb-4" style={{ height: CONTAINER_HEIGHT }}>
            <View className="w-full overflow-hidden" style={{ height: 135 }}>
                <Carousel
                    key={`carousel-${notifications.length}`}
                    loop={shouldLoop}
                    vertical={true}
                    width={width - 40}
                    height={CARD_HEIGHT}
                    style={{ overflow: "visible" }}
                    data={notifications}
                    scrollAnimationDuration={400}
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
                            <NotificationCard item={item} onPress={() => router.push(`/(auth)/notification/${item.id}`)} />
                        </View>
                    )}
                />
            </View>

            <View className="flex-row justify-center items-center mt-3">
                {notifications.map((_, index) => (
                    <PaginationDot key={index} index={index} progress={progress} total={notifications.length} />
                ))}
            </View>
        </View>
    );
};

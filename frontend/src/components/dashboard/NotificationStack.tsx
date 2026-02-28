import React from "react";
import { View, Dimensions, ActivityIndicator } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { interpolate } from "react-native-reanimated";
import { router } from "expo-router";
import { NotificationCard } from "./NotificationCard";
import { useNotifications } from "../../hooks/useNotifications";

const { width } = Dimensions.get("window");

export const NotificationStack = () => {
    // 1. Hämta riktig data från din backend!
    const { data: notifications, isLoading} = useNotifications();

    const CARD_HEIGHT = 90;
    const CONTAINER_HEIGHT = 145;

    // Visa en laddningsindikator medan vi hämtar
    if (isLoading) {
        return (
            <View className="w-full mt-3 mb-4 items-center justify-center" style={{ height: CONTAINER_HEIGHT }}>
                <ActivityIndicator size="small" color="#F97316" />
            </View>
        );
    }

    // Har vi inga notiser? Rendera ingenting (dölj stacken helt)
    if (!notifications || notifications.length === 0) {
        console.log("⚠️ Returnerar NULL eftersom listan är tom eller saknas!");
        return null;
    }

    // --- Om det bara finns 1 notis, skippa karusellen! ---
    if (notifications.length === 1) {
        return (
            <View className="w-full mt-3 mb-4 items-center" style={{ height: CONTAINER_HEIGHT }}>
                <View style={{ height: CARD_HEIGHT, width: width - 40 }}>
                    <NotificationCard
                        item={notifications[0]}
                        onPress={() => {
                            console.log("Navigating to notification:", notifications[0].id);
                            router.push(`/(auth)/notification/${notifications[0].id}`);
                        }}
                    />
                </View>
            </View>
        );
    }

    // Om vi har för få kort kan en oändlig loop se buggig ut i biblioteket.
    const shouldLoop = notifications.length >= 4;

    return (
        <View className="w-full overflow-hidden mt-3 mb-4" style={{ height: CONTAINER_HEIGHT }}>
            <Carousel
                loop={shouldLoop}
                vertical={true}
                width={width - 40}
                height={CARD_HEIGHT}
                style={{ overflow: "visible" }}
                data={notifications}
                scrollAnimationDuration={400}
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
                            onPress={() => {
                                // 2. När vi trycker, navigera till legobits-sidan och skicka med ID!
                                console.log("Navigating to notification:", item.id);
                                router.push(`/(auth)/notification/${item.id}`);
                            }}
                        />
                    </View>
                )}
            />
        </View>
    );
};

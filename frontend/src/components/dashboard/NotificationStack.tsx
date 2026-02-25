import React from "react";
import { View, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { interpolate } from "react-native-reanimated";
import { NotificationCard, NotificationData } from "./NotificationCard";

const { width } = Dimensions.get("window");

const DUMMY_NOTIFICATIONS: NotificationData[] = [
    {
        id: "1",
        title: "Skicka in info om din elev",
        message: "Rapportera dina lektioner här",
        type: "alert",
        icon: "megaphone-outline",
    },
    {
        id: "2",
        title: "Glöm inte att signera",
        message: "Ditt nya anställningsavtal väntar på dig",
        type: "success",
        icon: "document-text-outline",
    },
    {
        id: "3",
        title: "Ny ansökan i Malmö",
        message: "En ny elev söker gitarrlärare",
        type: "info",
        icon: "person-add-outline",
    },
    {
        id: "4",
        title: "Dags för löneutbetalning",
        message: "Din lön för februari är på väg",
        type: "success", 
        icon: "cash-outline",
    },
];

export const NotificationStack = () => {
    const CARD_HEIGHT = 90; 
    // Container must be tall enough for the main card (90) + the maximum peek offset (50) + a tiny buffer
    const CONTAINER_HEIGHT = 145; 

    return (
        // mt-3 and mb-4 keeps it perfectly centered visually
        <View className="w-full overflow-hidden mt-3 mb-4" style={{ height: CONTAINER_HEIGHT }}>
            <Carousel
                loop={true} // Keeps the cards flowing infinitely
                vertical={true}
                width={width - 40}
                height={CARD_HEIGHT} 
                style={{ overflow: "visible" }} 
                data={DUMMY_NOTIFICATIONS}
                scrollAnimationDuration={400} 
                
                customAnimation={(value: number) => {
                    "worklet";
                    
                    // value: -1 (swiped away), 0 (top card), 1 (middle card), 2 (bottom card), 3 (hidden)
                    
                    const translateY = interpolate(
                        value,
                        [-1, 0, 1, 2, 3],
                        [-CARD_HEIGHT, 0, 26, 50, 50], // 3rd card stops at 50px down
                        'clamp'
                    );

                    const scale = interpolate(
                        value,
                        [-1, 0, 1, 2, 3],
                        [1, 1, 0.92, 0.84, 0.84], // Perfect 3D scaling
                        'clamp'
                    );

                    const opacity = interpolate(
                        value,
                        [-1, 0, 1, 2, 3],
                        [0, 1, 1, 1, 0], // The 4th card (value 3) is forced to opacity 0!
                        'clamp'
                    );

                    const zIndex = Math.round(
                        interpolate(
                            value,
                            [-1, 0, 1, 2, 3],
                            [30, 30, 20, 10, 0],
                            'clamp'
                        )
                    );

                    return {
                        transform: [{ translateY }, { scale }],
                        opacity,
                        zIndex,
                    };
                }}
                renderItem={({ item }) => (
                    <View style={{ height: CARD_HEIGHT, width: '100%' }}>
                        <NotificationCard 
                            item={item} 
                            onPress={() => console.log("Pressed:", item.title)} 
                        />
                    </View>
                )}
            />
        </View>
    );
};
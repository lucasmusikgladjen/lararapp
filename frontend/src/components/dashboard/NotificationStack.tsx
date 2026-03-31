import { ActivityIndicator, Dimensions, View, TouchableOpacity } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { router } from "expo-router";
import Animated, { interpolate, useSharedValue, LinearTransition, FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import { NotificationCard } from "./NotificationCard";

const { width } = Dimensions.get("window");

export const NotificationStack = () => {
    const { data: notifications, isLoading } = useNotifications();
    const progress = useSharedValue(0);
    const [isExpanded, setIsExpanded] = useState(false);

    const CARD_HEIGHT = 90;
    // Hur många pixlar varje bakomliggande kort ska sticka ut
    const STACK_OFFSET = 12;

    if (isLoading) {
        return (
            <View className="w-full mt-3 mb-6 items-center justify-center" style={{ height: 160 }}>
                <ActivityIndicator size="small" color="#F97316" />
            </View>
        );
    }

    if (!notifications || notifications.length === 0) {
        return null;
    }

    if (notifications.length === 1) {
        return (
            <View className="w-full mt-3 mb-6">
                <View className="w-full items-center">
                    <View style={{ height: CARD_HEIGHT, width: width - 40 }}>
                        <NotificationCard item={notifications[0]} onPress={() => router.push(`/(auth)/notification/${notifications[0].id}`)} />
                    </View>
                </View>
            </View>
        );
    }

    // Vi loopar bara om det är tillräckligt många kort
    const shouldLoop = notifications.length >= 4;

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <Animated.View layout={LinearTransition.springify().damping(20).stiffness(150)} className="w-full mt-3 mb-6">
            {isExpanded ? (
                // EXPANDERAD LISTA
                <Animated.View key="list-view" entering={FadeIn.duration(300)} className="w-full items-center gap-y-3">
                    {notifications.map((item) => (
                        <View key={item.id} style={{ height: CARD_HEIGHT, width: width - 40 }}>
                            <NotificationCard item={item} onPress={() => router.push(`/(auth)/notification/${item.id}`)} />
                        </View>
                    ))}
                </Animated.View>
            ) : (
                // STÄNGD STACK (Nu med "Version 2"-looken!)
                <Animated.View
                    key="stack-view"
                    entering={FadeIn.duration(300)}
                    className="w-full overflow-hidden items-center"
                    // Höjden på karusellen beräknas för att ge plats åt stack-effekten
                    style={{ height: CARD_HEIGHT + (STACK_OFFSET * 2.5) }} 
                >
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
                            
                            // 'value' representerar kortets relativa position i karusellen.
                            // 0 = aktivt kort, 1 = kortet bakom, 2 = kortet bakom det.
                            
                            // 1. Skjut neråt (Positivt Y-värde) istället för uppåt.
                            const translateY = interpolate(value, [-1, 0, 1, 2, 3], [-CARD_HEIGHT, 0, STACK_OFFSET, STACK_OFFSET * 2, STACK_OFFSET * 2], "clamp");
                            
                            // 2. Skala neråt mjukare (95%, 90% etc)
                            const scale = interpolate(value, [-1, 0, 1, 2, 3], [1, 1, 0.95, 0.90, 0.90], "clamp");
                            
                            // 3. Tona ut opaciteten gradvis för kort som ligger långt bak
                            const opacity = interpolate(value, [-1, 0, 1, 2, 3], [0, 1, 0.8, 0.6, 0], "clamp");
                            
                            // 4. Det aktiva kortet (0) ska alltid ligga högst upp (högt Z-index)
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
                </Animated.View>
            )}

            {/* Pilen under (som i din rena design) */}
            <TouchableOpacity activeOpacity={0.7} onPress={toggleExpand} className="items-center justify-center mt-1">
                <View className="px-3 py-1 flex-row items-center">
                    <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={26} color="#94A3B8" />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

///// VERSION 2 - iPhone Push Notification

// import { ActivityIndicator, Dimensions, Text, View, TouchableOpacity } from "react-native";
// import { router } from "expo-router";
// import Animated, { interpolate, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
// import { Ionicons } from "@expo/vector-icons";
// import { useState } from "react";
// import { useNotifications } from "../../hooks/useNotifications";
// import { NotificationCard } from "./NotificationCard";

// const { width } = Dimensions.get("window");
// const CARD_HEIGHT = 90;
// const EXPANDED_GAP = 12; // Mellanrum när listan är utfälld (gap-y-3)
// const STACK_OFFSET = 12; // Hur många pixlar varje kort tittar fram under det föregående
// const MAX_VISIBLE_STACK = 3; // Max antal kort som syns i stacken bakåt

// // --- SUB-KOMPONENT FÖR VARJE ENSKILT KORT ---
// const StackedCard = ({ item, index, total, progress }: any) => {
//     const animatedStyle = useAnimatedStyle(() => {
//         const visualIndex = Math.min(index, MAX_VISIBLE_STACK);

//         // VÄRDEN NÄR STACKEN ÄR STÄNGD (0)
//         const collapsedY = visualIndex * STACK_OFFSET;
//         const collapsedScale = 1 - visualIndex * 0.05;
//         const collapsedOpacity = index < MAX_VISIBLE_STACK + 1 ? 1 - visualIndex * 0.2 : 0;

//         // VÄRDEN NÄR LISTAN ÄR EXPANDERAD (1)
//         const expandedY = index * (CARD_HEIGHT + EXPANDED_GAP);
//         const expandedScale = 1;
//         const expandedOpacity = 1;

//         return {
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             zIndex: total - index,
//             opacity: interpolate(progress.value, [0, 1], [collapsedOpacity, expandedOpacity], "clamp"),
//             transform: [
//                 { translateY: interpolate(progress.value, [0, 1], [collapsedY, expandedY], "clamp") },
//                 { scale: interpolate(progress.value, [0, 1], [collapsedScale, expandedScale], "clamp") },
//             ],
//         };
//     });

//     return (
//         <Animated.View style={animatedStyle}>
//             <View style={{ height: CARD_HEIGHT, width: "100%" }}>
//                 <NotificationCard item={item} onPress={() => router.push(`/(auth)/notification/${item.id}`)} />
//             </View>
//         </Animated.View>
//     );
// };

// export const NotificationStack = () => {
//     // 1. ALLA HOOKS MÅSTE DEKLARERAS HÖGST UPP (INNAN EARLY RETURNS)
//     const { data: notifications, isLoading } = useNotifications();
//     const [isExpanded, setIsExpanded] = useState(false);
//     const expandProgress = useSharedValue(0);

//     // Eftersom hooks körs direkt måste vi vara säkra på att notifications.length inte kraschar appen
//     const containerStyle = useAnimatedStyle(() => {
//         const count = notifications?.length || 0;

//         // Om vi har 1 eller färre notiser behöver vi inte räkna ut expandering
//         if (count <= 1) {
//             return { height: CARD_HEIGHT };
//         }

//         const collapsedHeight = CARD_HEIGHT + Math.min(count - 1, MAX_VISIBLE_STACK) * STACK_OFFSET;
//         const expandedHeight = count * CARD_HEIGHT + (count - 1) * EXPANDED_GAP;

//         return {
//             height: interpolate(expandProgress.value, [0, 1], [collapsedHeight, expandedHeight], "clamp"),
//         };
//     });

//     // 2. NU KAN VI GÖRA VÅRA EARLY RETURNS!
//     if (isLoading) {
//         return (
//             <View className="w-full mt-3 mb-6 items-center justify-center" style={{ height: 160 }}>
//                 <ActivityIndicator size="small" color="#F97316" />
//             </View>
//         );
//     }

//     if (!notifications || notifications.length === 0) {
//         return null;
//     }

//     if (notifications.length === 1) {
//         return (
//             <View className="w-full mt-3 mb-6 items-center">
//                 <View style={{ height: CARD_HEIGHT, width: width - 40 }}>
//                     <NotificationCard item={notifications[0]} onPress={() => router.push(`/(auth)/notification/${notifications[0].id}`)} />
//                 </View>
//             </View>
//         );
//     }

//     // 3. LOGIK FÖR TOGGLE
//     const toggleExpand = () => {
//         const nextState = !isExpanded;
//         setIsExpanded(nextState);

//         expandProgress.value = withSpring(nextState ? 1 : 0, {
//             damping: 18,
//             stiffness: 200,
//             mass: 0.8,
//         });
//     };

//     return (
//         <View className="w-full mt-3 mb-6 items-center">
//             <Animated.View style={[{ width: width - 40 }, containerStyle]}>
//                 {notifications.map((item, index) => (
//                     <StackedCard key={item.id} item={item} index={index} total={notifications.length} progress={expandProgress} />
//                 ))}
//             </Animated.View>

//             <TouchableOpacity activeOpacity={0.7} onPress={toggleExpand} className="items-center justify-center mt-2">
//                 <View className="px-10 py-1 flex-row items-center">
//                     <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={30} color="#64748B" />
//                 </View>
//             </TouchableOpacity>
//         </View>
//     );
// };

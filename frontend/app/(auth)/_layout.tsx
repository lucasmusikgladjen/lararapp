import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            <Stack.Screen
                name="student/[id]"
                options={{
                    headerShown: false,
                    presentation: "card", // Ger snygg native slide-in animation
                }}
            />

            <Stack.Screen name="onboarding/instruments" options={{ headerShown: false }} />
        </Stack>
    );
}

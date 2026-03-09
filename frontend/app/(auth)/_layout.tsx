import { Stack } from "expo-router";
import React from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function AuthLayout() {
    return (
        <BottomSheetModalProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                <Stack.Screen
                    name="student/[id]"
                    options={{
                        headerShown: false,
                        presentation: "card", // Native slide-in animation
                    }}
                />

                <Stack.Screen name="onboarding/instruments" options={{ headerShown: false }} />
            </Stack>
        </BottomSheetModalProvider>
    );
}

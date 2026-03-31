import { Stack } from "expo-router";
import React from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function AuthLayout() {
    return (
        <BottomSheetModalProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "transparent" },
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                <Stack.Screen
                    name="student/[id]"
                    options={{
                        headerShown: false,
                        presentation: "card",
                    }}
                />

                <Stack.Screen
                    name="notification/[id]"
                    options={{
                        headerShown: false,
                        presentation: "card", // Standard native slide
                    }}
                />

                <Stack.Screen name="onboarding/instruments" options={{ headerShown: false }} />
            </Stack>
        </BottomSheetModalProvider>
    );
}

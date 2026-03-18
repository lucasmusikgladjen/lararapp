import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform } from "react-native";
import { MainBackground } from "../../../src/components/ui/MainBackground";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#F97316",
                tabBarInactiveTintColor: "#4a4a4a",
                sceneStyle: { backgroundColor: "transparent" },
                tabBarStyle: {
                    backgroundColor: "rgba(255, 255, 255, 0.85)",
                    borderTopWidth: 0,
                    elevation: 0,
                    paddingTop: 8,
                    ...(Platform.OS === "android" && { height: 60, paddingBottom: 8 }),
                },
            }}
        >
            {/* 1. Dashboard */}
            <Tabs.Screen
                name="index"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
                }}
            />

            {/* 2. Hitta elever (Map Icon) */}
            <Tabs.Screen
                name="find-students"
                options={{
                    title: "Hitta elever",
                    tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" size={size} color={color} />,
                }}
            />

            {/* 3. Elever (People Icon) */}
            <Tabs.Screen
                name="students"
                options={{
                    title: "Elever",
                    tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
                }}
            />
            {/* 4. Inställningar (Gear Icon) */}
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Inställningar",
                    tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}

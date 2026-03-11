import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import { authService } from "../src/services/auth.service"; // Import the service
import { useAuthStore } from "../src/store/authStore";

const queryClient = new QueryClient();

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

/**
 * Helper function to register for push notifications.
 * It checks permissions and fetches the Expo token using the projectId.
 */
async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    if (Device.isDevice) {
        // 1. Check existing permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        // 2. Ask for permission if not already granted
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        // 3. Stop if permission denied
        if (finalStatus !== "granted") {
            console.log("Permission not granted to get push token for push notification!");
            return;
        }

        // 4. Extract Project ID
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

        if (!projectId) {
            console.error("Project ID not found. Did you run `npx eas-cli init`?");
            return;
        }

        // 5. Fetch the token from Expo's servers
        try {
            token = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log("Expo Push Token Generated:", token);
        } catch (e) {
            console.error("Error getting push token:", e);
        }
    } else {
        console.log("Must use physical device for push notifications");
    }

    return token;
}

function useProtectedRoute() {
    const { isAuthenticated, isLoading, needsOnboarding } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === "(auth)";

        if (isAuthenticated && !inAuthGroup) {
            if (needsOnboarding) {
                router.replace("/(auth)/onboarding/instruments");
            } else {
                router.replace("/(auth)");
            }
        } else if (!isAuthenticated && inAuthGroup) {
            router.replace("/(public)");
        }
    }, [isAuthenticated, isLoading, segments]);
}

export default function RootLayout() {
    const { isLoading, loadUser, token: authToken } = useAuthStore();

    // 1. Load the user from secure storage
    useEffect(() => {
        loadUser();
    }, []);

    // 2. Handle Authentication Routing
    useProtectedRoute();

    // 3. Setup Push Notifications when authenticated
    useEffect(() => {
        // Only attempt to get a push token if the user is fully logged in
        if (authToken && !isLoading) {
            registerForPushNotificationsAsync().then((pushToken) => {
                if (pushToken) {
                    // Send it to your backend
                    authService
                        .registerPushToken(authToken, pushToken)
                        .then(() => console.log("Successfully saved Push Token to backend"))
                        .catch((err) => console.error("Failed to save Push Token", err));
                }
            });
        }
    }, [authToken, isLoading]); // Re-run if auth token changes (e.g., they log in)

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#F97316" />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
                <BottomSheetModalProvider>
                    <Slot />
                </BottomSheetModalProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}

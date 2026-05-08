import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Alert, Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

import { authService } from "../src/services/auth.service";
import { useAuthStore } from "../src/store/authStore";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const PUSH_PERMISSION_PROMPT_KEY = "push_permission_pre_prompt_seen";

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
 * Configure Android's notification channel before asking for permission or saving a token.
 */
async function ensureAndroidNotificationChannelAsync() {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }
}

/**
 * Fetch the Expo push token only after notification permission has already been granted.
 */
async function getExpoPushTokenAsync() {
    if (!Device.isDevice) {
        console.log("Must use physical device for push notifications");
        return;
    }

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
        return;
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

    if (!projectId) {
        console.error("Project ID not found. Did you run `npx eas-cli init`?");
        return;
    }

    try {
        const token = (
            await Notifications.getExpoPushTokenAsync({
                projectId,
            })
        ).data;
        console.log("Expo Push Token Generated:", token);
        return token;
    } catch (e) {
        console.error("Error getting push token:", e);
    }
}

async function savePushTokenIfAvailable(authToken: string) {
    await ensureAndroidNotificationChannelAsync();
    const pushToken = await getExpoPushTokenAsync();

    if (!pushToken) return;

    await authService.registerPushToken(authToken, pushToken);
    console.log("Successfully saved Push Token to backend");
}

async function requestPushPermissionAndSaveToken(authToken: string) {
    await ensureAndroidNotificationChannelAsync();
    await SecureStore.setItemAsync(PUSH_PERMISSION_PROMPT_KEY, "accepted");

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
        console.log("Permission not granted to get push token for push notification!");
        return;
    }

    await savePushTokenIfAvailable(authToken);
}

async function handlePushNotificationsAsync(authToken: string) {
    const { status } = await Notifications.getPermissionsAsync();

    if (status === "granted") {
        await savePushTokenIfAvailable(authToken);
        return;
    }

    const promptSeen = await SecureStore.getItemAsync(PUSH_PERMISSION_PROMPT_KEY);
    if (promptSeen) return;

    Alert.alert(
        "Notiser från Musikglädjen",
        "Vill du få notiser om schemaändringar, elevförfrågningar och viktiga uppdateringar? Du kan använda appen även om du väljer Inte nu.",
        [
            {
                text: "Inte nu",
                style: "cancel",
                onPress: () => {
                    SecureStore.setItemAsync(PUSH_PERMISSION_PROMPT_KEY, "dismissed").catch((err) =>
                        console.error("Failed to save push prompt choice", err),
                    );
                },
            },
            {
                text: "Tillåt notiser",
                onPress: () => {
                    requestPushPermissionAndSaveToken(authToken).catch((err) => console.error("Failed to enable push notifications", err));
                },
            },
        ],
    );
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

    // 1. Load user from storage on mount
    useEffect(() => {
        loadUser();
    }, []);

    // 2. Handle protected routing logic
    useProtectedRoute();

    // 3. Robust Splash Screen Hiding
    useEffect(() => {
        const hideSplash = async () => {
            if (!isLoading) {
                // The splash screen from assets/splash.png stays visible until this line is executed.
                await SplashScreen.hideAsync();
            }
        };
        hideSplash();
    }, [isLoading]);

    // 4. Register Push Notifications after an explanatory pre-permission prompt
    useEffect(() => {
        if (authToken && !isLoading) {
            handlePushNotificationsAsync(authToken).catch((err) => console.error("Failed to handle push notifications", err));
        }
    }, [authToken, isLoading]);

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <SafeAreaProvider>
                <QueryClientProvider client={queryClient}>
                    <BottomSheetModalProvider>
                        <Slot />
                    </BottomSheetModalProvider>
                </QueryClientProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

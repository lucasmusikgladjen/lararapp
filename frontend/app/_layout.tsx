import "../global.css";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "../src/store/authStore";

const queryClient = new QueryClient();

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
  const { isLoading, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  useProtectedRoute();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}

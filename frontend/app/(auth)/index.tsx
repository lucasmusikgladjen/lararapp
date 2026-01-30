import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/authStore";
import { useStudents } from "../../src/hooks/useStudents";
import { router } from "expo-router";
import { StudentCard } from "../../src/components/students/StudentCard";

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const token = useAuthStore((state) => state.token); // <--- Hämta token

    // 1. Rename 'data' to 'students' for clarity
    // Since our service now returns Student[] directly, we don't need .data anymore!
    const { data: students, isLoading, error } = useStudents();

    const handleLogout = async () => {
        await logout();
        router.replace("/(public)/login");
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 p-4">
            <View className="mb-6">
                <Text className="text-3xl font-bold text-slate-800">Hej, {user?.name?.split(" ")[0]}! 👋</Text>
                <Text className="text-slate-500">Här är dina elever:</Text>
            </View>

            {/* Content Area */}
            <View className="flex-1">
                {isLoading && <ActivityIndicator size="large" color="#4F46E5" className="mt-10" />}

                {error && (
                    <View className="mt-10 items-center">
                        <Text className="text-red-500 text-center">Kunde inte hämta elever.</Text>
                        <Text className="text-slate-400 text-xs mt-2">{error.message}</Text>
                    </View>
                )}

                {/* List of Students */}
                {/* We check 'students' directly now, not students.data */}
                <FlatList
                    data={students}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => <StudentCard student={item} onPress={() => console.log("Klickade på", item.name)} />}
                    ListEmptyComponent={
                        !isLoading ? <Text className="text-slate-400 text-center mt-10">Du har inga elever kopplade till dig än.</Text> : null
                    }
                />
            </View>

            {/* Logout Button */}
            <TouchableOpacity onPress={handleLogout} className="bg-red-50 py-3 rounded-xl items-center mt-4">
                <Text className="text-red-600 font-bold">Logga ut</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

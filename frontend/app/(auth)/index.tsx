import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/authStore";
import { useStudents } from "../../src/hooks/useStudents";
import { router } from "expo-router";
import { StudentCard } from "../../src/components/students/StudentCard";
import { Ionicons } from "@expo/vector-icons";

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const { data: students, isLoading, error } = useStudents();

    const handleLogout = async () => {
        await logout();
        router.replace("/(public)/login");
    };

    return (
        <SafeAreaView edges={["left", "right", "bottom"]} className="flex-1 bg-slate-50 px-4 pt-2">
            {/* Header Content Wrapper - You might want to wrap this whole view in a ScrollView later if content grows */}
            <View>
                {/* --- 1. WELCOME CARD --- */}
                <View className="bg-white rounded-2xl p-6 shadow-sm mb-4 items-center justify-center">
                    <Text className="text-2xl font-semibold text-slate-800">Välkommen tillbaka, {user?.name ? user.name.split(" ")[0] : "Non"}!</Text>
                </View>

                {/* --- 2. ORANGE ACTION CARD --- */}
                <TouchableOpacity
                    className="bg-orange-400 rounded-2xl p-5 shadow-sm mb-8 flex-row items-center"
                    onPress={() => console.log("Report pressed")}
                >
                    <View className="mr-4 rotate-[-15deg]">
                        <Ionicons name="megaphone-outline" size={32} color="white" />
                    </View>

                    <View className="flex-1">
                        <Text className="text-white font-bold text-lg">Glöm inte att rapportera!</Text>
                        <Text className="text-orange-50 text-sm">Rapportera dina lektioner här</Text>
                    </View>

                    <Ionicons name="chevron-forward" size={24} color="white" />
                </TouchableOpacity>

                {/* --- 3. NEXT LESSON CARD (NEW) --- */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-slate-900 mb-3 ml-1">Nästa lektion</Text>

                    <View className="bg-white rounded-3xl p-5 shadow-sm flex-row items-center">
                        {/* Avatar (Placeholder for the Sloth) */}
                        <Image
                            source={{ uri: "https://api.dicebear.com/7.x/avataaars/png?seed=5" }}
                            className="w-16 h-16 rounded-full bg-slate-100 mr-4"
                        />

                        {/* Text Info */}
                        <View className="flex-1">
                            <Text className="text-xl font-bold text-slate-900">Januari 23</Text>
                            <Text className="text-slate-600 text-base font-medium">Fredag, 15:00-16:00</Text>
                            <Text className="text-slate-900 font-bold text-base mt-1">Piano</Text>
                        </View>

                        {/* "IDAG" Badge */}
                        <View className="bg-indigo-500 px-4 py-2 rounded-xl">
                            <Text className="text-white font-bold text-xs tracking-wider">IDAG</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* --- 4. STUDENTS LIST CONTAINER --- */}
            <View className="flex-1">
                {isLoading && <ActivityIndicator size="large" color="#4F46E5" className="mt-10" />}

                {error && <Text className="text-red-500 text-center mt-10">Kunde inte hämta elever.</Text>}

                {!isLoading && !error && (
                    <View className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex-1 ">
                        <FlatList
                            data={students}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item, index }) => (
                                <StudentCard
                                    student={item}
                                    onPress={() => console.log("Klickade på", item.name)}
                                    isLast={index === (students?.length || 0) - 1}
                                />
                            )}

                        />
                    </View>
                )}
            </View>

             {/*  <TouchableOpacity onPress={handleLogout} className="bg-red-50 py-3 rounded-xl items-center">
                <Text className="text-red-600 font-bold">Logga ut</Text>
            </TouchableOpacity> */}
        </SafeAreaView>
    );
}

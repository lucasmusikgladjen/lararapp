import React, { useCallback, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useStudents } from "../../../src/hooks/useStudents";
import { StudentCard } from "../../../src/components/students/StudentCard";
import { PageHeader } from "../../../src/components/ui/DashboardHeader";

export default function StudentsPage() {
    const router = useRouter();

    const { data: students = [], isLoading: loading, error, refetch } = useStudents();

    const [refreshing, setRefreshing] = useState(false);

    const handleStudentPress = (studentId: string) => {
        router.push({
            pathname: "/student/[id]",
            params: { id: studentId },
        });
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    if (loading && !refreshing && students.length === 0) {
        return (
            <View className="flex-1 justify-center items-center bg-brand-bg">
                <ActivityIndicator size="large" color="#F97316" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-brand-bg">
            <View className="flex-1 px-5">
                <PageHeader title="Elever" />
                <Text className="text-2xl font-bold text-brand-text mb-6 mt-4">Mina elever</Text>

                <FlatList
                    data={students}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <View>
                            <StudentCard student={item} onPress={() => handleStudentPress(item.id)} isLast={index === students.length - 1} />
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" colors={["#F97316"]} />}
                    ListEmptyComponent={
                        !loading ? (
                            <View className="mt-10 items-center">
                                <Text className="text-gray-400 text-lg">Du har inga elever än.</Text>
                            </View>
                        ) : null
                    }
                />
            </View>
        </SafeAreaView>
    );
}

import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function StartScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center px-8">
                {/* Brand Header */}
                <View className="items-center mb-16">
                    <View className="w-20 h-20 rounded-full bg-brand-orange items-center justify-center mb-6">
                        <Ionicons name="musical-notes" size={40} color="#fff" />
                    </View>
                    <Text className="text-4xl font-bold text-slate-900">
                        MusikGlädjen
                    </Text>
                    <Text className="text-lg text-gray-400 mt-2">
                        Lärarapp
                    </Text>
                </View>

                {/* Actions */}
                <View className="gap-4">
                    {/* Primary: Register */}
                    <TouchableOpacity
                        onPress={() => router.push("/(public)/register")}
                        className="bg-brand-green p-4 rounded-2xl items-center"
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold text-lg">
                            Börja nu
                        </Text>
                    </TouchableOpacity>

                    {/* Secondary: Login */}
                    <TouchableOpacity
                        onPress={() => router.push("/(public)/login")}
                        className="p-4 rounded-2xl items-center"
                        activeOpacity={0.6}
                    >
                        <Text className="text-slate-800 font-semibold text-base">
                            Har du redan ett konto?{" "}
                            <Text className="text-brand-orange">Logga in</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

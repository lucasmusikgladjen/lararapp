import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function StartScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 px-8 pb-6">
                {/* --- CENTERED HERO UNIT --- */}
                <View className="flex-1 justify-center items-center">
                    {/* --- GRAPHICS SECTION --- */}
                    <View className="items-center justify-center relative mb-12">
                        {/* THE SINGLE RING - Increased to 280px to be visible around the 240px cat */}
                        <View className="w-[240px] h-[240px] rounded-full bg-indigo-50/60 items-center justify-center">
                            {/* Main Circular Image (240px / w-60) */}
                            <View className="w-60 h-60 rounded-full border-[6px] border-white items-center justify-center overflow-hidden bg-white shadow-sm">
                                <Image source={require("../../assets/cat.png")} className="w-full h-full" resizeMode="cover" />
                            </View>
                        </View>

                        {/* Floating Green Star - Pushed further left to be outside the ring */}
                        <View className="absolute top-0 -left-10 w-14 h-14 rounded-full bg-brand-green items-center justify-center z-10 shadow-sm">
                            <Ionicons name="star" size={28} color="#fff" />
                        </View>

                        {/* Floating Orange Note - Pushed further right to be outside the ring */}
                        <View className="absolute bottom-0 -right-10 w-14 h-14 rounded-full bg-brand-orange items-center justify-center z-10 shadow-sm">
                            <Ionicons name="musical-notes" size={26} color="#fff" />
                        </View>
                    </View>

                    {/* --- TEXT SECTION --- */}
                    <View className="items-center">
                        <Text className="text-3xl font-extrabold text-slate-900 tracking-tight text-center">Välkommen till</Text>
                        <Text className="text-3xl font-extrabold text-indigo-600 tracking-tight text-center">Musikglädjen!</Text>

                        <Text className="text-lg text-slate-500 font-medium mt-3 text-center">Lär ut musik. Inspirera.</Text>
                    </View>
                </View>

                {/* --- BUTTONS & FOOTER --- */}
                <View className="w-full gap-3 mt-auto">
                    <TouchableOpacity
                        onPress={() => router.push("/(public)/register")}
                        className="bg-brand-green py-4 rounded-2xl items-center shadow-sm"
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold text-lg">Börja nu</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/(public)/login")}
                        className="bg-slate-100 py-4 rounded-2xl items-center"
                        activeOpacity={0.7}
                    >
                        <Text className="text-slate-600 font-bold text-lg text-center">Jag har redan ett konto</Text>
                    </TouchableOpacity>

                    <Text className="text-center text-[11px] text-slate-400 mt-4 px-6 leading-4">
                        Genom att fortsätta godkänner du våra{"\n"}
                        <Text className="underline text-slate-400 font-semibold">Användarvillkor</Text> &{" "}
                        <Text className="underline text-slate-400 font-semibold">Integritetspolicy.</Text>
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

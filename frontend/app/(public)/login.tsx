import React, { useState } from "react"; // Added useState
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Image, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useLogin } from "../../src/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type LoginFormData = {
    email: string;
    password: string;
};

export default function LoginScreen() {
    const router = useRouter();
    const loginMutation = useLogin();

    // --- NEW: State to track password visibility ---
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate({
            email: data.email,
            password: data.password,
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
                    <View className="flex-1 px-8 pt-20 pb-15">
                        {/* --- TOP CONTENT GROUP --- */}
                        <View className="items-center">
                            {/* --- HERO SECTION --- */}
                            <View className="items-center justify-center relative mb-10">
                                <View className="w-[240px] h-[240px] rounded-full bg-indigo-50/60 items-center justify-center">
                                    <View className="w-60 h-60 rounded-full border-[6px] border-white items-center justify-center overflow-hidden bg-white shadow-sm">
                                        <Image source={require("../../assets/lion.png")} className="w-full h-full" resizeMode="cover" />
                                    </View>
                                </View>

                                {/* Floating Green Star */}
                                <View className="absolute bottom-4 -left-12 w-14 h-14 rounded-full bg-brand-green items-center justify-center z-20 shadow-sm">
                                    <Ionicons name="star" size={28} color="#fff" />
                                </View>

                                {/* Floating Orange Note */}
                                <View className="absolute -top-2 -right-12 w-16 h-16 rounded-full bg-brand-orange items-center justify-center z-20 shadow-sm">
                                    <Ionicons name="musical-notes" size={30} color="#fff" />
                                </View>
                            </View>

                            {/* --- HEADER --- */}
                            <Text className="text-4xl font-black text-slate-900 tracking-tight mb-10">Välkommen!</Text>
                        </View>

                        {/* --- FORM SECTION --- */}
                        <View className="gap-y-5">
                            {/* Email Input */}
                            <View>
                                <Text className="text-slate-900 font-bold text-base mb-1.5 ml-1">E-post</Text>
                                <Controller
                                    control={control}
                                    name="email"
                                    rules={{
                                        required: "E-post krävs",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Ogiltig e-postadress",
                                        },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className={`bg-white px-4 h-[52px] rounded-xl border ${
                                                errors.email ? "border-red-500" : "border-slate-200"
                                            } text-slate-800 text-base`}
                                            placeholder="namn@email.com"
                                            placeholderTextColor="#94a3b8"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            textAlignVertical="center"
                                        />
                                    )}
                                />
                                {errors.email && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</Text>}
                            </View>

                            {/* Password Input */}
                            <View>
                                <Text className="text-slate-900 font-bold text-base mb-1.5 ml-1">Lösenord</Text>
                                <Controller
                                    control={control}
                                    name="password"
                                    rules={{ required: "Lösenord krävs" }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View className="relative justify-center">
                                            <TextInput
                                                // CHANGED: Replaced 'py-3' with 'h-[52px]'
                                                className={`bg-white pl-4 pr-12 h-[52px] rounded-xl border ${
                                                    errors.password ? "border-red-500" : "border-slate-200"
                                                } text-slate-800 text-base`}
                                                placeholder="Lösenord"
                                                placeholderTextColor="#94a3b8"
                                                secureTextEntry={!showPassword}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                textAlignVertical="center"
                                            />
                                            <TouchableOpacity
                                                className="absolute right-4"
                                                onPress={() => setShowPassword(!showPassword)}
                                                activeOpacity={0.7}
                                            >
                                                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#94a3b8" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                                {errors.password && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</Text>}

                                <TouchableOpacity className="mt-2">
                                    <Text className="text-slate-400 text-sm">
                                        Glömt lösenordet? <Text className="text-indigo-600 font-bold underline">Återställ</Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* --- BOTTOM ACTIONS GROUP --- */}
                        <View className="mt-auto pt-1">
                            <TouchableOpacity
                                onPress={handleSubmit(onSubmit)}
                                disabled={loginMutation.isPending}
                                className={`p-5 rounded-3xl items-center shadow-sm ${loginMutation.isPending ? "bg-slate-300" : "bg-brand-green"}`}
                            >
                                {loginMutation.isPending ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text className="text-white font-bold text-xl uppercase">Logga in</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => router.push("/(public)/register")} className="items-center mt-5">
                                <Text className="text-slate-500 text-base">
                                    Inget konto? <Text className="text-indigo-600 font-bold underline">Skapa konto</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

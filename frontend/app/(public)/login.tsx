import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Image,
    ScrollView,
    Modal,
    Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useLogin, useResetPassword } from "../../src/hooks/useAuth";
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
    const resetMutation = useResetPassword();

    const [showPassword, setShowPassword] = useState(false);

    // --- MODAL STATE FÖR ÅTERSTÄLLNING ---
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate({ email: data.email, password: data.password });
    };

    const handleCloseModal = () => {
        setShowResetModal(false);
        setResetEmail("");
        setResetCode("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleResetPassword = () => {
        if (!resetEmail || !resetCode || !newPassword) {
            Alert.alert("Fel", "Vänligen fyll i alla fält.");
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert("Fel", "Lösenordet måste vara minst 6 tecken.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Fel", "Lösenorden matchar inte.");
            return;
        }

        resetMutation.mutate(
            { email: resetEmail, resetCode: resetCode, newPassword: newPassword },
            {
                onSuccess: () => {
                    Alert.alert("Klart!", "Ditt lösenord har uppdaterats. Du kan nu logga in.");
                    handleCloseModal();
                },
                onError: (error: any) => {
                    const msg = error.response?.data?.message || "Ett fel inträffade.";
                    Alert.alert("Fel", msg);
                },
            },
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
                    <View className="flex-1 px-8 pt-20 pb-15">
                        <View className="items-center">
                            <View className="items-center justify-center relative mb-10">
                                <View className="w-[240px] h-[240px] rounded-full bg-indigo-50/60 items-center justify-center">
                                    <View className="w-60 h-60 rounded-full border-[6px] border-white items-center justify-center overflow-hidden bg-white shadow-sm">
                                        <Image source={require("../../assets/lion.png")} className="w-full h-full" resizeMode="cover" />
                                    </View>
                                </View>
                                <View className="absolute bottom-4 -left-12 w-14 h-14 rounded-full bg-brand-green items-center justify-center z-20 shadow-sm">
                                    <Ionicons name="star" size={28} color="#fff" />
                                </View>
                                <View className="absolute -top-2 -right-12 w-16 h-16 rounded-full bg-brand-orange items-center justify-center z-20 shadow-sm">
                                    <Ionicons name="musical-notes" size={30} color="#fff" />
                                </View>
                            </View>
                            <Text className="text-4xl font-black text-slate-900 tracking-tight mb-10">Välkommen!</Text>
                        </View>

                        <View className="gap-y-5">
                            <View>
                                <Text className="text-slate-900 font-bold text-base mb-1.5 ml-1">E-post</Text>
                                <Controller
                                    control={control}
                                    name="email"
                                    rules={{ required: "E-post krävs" }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            className="bg-white px-4 h-[52px] rounded-xl border border-slate-200 text-slate-800 text-base"
                                            placeholder="namn@email.com"
                                            placeholderTextColor="#94a3b8"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                        />
                                    )}
                                />
                            </View>

                            <View>
                                <Text className="text-slate-900 font-bold text-base mb-1.5 ml-1">Lösenord</Text>
                                <Controller
                                    control={control}
                                    name="password"
                                    rules={{ required: "Lösenord krävs" }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View className="relative justify-center">
                                            <TextInput
                                                className="bg-white pl-4 pr-12 h-[52px] rounded-xl border border-slate-200 text-slate-800 text-base"
                                                placeholder="Lösenord"
                                                placeholderTextColor="#94a3b8"
                                                secureTextEntry={!showPassword}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                            <TouchableOpacity className="absolute right-4" onPress={() => setShowPassword(!showPassword)}>
                                                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#94a3b8" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                                <TouchableOpacity className="mt-2" onPress={() => setShowResetModal(true)}>
                                    <Text className="text-slate-400 text-sm">
                                        Glömt lösenordet? <Text className="text-indigo-600 font-bold underline">Återställ</Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="mt-auto pt-1">
                            <TouchableOpacity
                                onPress={handleSubmit(onSubmit)}
                                disabled={loginMutation.isPending}
                                className={`p-5 rounded-3xl items-center shadow-sm ${loginMutation.isPending ? "bg-slate-300" : "bg-brand-green"}`}
                            >
                                {loginMutation.isPending ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text className="text-white font-bold text-xl uppercase tracking-wider">Logga in</Text>
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

            {/* =============== ÅTERSTÄLL LÖSENORD MODAL =============== */}
            <Modal visible={showResetModal} animationType="slide" presentationStyle="formSheet" onRequestClose={handleCloseModal}>
                <View className="flex-1 bg-white">
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                        {/* Lade till mer paddingTop (pt-10) för att trycka ner rubriken */}
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 32, paddingBottom: 40, paddingTop: 40 }}
                            showsVerticalScrollIndicator={false}
                        >
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-3xl font-black text-slate-900 tracking-tight">Återställning</Text>
                                <TouchableOpacity
                                    onPress={handleCloseModal}
                                    className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center active:bg-slate-200"
                                >
                                    <Ionicons name="close" size={24} color="#64748B" />
                                </TouchableOpacity>
                            </View>

                            <Text className="text-slate-500 text-base mb-8 leading-relaxed">
                                Skriv in din e-post, koden du fått av oss och välj ett nytt lösenord.{" "}
                                <Text className="font-bold text-slate-700">Kontakta Musikglädjen för att få en återställningskod.</Text>
                            </Text>

                            <View className="gap-y-5">
                                <View>
                                    <Text className="text-slate-900 font-bold text-base mb-1.5 ml-1">E-post</Text>
                                    <TextInput
                                        className="bg-white px-4 h-[52px] rounded-xl border border-slate-200 text-slate-800 text-base"
                                        placeholder="namn@exempel.se"
                                        placeholderTextColor="#94a3b8"
                                        value={resetEmail}
                                        onChangeText={setResetEmail}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="email-address"
                                    />
                                </View>

                                <View>
                                    <Text className="text-slate-900 font-bold text-base mb-1.5 ml-1">Återställningskod</Text>
                                    <TextInput
                                        className="bg-white px-4 h-[52px] rounded-xl border border-slate-200 text-slate-800 text-base"
                                        placeholder="Ex: Musikgladjen"
                                        placeholderTextColor="#94a3b8"
                                        value={resetCode}
                                        onChangeText={setResetCode}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>

                                <View>
                                    <Text className="text-slate-900 font-bold text-base mb-1.5 ml-1">Nytt lösenord</Text>
                                    <TextInput
                                        className="bg-white px-4 h-[52px] rounded-xl border border-slate-200 text-slate-800 text-base"
                                        placeholder="Minst 6 tecken"
                                        placeholderTextColor="#94a3b8"
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry
                                    />
                                </View>

                                <View>
                                    <Text className="text-slate-900 font-bold text-base mb-1.5 ml-1">Bekräfta lösenord</Text>
                                    <TextInput
                                        className="bg-white px-4 h-[52px] rounded-xl border border-slate-200 text-slate-800 text-base"
                                        placeholder="Skriv lösenordet igen"
                                        placeholderTextColor="#94a3b8"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                    />
                                </View>
                            </View>

                            {/* Denna flex-1 box knuffar ner knappen till botten */}
                            <View className="flex-1 min-h-[40px]" />

                            <View className="mt-auto pt-4">
                                <TouchableOpacity
                                    onPress={handleResetPassword}
                                    disabled={resetMutation.isPending}
                                    className={`py-5 rounded-3xl items-center shadow-sm flex-row justify-center ${resetMutation.isPending ? "bg-slate-300" : "bg-brand-green"}`}
                                >
                                    {resetMutation.isPending ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text className="text-white font-bold text-lg uppercase tracking-wider">Sätt nytt lösenord</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

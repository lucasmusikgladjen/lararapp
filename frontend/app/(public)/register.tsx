import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRegister } from "../../src/hooks/useAuth";
import { CreateTeacherData } from "../../src/types/auth.types";
import ProgressBar from "../../src/components/onboarding/ProgressBar";

// Zod schema matching backend CreateTeacherData validation rules
const registerSchema = z.object({
    name: z.string().min(1, "Namn krävs"),
    email: z.string().email("Ogiltig e-postadress"),
    password: z.string().min(6, "Lösenord måste vara minst 6 tecken"),
    address: z.string().min(1, "Adress krävs"),
    zip: z.string().min(1, "Postnummer krävs"),
    city: z.string().min(1, "Ort krävs"),
    birthYear: z
        .string()
        .length(4, "Födelseår måste vara 4 siffror")
        .regex(/^\d{4}$/, "Födelseår måste vara 4 siffror"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

type FormFieldProps = {
    control: ReturnType<typeof useForm<RegisterFormData>>["control"];
    name: keyof RegisterFormData;
    label: string;
    placeholder: string;
    error?: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "numeric";
    autoCapitalize?: "none" | "sentences" | "words";
};

function FormField({
    control,
    name,
    label,
    placeholder,
    error,
    secureTextEntry,
    keyboardType = "default",
    autoCapitalize = "sentences",
}: FormFieldProps) {
    return (
        <View className="mb-4">
            <Text className="text-slate-700 font-medium mb-1">{label}</Text>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        className={`bg-slate-100 p-4 rounded-xl border ${
                            error ? "border-red-400" : "border-slate-200"
                        } text-slate-800`}
                        placeholder={placeholder}
                        placeholderTextColor="#94a3b8"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={secureTextEntry}
                        keyboardType={keyboardType}
                        autoCapitalize={autoCapitalize}
                    />
                )}
            />
            {error && (
                <Text className="text-red-500 text-sm mt-1">{error}</Text>
            )}
        </View>
    );
}

export default function RegisterScreen() {
    const registerMutation = useRegister();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            address: "",
            zip: "",
            city: "",
            birthYear: "",
        },
    });

    const onSubmit = (data: RegisterFormData) => {
        const payload: CreateTeacherData = {
            name: data.name,
            email: data.email,
            password: data.password,
            address: data.address,
            zip: data.zip,
            city: data.city,
            birthYear: data.birthYear,
        };
        registerMutation.mutate(payload);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1 px-8"
                    contentContainerStyle={{ paddingBottom: 40 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View className="mt-6 mb-6">
                        <Text className="text-2xl font-bold text-slate-900 mb-1">
                            Skapa konto
                        </Text>
                        <Text className="text-sm text-gray-400 mb-4">
                            Steg 1 av 2
                        </Text>
                        <ProgressBar step={1} total={2} />
                    </View>

                    {/* Form Fields */}
                    <FormField
                        control={control}
                        name="name"
                        label="Namn"
                        placeholder="Anna Andersson"
                        error={errors.name?.message}
                        autoCapitalize="words"
                    />

                    <FormField
                        control={control}
                        name="email"
                        label="E-post"
                        placeholder="namn@musikgladjen.se"
                        error={errors.email?.message}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <FormField
                        control={control}
                        name="password"
                        label="Lösenord"
                        placeholder="Minst 6 tecken"
                        error={errors.password?.message}
                        secureTextEntry
                    />

                    <FormField
                        control={control}
                        name="address"
                        label="Adress"
                        placeholder="Storgatan 1"
                        error={errors.address?.message}
                    />

                    {/* Zip + City row */}
                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <FormField
                                control={control}
                                name="zip"
                                label="Postnummer"
                                placeholder="123 45"
                                error={errors.zip?.message}
                                keyboardType="numeric"
                            />
                        </View>
                        <View className="flex-1">
                            <FormField
                                control={control}
                                name="city"
                                label="Ort"
                                placeholder="Stockholm"
                                error={errors.city?.message}
                            />
                        </View>
                    </View>

                    <FormField
                        control={control}
                        name="birthYear"
                        label="Födelseår"
                        placeholder="1990"
                        error={errors.birthYear?.message}
                        keyboardType="numeric"
                    />

                    {/* API Error */}
                    {registerMutation.isError && (
                        <View className="bg-red-50 p-3 rounded-xl mb-4">
                            <Text className="text-red-600 text-sm text-center">
                                {registerMutation.error?.response?.data?.data
                                    ?.errors?.[0]?.msg ||
                                    registerMutation.error?.response?.data
                                        ?.message ||
                                    "Något gick fel. Försök igen."}
                            </Text>
                        </View>
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSubmit(onSubmit)}
                        disabled={registerMutation.isPending}
                        className={`p-4 rounded-2xl items-center ${
                            registerMutation.isPending
                                ? "bg-gray-400"
                                : "bg-brand-green"
                        }`}
                        activeOpacity={0.8}
                    >
                        {registerMutation.isPending ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-white font-bold text-lg">
                                FORTSÄTT
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

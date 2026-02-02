import React from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useLogin } from "../../src/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";


// 1. Define the form data structure
type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  // 2. Initialize our custom login hook
  const loginMutation = useLogin();

  // 3. Initialize React Hook Form
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 4. Function that runs when user presses "Logga in"
  const onSubmit = (data: LoginFormData) => {
    // Call the mutation (this triggers the API call in useAuth.ts)
    loginMutation.mutate({ 
      email: data.email, 
      password: data.password 
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-8"
      >
        {/* --- Header Section --- */}
        <View className="mb-10 items-center">
          <Text className="text-4xl font-bold text-slate-800">MusikGlädjen</Text>
          <Text className="text-slate-500 mt-2 text-lg">Lärarapp</Text>
        </View>

        {/* --- Form Section --- */}
        <View className="space-y-4">
          
          {/* Email Input */}
          <View>
            <Text className="text-slate-700 font-medium mb-1">E-post</Text>
            <Controller
              control={control}
              name="email"
              rules={{ 
                required: "E-post krävs",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Ogiltig e-postadress"
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-slate-800"
                  placeholder="namn@musikgladjen.se"
                  placeholderTextColor="#94a3b8"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              )}
            />
            {/* Error Message for Email */}
            {errors.email && (
              <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>
            )}
          </View>

          {/* Password Input */}
          <View>
            <Text className="text-slate-700 font-medium mb-1">Lösenord</Text>
            <Controller
              control={control}
              name="password"
              rules={{ required: "Lösenord krävs" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-slate-800"
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                />
              )}
            />
            {errors.password && (
              <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>
            )}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={loginMutation.isPending}
            className={`p-4 rounded-xl items-center mt-4 ${
              loginMutation.isPending ? "bg-slate-400" : "bg-indigo-600"
            }`}
          >
            {loginMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Logga in</Text>
            )}
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
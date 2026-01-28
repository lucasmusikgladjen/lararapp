import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";

export default function OnboardingStep1() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <Text className="text-2xl font-bold mb-2">Skapa konto</Text>
      <Text className="text-gray-500 mb-8">Steg 1 av 6</Text>

      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Förnamn"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Efternamn"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="E-post"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6"
        placeholder="Lösenord"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity className="w-full bg-primary py-4 rounded-lg">
        <Text className="text-white text-center font-semibold text-lg">
          Nästa
        </Text>
      </TouchableOpacity>
    </View>
  );
}

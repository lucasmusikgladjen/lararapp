import { View, Text } from "react-native";

export default function FindStudents() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Hitta elever</Text>
      <Text className="text-gray-500 mt-2">Sök efter nya elever i ditt område</Text>
    </View>
  );
}

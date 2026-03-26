import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// --- Shared UI Components ---

export const InputLabel = ({ label, value, editable = true, isLocked = false }: any) => (
    <View>
        <Text className="text-xs font-bold text-slate-400 uppercase mb-1">{label}</Text>
        <View className={`w-full rounded-lg p-3 ${editable ? "bg-white border border-slate-200" : "bg-slate-100"}`}>
            <Text className={`text-sm ${editable ? "text-slate-900" : "text-slate-500"} ${isLocked ? "italic" : ""}`}>{value || "-"}</Text>
        </View>
    </View>
);

export const InputGroup = ({ label, value, onChangeText, placeholder, keyboardType = "default" }: any) => (
    <View>
        <Text className="text-xs font-bold text-slate-400 uppercase mb-1">{label}</Text>
        <TextInput
            className="w-full bg-white border border-slate-200 rounded-lg text-sm p-3 text-slate-900"
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            keyboardType={keyboardType}
        />
    </View>
);

export const SaveButton = ({ onPress, loading }: { onPress: () => void; loading: boolean }) => (
    <View className="flex-row justify-end mt-2">
        <TouchableOpacity onPress={onPress} disabled={loading} className="bg-brand-orange py-2.5 px-6 rounded-xl shadow-sm active:opacity-80">
            {loading ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white text-sm font-bold">Spara</Text>}
        </TouchableOpacity>
    </View>
);

export const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View className="flex-row justify-between items-center bg-white p-3 rounded-lg border border-slate-100">
        <Text className="text-sm font-medium text-slate-900">{label}</Text>
        <Text className="text-sm font-bold text-slate-900">{value}</Text>
    </View>
);

export const StatBox = ({ count, label }: { count: number; label: string }) => (
    <View className="flex-1 bg-white p-3 rounded-xl border border-slate-100 items-center">
        <Text className="text-2xl font-extrabold text-slate-900">{count}</Text>
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</Text>
    </View>
);

export const DocRow = ({ name, date, onPress }: { name: string; date: string; onPress: () => void }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="flex-row items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200"
    >
        <View className="flex-row items-center gap-3.5 overflow-hidden flex-1 mr-3">
            <View className="bg-red-50 size-11 rounded-full items-center justify-center shrink-0">
                <Ionicons name="document-text" size={20} color="#EF4444" />
            </View>

            <View className="flex-1 justify-center">
                <Text className="text-[14px] font-bold text-slate-900 leading-tight" numberOfLines={1}>
                    {name}
                </Text>
                <Text className="text-[11px] font-semibold text-slate-500 mt-0.5">{date}</Text>
            </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#6c757d" />
    </TouchableOpacity>
);

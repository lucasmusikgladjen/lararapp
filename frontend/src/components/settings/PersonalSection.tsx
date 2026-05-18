import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InputGroup, SaveButton } from "./SettingsUI";
import { User } from "../../types/auth.types";

const PRESET_INSTRUMENTS = [
    { label: "Piano",   emoji: "🎹" },
    { label: "Gitarr",  emoji: "🎸" },
    { label: "Sång",    emoji: "🎤" },
    { label: "Fiol",    emoji: "🎻" },
    { label: "Trummor", emoji: "🥁" },
    { label: "Bas",     emoji: "🎵" },
];

interface PersonalSectionProps {
    user: User;
    formData: any;
    setFormData: (data: any) => void;
    handleSave: () => void;
    isSaving: boolean;
}

export const PersonalSection = ({ user, formData, setFormData, handleSave, isSaving }: PersonalSectionProps) => {
    const [customInstrument, setCustomInstrument] = useState("");
    const [showCustomInput, setShowCustomInput] = useState(false);

    const updateField = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const instruments: string[] = Array.isArray(formData.instruments)
        ? formData.instruments
        : typeof formData.instruments === "string" && formData.instruments
        ? formData.instruments.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];

    const toggleInstrument = (label: string) => {
        const next = instruments.includes(label)
            ? instruments.filter((i) => i !== label)
            : [...instruments, label];
        setFormData({ ...formData, instruments: next });
    };

    const addCustom = () => {
        const trimmed = customInstrument.trim();
        if (trimmed && !instruments.includes(trimmed)) {
            setFormData({ ...formData, instruments: [...instruments, trimmed] });
        }
        setCustomInstrument("");
        setShowCustomInput(false);
    };

    const removeInstrument = (label: string) => {
        setFormData({ ...formData, instruments: instruments.filter((i) => i !== label) });
    };

    return (
        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <View className="flex-row items-center mb-6">
                <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                    <Ionicons name="person" size={20} color="#2563EB" />
                </View>
                <Text className="text-lg font-bold text-slate-900">Personuppgifter</Text>
            </View>

            <View className="gap-3">
                <InputGroup label="Namn" value={formData.name} onChangeText={(t: string) => updateField("name", t)} placeholder="Ditt namn" />
                <InputGroup
                    label="E-post"
                    value={formData.email}
                    onChangeText={(t: string) => updateField("email", t)}
                    placeholder="din.email@exempel.se"
                    keyboardType="email-address"
                />
                <InputGroup
                    label="Telefon"
                    value={formData.phone}
                    onChangeText={(t: string) => updateField("phone", t)}
                    placeholder="070-123 45 67"
                    keyboardType="phone-pad"
                />
                <InputGroup
                    label="Personnummer"
                    value={formData.personalNumber}
                    onChangeText={(t: string) => updateField("personalNumber", t)}
                    placeholder="ÅÅMMDDXXXX"
                />

                {/* Instrument multiselect */}
                <View>
                    <Text className="text-sm font-medium text-slate-700 mb-2">Instrument</Text>
                    <View className="flex-row flex-wrap gap-2 mb-2">
                        {PRESET_INSTRUMENTS.map((inst) => {
                            const selected = instruments.includes(inst.label);
                            return (
                                <TouchableOpacity
                                    key={inst.label}
                                    onPress={() => toggleInstrument(inst.label)}
                                    activeOpacity={0.7}
                                    className={`flex-row items-center px-3 py-2 rounded-xl border ${
                                        selected
                                            ? "bg-blue-50 border-blue-300"
                                            : "bg-slate-50 border-slate-200"
                                    }`}
                                >
                                    <Text className="mr-1">{inst.emoji}</Text>
                                    <Text className={`text-sm font-medium ${selected ? "text-blue-700" : "text-slate-600"}`}>
                                        {inst.label}
                                    </Text>
                                    {selected && (
                                        <Ionicons name="checkmark" size={14} color="#1d4ed8" style={{ marginLeft: 4 }} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Custom instruments */}
                    <View className="flex-row flex-wrap gap-2 mb-2">
                        {instruments
                            .filter((i) => !PRESET_INSTRUMENTS.some((p) => p.label === i))
                            .map((inst) => (
                                <TouchableOpacity
                                    key={inst}
                                    onPress={() => removeInstrument(inst)}
                                    activeOpacity={0.7}
                                    className="flex-row items-center bg-slate-100 pl-3 pr-2 py-2 rounded-xl border border-slate-200"
                                >
                                    <Text className="text-sm text-slate-700 font-medium mr-1">{inst}</Text>
                                    <Ionicons name="close-circle" size={15} color="#94a3b8" />
                                </TouchableOpacity>
                            ))}
                        {!showCustomInput && (
                            <TouchableOpacity
                                onPress={() => setShowCustomInput(true)}
                                activeOpacity={0.7}
                                className="px-3 py-2 rounded-xl border border-dashed border-slate-300"
                            >
                                <Text className="text-slate-500 text-sm">+ Annat</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {showCustomInput && (
                        <View className="flex-row items-center gap-2">
                            <TextInput
                                className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 text-sm"
                                placeholder="Annat instrument"
                                placeholderTextColor="#9CA3AF"
                                value={customInstrument}
                                onChangeText={setCustomInstrument}
                                autoFocus
                                onSubmitEditing={addCustom}
                                returnKeyType="done"
                            />
                            <TouchableOpacity onPress={addCustom} className="bg-slate-900 px-4 py-2 rounded-xl">
                                <Text className="text-white text-sm font-semibold">Lägg till</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <InputGroup
                    label="Adress"
                    value={formData.address}
                    onChangeText={(t: string) => updateField("address", t)}
                    placeholder="Gatuadress 12"
                />

                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <InputGroup
                            label="Postnummer"
                            value={formData.zip}
                            onChangeText={(t: string) => updateField("zip", t)}
                            placeholder="123 45"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1">
                        <InputGroup label="Ort" value={formData.city} onChangeText={(t: string) => updateField("city", t)} placeholder="Stad" />
                    </View>
                </View>

                <View className="mt-4">
                    <SaveButton onPress={handleSave} loading={isSaving} />
                </View>
            </View>
        </View>
    );
};

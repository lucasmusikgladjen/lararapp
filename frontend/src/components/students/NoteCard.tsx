import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NoteCardProps {
    title: string;
    value: string | null;
    onSave: (value: string) => void;
    isSaving?: boolean;
    placeholder?: string;
}

export const NoteCard = ({
    title,
    value,
    onSave,
    isSaving = false,
    placeholder = "Skriv här...",
}: NoteCardProps) => {
    const [localValue, setLocalValue] = useState(value || "");
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setLocalValue(value || "");
        setHasChanges(false);
    }, [value]);

    const handleChange = (text: string) => {
        setLocalValue(text);
        setHasChanges(text !== (value || ""));
    };

    const handleSave = () => {
        if (hasChanges && !isSaving) {
            onSave(localValue);
        }
    };

    return (
        <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <Text className="text-base font-bold text-slate-900 mb-3">
                {title}
            </Text>

            <TextInput
                className="bg-gray-50 rounded-xl p-3 text-sm text-slate-800 min-h-[100px] border border-gray-200"
                multiline
                textAlignVertical="top"
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                value={localValue}
                onChangeText={handleChange}
                editable={!isSaving}
            />

            <View className="flex-row justify-end mt-3">
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={!hasChanges || isSaving}
                    className={`flex-row items-center px-4 py-2 rounded-full ${
                        hasChanges && !isSaving
                            ? "bg-brand-green"
                            : "bg-gray-300"
                    }`}
                    activeOpacity={0.8}
                >
                    {isSaving ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <>
                            <Ionicons
                                name="save-outline"
                                size={16}
                                color="white"
                            />
                            <Text className="text-white font-semibold text-sm ml-1.5">
                                Spara
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

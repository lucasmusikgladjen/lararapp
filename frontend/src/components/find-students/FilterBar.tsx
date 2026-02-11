import React from "react";
import { View, TextInput, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { FilterChip } from "../ui/FilterChip";
import { useFindStudentsStore } from "../../store/findStudentsStore";

const INSTRUMENT_OPTIONS = ["Piano", "Gitarr", "Fiol", "Trummor", "Sång", "Övriga"];

export function FilterBar() {
    const insets = useSafeAreaInsets();
    const { searchQuery, setSearchQuery, filter, setFilter } = useFindStudentsStore();

    const handleChipPress = (instrument: string) => {
        const value = instrument.toLowerCase();
        setFilter(filter === value ? null : value);
    };

    return (
        <View
            className="absolute left-0 right-0 px-4"
            style={{ top: insets.top + 4 }}
            pointerEvents="box-none"
        >
            {/* Search Input */}
            <View
                className="flex-row items-center bg-white rounded-xl px-4 py-3"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                }}
            >
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <TextInput
                    className="flex-1 ml-3 text-sm text-slate-900"
                    placeholder="Sök i ditt område"
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                    autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                    <Ionicons
                        name="close-circle"
                        size={20}
                        color="#9CA3AF"
                        onPress={() => setSearchQuery("")}
                    />
                )}
            </View>

            {/* Instrument Filter Chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-3"
                contentContainerStyle={{ paddingRight: 16 }}
            >
                {INSTRUMENT_OPTIONS.map((instrument) => (
                    <FilterChip
                        key={instrument}
                        label={instrument}
                        selected={filter === instrument.toLowerCase()}
                        onPress={() => handleChipPress(instrument)}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

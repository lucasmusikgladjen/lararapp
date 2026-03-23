import React from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FilterChip } from "../ui/FilterChip";
import { useFindStudentsStore } from "../../store/findStudentsStore";

const INSTRUMENT_OPTIONS = ["Piano", "Gitarr", "Fiol", "Trummor", "Sång", "Övriga"];

export function FilterBar() {
    const insets = useSafeAreaInsets();
    const { filter, setFilter } = useFindStudentsStore();

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
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
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

import { useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PageHeaderProps {
    title?: string;
}

export const PageHeader = ({ title }: PageHeaderProps) => {
    // State för att visa/dölja vår informationsruta
    const [isAboutVisible, setIsAboutVisible] = useState(false);

    // Funktion för att öppna länkar (webb, e-post och telefon)
    const openLink = (url: string) => {
        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            }
        });
    };

    return (
        <View className="flex-row items-center justify-between py-3 mb-2 z-50">
            {/* Vinyl Record Logo */}
            <Image source={require("../../../assets/musik-icon.png")} className="w-16 h-12" resizeMode="contain" />

            <Text className="text-xl font-bold text-slate-900">{title}</Text>

            {/* Help Question Icon */}
            <TouchableOpacity activeOpacity={0.7} onPress={() => setIsAboutVisible(true)} className="w-10 h-10 items-center justify-center">
                <Ionicons name="help-circle" size={34} color="#1E293B" />
            </TouchableOpacity>

            {/* "Om Oss" - Modal */}
            <Modal animationType="fade" transparent={true} visible={isAboutVisible} onRequestClose={() => setIsAboutVisible(false)}>
                <View className="flex-1 justify-center items-center bg-black/40 px-5">
                    <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl items-center">
                        {/* Ikon i toppen */}
                        <View className="items-center justify-center my-5">
                            <Image source={require("../../../assets/musikgladjen.png")} className="w-50 h-12" resizeMode="contain" />
                        </View>

                        <Text className="text-justify text-slate-600 leading-relaxed mb-6">
                            Vi skapar den bästa grogrunden för sann musikglädje genom privat hemundervisning. Våra fantastiska lärare utgår alltid
                            från vad eleven faktiskt vill spela!
                        </Text>

                        {/* Klickbara Kontaktuppgifter */}
                        <View className="w-full bg-slate-50 rounded-2xl p-4 gap-y-4 mb-6 border border-slate-100">
                            <TouchableOpacity onPress={() => openLink("https://www.musikgladjen.se")} className="flex-row items-center">
                                <Ionicons name="globe-outline" size={20} color="#64748B" />
                                <Text className="ml-3 text-blue-600 font-semibold text-[15px]">www.musikgladjen.se</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => openLink("mailto:hej@musikgladjen.se")} className="flex-row items-center">
                                <Ionicons name="mail-outline" size={20} color="#64748B" />
                                <Text className="ml-3 text-blue-600 font-semibold text-[15px]">hej@musikgladjen.se</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => openLink("tel:0760223451")} className="flex-row items-center">
                                <Ionicons name="call-outline" size={20} color="#64748B" />
                                <Text className="ml-3 text-blue-600 font-semibold text-[15px]">076-022 34 51</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Stäng-knapp */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setIsAboutVisible(false)}
                            className="bg-[#F97316] w-full py-3.5 rounded-xl items-center"
                        >
                            <Text className="text-white font-bold text-base">Stäng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { PageHeader } from "../../../src/components/ui/PageHeader";
import { authService } from "../../../src/services/auth.service";
import { uploadService } from "../../../src/services/upload.service";
import { useAuthStore } from "../../../src/store/authStore";
import { UpdateProfilePayload } from "../../../src/types/auth.types";

import { BiografiSection } from "../../../src/components/settings/BiografiSection";
import { DocumentsSection } from "../../../src/components/settings/DocumentsSection";
import { PersonalSection } from "../../../src/components/settings/PersonalSection";
import { SalarySection } from "../../../src/components/settings/SalarySection";
import { StudentsSection } from "../../../src/components/settings/StudentsSection";
import { SettingsBackground } from "../../../src/components/ui/SettingsBackground";

type ActiveView = "person" | "lon" | "elever" | "bio" | "docs";

const SETTINGS_TAGS: { id: ActiveView; label: string; activeBackground: string; activeText: string }[] = [
    { id: "person", label: "Personuppgifter", activeBackground: "#DBEAFE", activeText: "#1E40AF" },
    { id: "lon", label: "Lön", activeBackground: "#D1FAE5", activeText: "#065F46" },
    { id: "elever", label: "Elever", activeBackground: "#F3E8FF", activeText: "#6B21A8" },
    { id: "bio", label: "Biografi", activeBackground: "#FFEDD5", activeText: "#9A3412" },
    { id: "docs", label: "Dokument", activeBackground: "#CCFBF1", activeText: "#115E59" },
];

export default function SettingsPage() {
    const router = useRouter();
    const { user, token, logout, updateUser } = useAuthStore();

    const [activeView, setActiveView] = useState<ActiveView>("person");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        personalNumber: user?.personalNumber || "",
        address: user?.address || "",
        zip: user?.zip || "",
        city: user?.city || "",
        bank: user?.bank || "",
        bankAccountNumber: user?.bankAccountNumber || "",
        desiredStudentCount: user?.desiredStudentCount?.toString() || "0",
        bio: user?.bio || "",
        instruments: (user?.instruments || []) as string[] | string,
    });

    useEffect(() => {
        const refreshProfile = async () => {
            if (token) {
                try {
                    const freshUser = await authService.getProfile(token);
                    updateUser(freshUser);
                } catch (error) {
                    console.log("Failed to refresh profile");
                }
            }
        };
        refreshProfile();
    }, [token]);

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                personalNumber: user.personalNumber || "",
                address: user.address || "",
                zip: user.zip || "",
                city: user.city || "",
                bank: user.bank || "",
                bankAccountNumber: user.bankAccountNumber || "",
                desiredStudentCount: user.desiredStudentCount?.toString() || "0",
                bio: user.bio || "",
                instruments: user.instruments || [],
            }));
        }
    }, [user]);

    const handleLogout = async () => {
        Alert.alert("Logga ut", "Är du säker på att du vill logga ut?", [
            { text: "Avbryt", style: "cancel" },
            {
                text: "Logga ut",
                style: "destructive",
                onPress: async () => {
                    await logout();
                    router.replace("/(public)/login");
                },
            },
        ]);
    };

    // Hantera Profilbildsuppladdning
    const handleAvatarUpload = async () => {
        if (!user || !token) return;

        try {
            // Öppna telefonens bildgalleri
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"], // Bara bilder
                allowsEditing: true, // Låt användaren beskära bilden till en fyrkant
                aspect: [1, 1],
                quality: 0.5, // Komprimera lite för att spara utrymme och gå snabbare
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setIsUploadingAvatar(true);
                const imageUri = result.assets[0].uri;

                // Ladda upp till Firebase
                const publicUrl = await uploadService.uploadFile(imageUri, "avatars", user.id);

                // Uppdatera Airtable
                const updatedUser = await authService.updateProfile(token, { profileImageUrl: publicUrl });

                // Uppdatera Zustand
                updateUser(updatedUser);
            }
        } catch (error) {
            console.error("Fel vid bilduppladdning:", error);
            Alert.alert("Fel", "Kunde inte ladda upp bilden. Försök igen.");
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleSave = async (section: "personal" | "students" | "bio" | "salary") => {
        if (!token) return;
        setIsSaving(true);

        try {
            const payload: UpdateProfilePayload = {};
            if (section === "personal") {
                payload.name = formData.name;
                payload.email = formData.email;
                payload.phone = formData.phone;
                payload.personalNumber = formData.personalNumber;
                payload.address = formData.address;
                payload.zip = formData.zip;
                payload.city = formData.city;

                if (typeof formData.instruments === "string") {
                    payload.instruments = formData.instruments
                        .split(",")
                        .map((instrument: string) => instrument.trim())
                        .filter((instrument: string) => instrument !== "");
                } else {
                    payload.instruments = formData.instruments;
                }
            } else if (section === "salary") {
                payload.bank = formData.bank;
                payload.bankAccountNumber = formData.bankAccountNumber;
            } else if (section === "students") {
                payload.desiredStudentCount = parseInt(formData.desiredStudentCount) || 0;
            } else if (section === "bio") {
                payload.bio = formData.bio;
            }

            const updatedUser = await authService.updateProfile(token, payload);
            updateUser(updatedUser);
            Alert.alert("Sparat", "Dina ändringar har sparats!");
        } catch (error) {
            Alert.alert("Fel", "Kunde inte spara ändringar. Försök igen.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return (
            <View className="flex-1 items-center justify-center bg-brand-bg px-5">
                <Text className="text-gray-500 mb-6">Laddar inställningar...</Text>
                <TouchableOpacity
                    onPress={async () => {
                        await logout();
                        router.replace("/(public)/login");
                    }}
                    className="bg-red-500 px-6 py-3 rounded-2xl shadow-sm"
                >
                    <Text className="text-white font-bold">Tvinga utloggning</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const avatarUrl = user.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${user.id}`;

    return (
        <SettingsBackground>
            <SafeAreaView edges={["top"]} className="flex-1">
                <View className="px-5">
                    <PageHeader />
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
                    {/* =============== HERO CARD (Lärarhub) =============== */}
                    <View className="mx-5 bg-white rounded-3xl p-5 shadow-sm mb-6 border border-slate-100 mt-2">
                        {/* Profil Info (Bild, Namn och Bio) */}
                        <View className="flex-row items-start mb-5">
                            {/* 👇 ÄNDRAD: Profilbilden är nu en knapp */}
                            <TouchableOpacity onPress={handleAvatarUpload} disabled={isUploadingAvatar} className="relative mr-4">
                                <View className="w-20 h-20 rounded-full overflow-hidden bg-gray-50 border border-slate-200 items-center justify-center">
                                    {isUploadingAvatar ? (
                                        <ActivityIndicator size="small" color="#F59E0B" />
                                    ) : (
                                        <Image source={{ uri: avatarUrl }} className="w-full h-full" resizeMode="cover" />
                                    )}
                                </View>
                                {/* Liten kamera-ikon som visar att man kan klicka */}
                                <View className="absolute bottom-0 right-0 w-6 h-6 bg-[#F59E0B] rounded-full items-center justify-center border-2 border-white">
                                    <Ionicons name="camera" size={12} color="white" />
                                </View>
                            </TouchableOpacity>

                            <View className="flex-1 pt-1">
                                <Text className="text-xl font-bold text-slate-900">{user.name}</Text>
                                <Text className="text-[13px] text-slate-600 leading-tight" numberOfLines={3}>
                                    {user.bio || "Du har inte lagt till någon biografi ännu. Klicka på 'Biografi' för att berätta mer om dig själv!"}
                                </Text>
                            </View>
                        </View>

                        {/* Navigerings-Tags */}
                        <View className="flex-row flex-wrap gap-2">
                            {SETTINGS_TAGS.map((tag) => {
                                const isActive = activeView === tag.id;
                                return (
                                    <TouchableOpacity
                                        key={tag.id}
                                        onPress={() => setActiveView(tag.id)}
                                        activeOpacity={0.7}
                                        className="px-3 py-1.5 rounded-md border"
                                        style={{
                                            backgroundColor: isActive ? tag.activeBackground : "#FFFFFF",
                                            borderColor: isActive ? "transparent" : "#E2E8F0",
                                            shadowOpacity: isActive ? 0.05 : 0,
                                            shadowRadius: 2,
                                            shadowOffset: { width: 0, height: 1 },
                                        }}
                                    >
                                        <Text className="text-[13px] font-bold" style={{ color: isActive ? tag.activeText : "#64748B" }}>
                                            {tag.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Separator Line */}
                    <View className="h-px bg-slate-300/40 mx-16 mb-6 rounded-full" />

                    {/* =============== DYNAMIC CONTENT AREA =============== */}
                    <View className="px-5">
                        <View style={{ display: activeView === "person" ? "flex" : "none" }}>
                            <PersonalSection
                                user={user}
                                formData={formData}
                                setFormData={setFormData}
                                handleSave={() => handleSave("personal")}
                                isSaving={isSaving}
                            />
                        </View>

                        <View style={{ display: activeView === "lon" ? "flex" : "none" }}>
                            <SalarySection
                                user={user}
                                formData={formData}
                                setFormData={setFormData}
                                handleSave={() => handleSave("salary")}
                                isSaving={isSaving}
                            />
                        </View>

                        <View style={{ display: activeView === "elever" ? "flex" : "none" }}>
                            <StudentsSection user={user} formData={formData} setFormData={setFormData} handleSave={() => handleSave("students")} />
                        </View>

                        <View style={{ display: activeView === "bio" ? "flex" : "none" }}>
                            <BiografiSection formData={formData} setFormData={setFormData} handleSave={() => handleSave("bio")} isSaving={isSaving} />
                        </View>

                        <View style={{ display: activeView === "docs" ? "flex" : "none" }}>
                            <DocumentsSection user={user} />
                        </View>

                        <View className="mt-10 mb-6">
                            <TouchableOpacity
                                onPress={handleLogout}
                                className="w-full bg-[#E35453] flex-row items-center justify-center py-4 rounded-2xl"
                            >
                                <Ionicons name="log-out-outline" size={20} color="white" style={{ marginRight: 8 }} />
                                <Text className="text-white font-bold text-base">Logga ut</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SettingsBackground>
    );
}

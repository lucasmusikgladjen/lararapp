import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageHeader } from "../../../src/components/ui/PageHeader";
import { authService } from "../../../src/services/auth.service";
import { useAuthStore } from "../../../src/store/authStore";
import { UpdateProfilePayload } from "../../../src/types/auth.types";

import { BiografiSection } from "../../../src/components/settings/BiografiSection";
import { DocumentsSection } from "../../../src/components/settings/DocumentsSection";
import { PersonalSection } from "../../../src/components/settings/PersonalSection";
import { SalarySection } from "../../../src/components/settings/SalarySection";
import { StudentsSection } from "../../../src/components/settings/StudentsSection";
import { MainBackground } from "../../../src/components/ui/MainBackground";

type ActiveView = "person" | "lon" | "elever" | "bio" | "docs";

// Färgglada Tags (Samma säkra HEX-logik som Elevhubben)
const SETTINGS_TAGS: { id: ActiveView; label: string; activeBg: string; activeText: string }[] = [
    { id: "person", label: "Personuppgifter", activeBg: "#DBEAFE", activeText: "#1E40AF" }, // Blå
    { id: "lon", label: "Lön", activeBg: "#D1FAE5", activeText: "#065F46" }, // Grön
    { id: "elever", label: "Elever", activeBg: "#F3E8FF", activeText: "#6B21A8" }, // Lila
    { id: "bio", label: "Biografi", activeBg: "#FFEDD5", activeText: "#9A3412" }, // Orange
    { id: "docs", label: "Dokument", activeBg: "#CCFBF1", activeText: "#115E59" }, // Teal
];

export default function SettingsPage() {
    const router = useRouter();
    const { user, token, logout, updateUser } = useAuthStore();

    const [activeView, setActiveView] = useState<ActiveView>("person");
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        zip: user?.zip || "",
        city: user?.city || "",
        bank: user?.bank || "",
        bankAccountNumber: user?.bankAccountNumber || "",
        desiredStudentCount: user?.desiredStudentCount?.toString() || "0",
        bio: user?.bio || "",
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
                address: user.address || "",
                zip: user.zip || "",
                city: user.city || "",
                bank: user.bank || "",
                bankAccountNumber: user.bankAccountNumber || "",
                desiredStudentCount: user.desiredStudentCount?.toString() || "0",
                bio: user.bio || "",
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

    const handleSave = async (section: "personal" | "students" | "bio" | "salary") => {
        if (!token) return;
        setIsSaving(true);

        try {
            const payload: UpdateProfilePayload = {};
            if (section === "personal") {
                payload.name = formData.name; payload.email = formData.email; payload.phone = formData.phone;
                payload.address = formData.address; payload.zip = formData.zip; payload.city = formData.city;
            } else if (section === "salary") {
                payload.bank = formData.bank; payload.bankAccountNumber = formData.bankAccountNumber;
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

                {/* NÖDKNAPP FÖR ATT RENSA KORRUPT STATE I SIMULATORN */}
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
        <SafeAreaView edges={["top"]} className="flex-1 bg-brand-bg">
            <MainBackground>
                <View className="px-5">
                    <PageHeader />
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    
                    {/* =============== HERO CARD (Lärarhub) =============== */}
                    <View className="mx-5 bg-white rounded-3xl p-5 shadow-sm mb-6 border border-slate-100 mt-2">
                        {/* Profil Info (Bild, Namn, Bio) */}
                        <View className="flex-row items-start mb-5">
                            <View className="w-20 h-20 rounded-full overflow-hidden bg-gray-50 border border-slate-200 mr-4">
                                <Image source={{ uri: avatarUrl }} className="w-full h-full" resizeMode="cover" />
                            </View>
                            <View className="flex-1 pt-1">
                                <Text className="text-xl font-bold text-slate-900">{user.name}</Text>
                                <Text className="text-sm font-semibold text-brand-orange mb-2">
                                    {user.instruments && user.instruments.length > 0 ? user.instruments.join(" • ") : "Inga instrument"}
                                </Text>
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
                                        className="px-3 py-1.5 rounded-full border"
                                        style={{
                                            backgroundColor: isActive ? tag.activeBg : "#FFFFFF",
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

                    {/* ---------- DYNAMIC CONTENT AREA ---------- */}
                    <View className="px-5">
                        
                        {/* 1. Personuppgifter */}
                        <View style={{ display: activeView === "person" ? "flex" : "none" }}>
                            <PersonalSection user={user} formData={formData} setFormData={setFormData} handleSave={() => handleSave("personal")} isSaving={isSaving} />
                        </View>

                        {/* 2. Lön */}
                        <View style={{ display: activeView === "lon" ? "flex" : "none" }}>
                            <SalarySection user={user} formData={formData} setFormData={setFormData} handleSave={() => handleSave("salary")} isSaving={isSaving} />
                        </View>

                        {/* 3. Elever */}
                        <View style={{ display: activeView === "elever" ? "flex" : "none" }}>
                            <StudentsSection user={user} formData={formData} setFormData={setFormData} handleSave={() => handleSave("students")} />
                        </View>

                        {/* 4. Biografi */}
                        <View style={{ display: activeView === "bio" ? "flex" : "none" }}>
                            <BiografiSection formData={formData} setFormData={setFormData} handleSave={() => handleSave("bio")} isSaving={isSaving} />
                        </View>

                        {/* 5. Dokument */}
                        <View style={{ display: activeView === "docs" ? "flex" : "none" }}>
                            <DocumentsSection user={user} />
                        </View>

                        {/* Logga Ut Knapp (Alltid synlig längst ner) */}
                        <View className="mt-8">
                            <TouchableOpacity
                                onPress={handleLogout}
                                className="w-full bg-white flex-row items-center justify-center py-4 rounded-2xl shadow-sm border border-red-100"
                            >
                                <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
                                <Text className="text-red-500 font-bold text-base">Logga ut</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </MainBackground>
        </SafeAreaView>
    );
}
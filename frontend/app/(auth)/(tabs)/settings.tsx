import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageHeader } from "../../../src/components/ui/DashboardHeader";
import { authService } from "../../../src/services/auth.service";
import { useAuthStore } from "../../../src/store/authStore";
import { UpdateProfilePayload } from "../../../src/types/auth.types";

import { BiografiSection } from "../../../src/components/settings/BiografiSection";
import { DocumentsSection } from "../../../src/components/settings/DocumentsSection";
import { PersonalSection } from "../../../src/components/settings/PersonalSection";
import { SalarySection } from "../../../src/components/settings/SalarySection";
import { StudentsSection } from "../../../src/components/settings/StudentsSection";

export default function SettingsPage() {
    const router = useRouter();
    const { user, token, logout, updateUser } = useAuthStore();

    // Initialize state with ALL editable fields
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

    const [isSaving, setIsSaving] = useState(false);

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

    // Sync state when user loads
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
                payload.name = formData.name;
                payload.email = formData.email;
                payload.phone = formData.phone;
                payload.address = formData.address;
                payload.zip = formData.zip;
                payload.city = formData.city;
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

    if (!user) return null;

    const avatarUrl = user.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${user.id}`;

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-brand-bg">
            <View className="px-5">
                <PageHeader title="Inställningar" />
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
                {/* Profile Header */}
                <View className="items-center py-6 mb-4">
                    <View className="relative mb-4">
                        <View className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                            <Image source={{ uri: avatarUrl }} className="w-full h-full" resizeMode="cover" />
                        </View>
                        <View className="absolute bottom-0 right-0 bg-brand-orange p-2 rounded-full border-2 border-white shadow-sm">
                            <Ionicons name="pencil" size={14} color="white" />
                        </View>
                    </View>
                    <Text className="text-xl font-bold text-slate-900">{user.name}</Text>

                    <View className="mt-2 flex-row items-center bg-green-100 px-3 py-1 rounded-full">
                        <Text className="text-green-700 text-xs font-bold uppercase tracking-wider">
                            {user.instruments && user.instruments.length > 0 ? user.instruments.join(" • ") : "Inga instrument valda"}
                        </Text>
                    </View>
                </View>

                {/* ========== GROUP 1: KONTO & UPPGIFTER ========== */}
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Konto & Uppgifter</Text>
                <View className="bg-white rounded-2xl overflow-hidden mb-6 shadow-sm">
                    <PersonalSection
                        user={user}
                        formData={formData}
                        setFormData={setFormData}
                        handleSave={() => handleSave("personal")}
                        isSaving={isSaving}
                    />

                    <SalarySection
                        user={user}
                        formData={formData}
                        setFormData={setFormData}
                        handleSave={() => handleSave("salary")}
                        isSaving={isSaving}
                    />
                    <StudentsSection user={user} formData={formData} setFormData={setFormData} handleSave={() => handleSave("students")} />
                </View>

                {/* ========== GROUP 2: INNEHÅLL ========== */}
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Innehåll</Text>
                <View className="bg-white rounded-2xl overflow-hidden mb-6 shadow-sm">
                    <BiografiSection formData={formData} setFormData={setFormData} handleSave={() => handleSave("bio")} isSaving={isSaving} />
                    <DocumentsSection user={user} />
                </View>

                {/* Logout Button */}
                <View className="mb-4">
                    <TouchableOpacity onPress={handleLogout} className="w-full bg-white flex-row items-center justify-center py-4 rounded-2xl shadow-sm border border-gray-100" >
                        <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
                        <Text className="text-red-500 font-bold text-base">Logga ut</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

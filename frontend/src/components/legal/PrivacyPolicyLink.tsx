import { Alert, Linking, Text } from "react-native";
import { PRIVACY_POLICY_URL } from "../../constants/legal";

type PrivacyPolicyLinkProps = {
    className?: string;
    children?: string;
};

export const openPrivacyPolicy = async () => {
    try {
        const canOpen = await Linking.canOpenURL(PRIVACY_POLICY_URL);
        if (!canOpen) {
            throw new Error("Privacy policy URL cannot be opened");
        }
        await Linking.openURL(PRIVACY_POLICY_URL);
    } catch {
        Alert.alert("Kunde inte öppna länken", "Besök musikgladjen.se/integritetspolicy i din webbläsare.");
    }
};

export function PrivacyPolicyLink({ className = "underline text-slate-400 font-semibold", children = "Integritetspolicy" }: PrivacyPolicyLinkProps) {
    return (
        <Text className={className} onPress={openPrivacyPolicy} accessibilityRole="link">
            {children}
        </Text>
    );
}

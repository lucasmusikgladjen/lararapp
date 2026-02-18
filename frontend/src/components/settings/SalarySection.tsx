import { View, Text } from "react-native";
import { AccordionItem } from "../ui/AccordionItem";
import { InfoRow } from "./SettingsUI";
import { User } from "../../types/auth.types";

interface SalarySectionProps {
    user: User;
}

export const SalarySection = ({ user }: SalarySectionProps) => {
    return (
        <AccordionItem title="Löneuppgifter" icon="cash" iconColor="#16A34A" iconBgColor="bg-green-100">
            <View className="gap-1">
                <InfoRow label="Timlön" value={`${user.hourlyWage || 0} kr/timme`} />
                <InfoRow label="Skattesats" value={`${(user.taxRate || 0) * 100}%`} />
                <Text className="text-xs text-slate-500 mt-2">Uppgifterna hämtas från ditt anställningsavtal</Text>
            </View>
        </AccordionItem>
    );
};

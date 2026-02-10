import { View } from "react-native";

type ProgressBarProps = {
    step: number;
    total: number;
};

export default function ProgressBar({ step, total }: ProgressBarProps) {
    const percentage = Math.min((step / total) * 100, 100);

    return (
        <View className="h-2 w-full rounded-full bg-gray-200">
            <View
                className="h-2 rounded-full bg-brand-green"
                style={{ width: `${percentage}%` }}
            />
        </View>
    );
}

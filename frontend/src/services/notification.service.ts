import axios from "axios";
import { NotificationApiResponse, NotificationDTO } from "../types/notification.types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
    console.warn("⚠️ API_URL is not defined in .env! Check your EXPO_PUBLIC_API_URL variable.");
}

/**
 * Hämtar alla aktiva notiser för inloggad lärare.
 * Redan sorterade på backend (Critical -> Warning -> Info).
 */
export const getActiveNotifications = async (token: string): Promise<NotificationDTO[]> => {
    const response = await axios.get<NotificationApiResponse>(`${API_URL}/notifications`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data.data;
};

/**
 * Skickar in formulärsvar och sätter notisen som "resolved".
 */
export const resolveNotification = async (token: string, notificationId: string, answers: Record<string, string>): Promise<void> => {
    await axios.patch(`${API_URL}/notifications/${notificationId}/resolve`, answers, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

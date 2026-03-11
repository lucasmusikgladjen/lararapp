import axios from "axios";
import { NotificationApiResponse, NotificationDTO } from "../types/notification.types";

// const API_URL = "http://localhost:3000/api";
// const API_URL = "http://10.0.2.2:3000/api"; // For Android


// MY HOME (Malmö)
const API_URL = "http://192.168.50.206:3000/api";

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

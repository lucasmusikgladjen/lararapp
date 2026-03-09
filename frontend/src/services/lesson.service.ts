import axios from "axios";
import {
    AdjustLessonPayload,
    AdjustLessonResponse,
    CancelLessonPayload,
    CompleteLessonPayload,
    CreateLessonPayload,
    CreateLessonResponse,
    DeleteFutureLessonsPayload,
    RescheduleLessonPayload,
} from "../types/lesson.types";

const API_URL = "http://localhost:3000/api";
// För demo: const API_URL = "http://192.168.20.20:3000/api";

export const adjustFutureLessons = async (token: string, studentId: string, payload: AdjustLessonPayload): Promise<AdjustLessonResponse> => {
    const response = await axios.patch<AdjustLessonResponse>(`${API_URL}/lessons/adjust/${studentId}`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const createLessons = async (token: string, payload: CreateLessonPayload): Promise<CreateLessonResponse> => {
    const response = await axios.post<CreateLessonResponse>(`${API_URL}/lessons`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteFutureLessons = async (
    token: string,
    studentId: string,
    payload: DeleteFutureLessonsPayload,
): Promise<{ status: string; message: string }> => {
    const response = await axios.delete(`${API_URL}/lessons/future/${studentId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: payload,
    });
    return response.data;
};

export const completeLesson = async (token: string, lessonId: string, payload: CompleteLessonPayload): Promise<any> => {
    const response = await axios.patch(`${API_URL}/lessons/${lessonId}/complete`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const rescheduleLesson = async (token: string, lessonId: string, payload: RescheduleLessonPayload): Promise<any> => {
    const response = await axios.patch(`${API_URL}/lessons/${lessonId}/reschedule`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const cancelLesson = async (token: string, lessonId: string, payload: CancelLessonPayload): Promise<any> => {
    const response = await axios.patch(`${API_URL}/lessons/${lessonId}/cancel`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

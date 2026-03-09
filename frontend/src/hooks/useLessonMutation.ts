import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adjustFutureLessons, cancelLesson, completeLesson, createLessons, deleteFutureLessons, rescheduleLesson } from "../services/lesson.service";
import { useAuthStore } from "../store/authStore";
import { AdjustLessonPayload, CancelLessonPayload, CompleteLessonPayload, CreateLessonPayload, DeleteFutureLessonsPayload, RescheduleLessonPayload } from "../types/lesson.types";

interface UseAdjustLessonsParams {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const useAdjustLessons = ({ onSuccess, onError }: UseAdjustLessonsParams = {}) => {
    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ studentId, payload }: { studentId: string; payload: AdjustLessonPayload }) => {
            if (!token) throw new Error("Ingen token hittades");
            return await adjustFutureLessons(token, studentId, payload);
        },
        onSuccess: (_, variables) => {
            // Tvinga appen att hämta ny student-data (så de nya datumen/tiderna syns direkt i Elev-kortet)
            queryClient.invalidateQueries({ queryKey: ["my-students"] });
            queryClient.invalidateQueries({ queryKey: ["student", variables.studentId] });
            onSuccess?.();
        },
        onError: (error: Error) => {
            console.error("Fail to adjust a lesson:", error);
            onError?.(error);
        },
    });
};

interface UseCreateLessonsParams {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const useCreateLessons = ({ onSuccess, onError }: UseCreateLessonsParams = {}) => {
    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateLessonPayload) => {
            if (!token) throw new Error("Ingen token hittades");
            return await createLessons(token, payload);
        },
        onSuccess: (_, variables) => {
            // Tvinga appen att hämta om elev-datan så de nya lektionerna dyker upp!
            queryClient.invalidateQueries({ queryKey: ["my-students"] });
            queryClient.invalidateQueries({ queryKey: ["student", variables.studentId] });
            onSuccess?.();
        },
        onError: (error: Error) => {
            console.error("Misslyckades att skapa lektioner:", error);
            onError?.(error);
        },
    });
};

interface UseDeleteLessonsParams {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const useDeleteFutureLessons = ({ onSuccess, onError }: UseDeleteLessonsParams = {}) => {
    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ studentId, payload }: { studentId: string; payload: DeleteFutureLessonsPayload }) => {
            if (!token) throw new Error("Ingen token hittades");
            return await deleteFutureLessons(token, studentId, payload);
        },
        onSuccess: (_, variables) => {
            // Tvinga appen att hämta om elev-datan så raderade lektioner försvinner från listorna!
            queryClient.invalidateQueries({ queryKey: ["my-students"] });
            queryClient.invalidateQueries({ queryKey: ["student", variables.studentId] });
            onSuccess?.();
        },
        onError: (error: Error) => {
            console.error("Misslyckades att radera lektioner:", error);
            onError?.(error);
        },
    });
};

interface UseCompleteLessonParams {
    studentId: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const useCompleteLesson = ({ studentId, onSuccess, onError }: UseCompleteLessonParams) => {
    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ lessonId, payload }: { lessonId: string; payload: CompleteLessonPayload }) => {
            if (!token) throw new Error("No token found");
            return await completeLesson(token, lessonId, payload);
        },
        onSuccess: () => {
            // Invalidate the student cache so the UI updates to reflect the completed lesson
            queryClient.invalidateQueries({ queryKey: ["student", studentId] });
            queryClient.invalidateQueries({ queryKey: ["my-students"] });
            onSuccess?.();
        },
        onError: (error: Error) => {
            console.error("Failed to complete lesson:", error);
            onError?.(error);
        },
    });
};

interface UseRescheduleLessonParams {
    studentId: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const useRescheduleLesson = ({ studentId, onSuccess, onError }: UseRescheduleLessonParams) => {
    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ lessonId, payload }: { lessonId: string; payload: RescheduleLessonPayload }) => {
            if (!token) throw new Error("No token found");
            return await rescheduleLesson(token, lessonId, payload);
        },
        onSuccess: () => {
            // Invalidate the cache so the UI updates with the new date/time
            queryClient.invalidateQueries({ queryKey: ["student", studentId] });
            queryClient.invalidateQueries({ queryKey: ["my-students"] });
            onSuccess?.();
        },
        onError: (error: Error) => {
            console.error("Failed to reschedule lesson:", error);
            onError?.(error);
        },
    });
};

interface UseCancelLessonParams {
    studentId: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const useCancelLesson = ({ studentId, onSuccess, onError }: UseCancelLessonParams) => {
    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ lessonId, payload }: { lessonId: string; payload: CancelLessonPayload }) => {
            if (!token) throw new Error("No token found");
            return await cancelLesson(token, lessonId, payload);
        },
        onSuccess: () => {
            // Invalidate the cache to reflect the cancelled status
            queryClient.invalidateQueries({ queryKey: ["student", studentId] });
            queryClient.invalidateQueries({ queryKey: ["my-students"] });
            onSuccess?.();
        },
        onError: (error: Error) => {
            console.error("Failed to cancel lesson:", error);
            onError?.(error);
        },
    });
};

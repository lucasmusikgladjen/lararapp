import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adjustFutureLessons, createLessons, deleteFutureLessons } from "../services/lesson.service";
import { useAuthStore } from "../store/authStore";
import { AdjustLessonPayload, CreateLessonPayload, DeleteFutureLessonsPayload } from "../types/lesson.types";

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

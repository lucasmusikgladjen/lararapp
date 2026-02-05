// frontend/src/hooks/useStudentMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudentInfo } from "../services/student.service";
import { useAuthStore } from "../store/authStore";
import { UpdateStudentPayload, Student } from "../types/student.types";

interface UseUpdateStudentParams {
    studentId: string;
    onSuccess?: (data: Student) => void;
    onError?: (error: Error) => void;
}

export const useUpdateStudent = ({ studentId, onSuccess, onError }: UseUpdateStudentParams) => {
    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateStudentPayload) => {
            if (!token) throw new Error("No token found");
            return await updateStudentInfo(token, studentId, payload);
        },
        onSuccess: (data) => {
            // Invalidate and refetch student queries
            queryClient.invalidateQueries({ queryKey: ["my-students"] });
            queryClient.invalidateQueries({ queryKey: ["student", studentId] });
            onSuccess?.(data);
        },
        onError: (error: Error) => {
            console.error("Failed to update student:", error);
            onError?.(error);
        },
    });
};

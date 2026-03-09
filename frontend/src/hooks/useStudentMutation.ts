import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestToTeachStudent, updateStudentInfo } from "../services/student.service";
import { useAuthStore } from "../store/authStore";
import { RequestToTeachPayload, Student, UpdateStudentPayload } from "../types/student.types";

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

interface UseRequestToTeachParams {
    studentId: string;
    onSuccess?: (data: Student) => void;
    onError?: (error: Error) => void;
}

export const useRequestToTeach = ({ studentId, onSuccess, onError }: UseRequestToTeachParams) => {
    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: RequestToTeachPayload) => {
            if (!token) throw new Error("No token found");
            return await requestToTeachStudent(token, studentId, payload);
        },
        onSuccess: (data) => {
            // Invalidate the search query so the map updates if necessary
            queryClient.invalidateQueries({ queryKey: ["search-students"] });
            onSuccess?.(data);
        },
        onError: (error: any) => {
            console.error("Failed to request to teach student:", error);
            onError?.(error);
        },
    });
};

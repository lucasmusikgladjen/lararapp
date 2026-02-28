import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getActiveNotifications, resolveNotification } from "../services/notification.service";
import { useAuthStore } from "../store/authStore";

export const useNotifications = () => {
    const token = useAuthStore((state) => state.token);

    return useQuery({
        queryKey: ["active-notifications"],
        queryFn: async () => {
            if (!token) throw new Error("No token found");
            return await getActiveNotifications(token);
        },
        enabled: !!token,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};

export const useResolveNotification = () => {
    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, answers }: { id: string; answers: Record<string, string> }) => {
            if (!token) throw new Error("No token found");
            await resolveNotification(token, id, answers);
        },
        onSuccess: () => {
            // Berätta för React Query att ladda om notis-listan så att kortet försvinner från dashboarden!
            queryClient.invalidateQueries({ queryKey: ["active-notifications"] });
        },
    });
};

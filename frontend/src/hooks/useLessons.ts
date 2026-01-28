import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonsService } from "../services/lessons.service";

export function useLessons() {
  const queryClient = useQueryClient();

  const lessonsQuery = useQuery({
    queryKey: ["lessons"],
    queryFn: lessonsService.getLessons,
  });

  const createLessonMutation = useMutation({
    mutationFn: lessonsService.createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });

  return {
    lessons: lessonsQuery.data ?? [],
    isLoading: lessonsQuery.isLoading,
    error: lessonsQuery.error,
    createLesson: createLessonMutation.mutate,
  };
}

import { useQuery } from "@tanstack/react-query";

export function useStudents() {
  const studentsQuery = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      // TODO: Implement API call
      return [];
    },
  });

  return {
    students: studentsQuery.data ?? [],
    isLoading: studentsQuery.isLoading,
    error: studentsQuery.error,
  };
}

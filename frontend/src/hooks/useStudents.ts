// frontend/src/hooks/useStudents.ts
import { useQuery } from "@tanstack/react-query";
import { getMyStudents } from "../services/student.service"; 
import { useAuthStore } from "../store/authStore";

export const useStudents = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["my-students"],
    queryFn: async () => {
      if (!token) throw new Error("No token found");
      return await getMyStudents(token);
    },
    enabled: !!token, 
  });
};
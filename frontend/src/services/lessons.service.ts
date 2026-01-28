const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export interface Lesson {
  id: string;
  studentId: string;
  teacherId: string;
  date: string;
  time: string;
  duration: number;
  instrument: string;
  status: "scheduled" | "completed" | "cancelled";
}

export interface CreateLessonData {
  studentId: string;
  date: string;
  time: string;
  duration: number;
  instrument: string;
  recurring?: boolean;
  endDate?: string;
}

export const lessonsService = {
  async getLessons(): Promise<Lesson[]> {
    const response = await fetch(`${API_URL}/api/lessons`);

    if (!response.ok) {
      throw new Error("Failed to fetch lessons");
    }

    return response.json();
  },

  async createLesson(data: CreateLessonData): Promise<Lesson> {
    const response = await fetch(`${API_URL}/api/lessons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create lesson");
    }

    return response.json();
  },

  async updateLesson(id: string, data: Partial<Lesson>): Promise<Lesson> {
    const response = await fetch(`${API_URL}/api/lessons/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update lesson");
    }

    return response.json();
  },

  async deleteLesson(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/lessons/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete lesson");
    }
  },
};

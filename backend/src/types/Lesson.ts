export interface Lesson {
  id: string;
  teacherId: string;
  studentId: string;
  date: string;
  time: string;
  duration: number; // minutes
  instrument: string;
  status: LessonStatus;
  notes?: string;
  report?: LessonReport;
  createdAt?: Date;
  updatedAt?: Date;
}

export type LessonStatus = "scheduled" | "completed" | "cancelled" | "no_show";

export interface LessonReport {
  content: string;
  progress?: string;
  homework?: string;
  reportedAt: Date;
}

export interface CreateLessonInput {
  studentId: string;
  date: string;
  time: string;
  duration: number;
  instrument: string;
  recurring?: boolean;
  recurringEndDate?: string;
}

export interface UpdateLessonInput {
  date?: string;
  time?: string;
  duration?: number;
  status?: LessonStatus;
  notes?: string;
}

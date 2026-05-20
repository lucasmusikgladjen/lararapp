import { Student } from "../types/student.types";

export type LessonEvent = {
    id: string;
    date: string;
    time: string;
    student: Student;
    daysLeft: number;
    isCompleted: boolean;
    homework: string;
    notes: string;
};

const daysBetween = (todayStr: string, dateStr: string): number => {
    const diff = new Date(dateStr).getTime() - new Date(todayStr).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const toLessonEvent = (student: Student, lesson: Student["lessons"][number], todayStr: string): LessonEvent => ({
    id: lesson.id,
    date: lesson.date,
    time: lesson.time || "Tid saknas",
    student,
    daysLeft: daysBetween(todayStr, lesson.date),
    isCompleted: lesson.isCompleted,
    homework: lesson.homework,
    notes: lesson.notes,
});

export const findNextLesson = (students: Student[]): LessonEvent | null => {
    const todayString = new Date().toISOString().split("T")[0];

    const upcoming: LessonEvent[] = [];
    for (const student of students) {
        for (const lesson of student.lessons ?? []) {
            if (lesson.isCancelled) continue;
            if (!lesson.date || lesson.date < todayString) continue;
            upcoming.push(toLessonEvent(student, lesson, todayString));
        }
    }

    upcoming.sort((a, b) => a.date.localeCompare(b.date));
    return upcoming[0] ?? null;
};

/**
 * Returnerar alla lektionshändelser från alla elever.
 * Används för "Ditt schema"-sektionen (Kommande/Senaste).
 */
export const getAllLessonEvents = (students: Student[]): LessonEvent[] => {
    const todayString = new Date().toISOString().split("T")[0];

    const events: LessonEvent[] = [];
    for (const student of students) {
        for (const lesson of student.lessons ?? []) {
            if (lesson.isCancelled) continue;
            events.push(toLessonEvent(student, lesson, todayString));
        }
    }

    return events;
};

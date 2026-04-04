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

export const findNextLesson = (students: Student[]): LessonEvent | null => {
    const allLessons: LessonEvent[] = [];

    // Skapa dagens datum som sträng "YYYY-MM-DD"
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    students.forEach((student) => {
        if (!student.upcomingLessons) return;

        // Vi använder 'index' för att hitta matchande tid och ID
        student.upcomingLessons.forEach((dateString, index) => {
            const isCancelled = student.upcomingLessonCancelled?.[index] || false;
            const homeworkString = student.upcomingLessonHomework?.[index] || "";
            const notesString = student.upcomingLessonNotes?.[index] || "";

            if (isCancelled) return;

            if (dateString >= todayString) {
                // Hämta tiden på samma position (eller defaulta till "Tid saknas")
                const timeString = student.upcomingLessonTimes?.[index] || "Tid saknas";

                // Hämta det riktiga Airtable Record ID:t (t.ex. "recbF22f1uVMBAOka")
                const realLessonId = student.upcomingLessonIds?.[index] || "";

                const dateA = new Date(todayString);
                const dateB = new Date(dateString);
                const diffTime = dateB.getTime() - dateA.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                allLessons.push({
                    id: realLessonId,
                    date: dateString,
                    time: timeString,
                    student: student,
                    daysLeft: diffDays,
                    isCompleted: false,
                    homework: homeworkString,
                    notes: notesString,
                });
            }
        });
    });

    // Sortera på datum
    allLessons.sort((a, b) => a.date.localeCompare(b.date));

    return allLessons.length > 0 ? allLessons[0] : null;
};

/**
 * Returnerar alla lektionshändelser från alla elever.
 * Används för "Ditt schema"-sektionen (Kommande/Senaste).
 */
export const getAllLessonEvents = (students: Student[]): LessonEvent[] => {
    const allLessons: LessonEvent[] = [];

    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    students.forEach((student) => {
        if (!student.upcomingLessons) return;

        student.upcomingLessons.forEach((dateString, index) => {
            const isCancelled = student.upcomingLessonCancelled?.[index] || false;
            const homeworkString = student.upcomingLessonHomework?.[index] || "";
            const notesString = student.upcomingLessonNotes?.[index] || "";

            if (isCancelled) return;
            const timeString = student.upcomingLessonTimes?.[index] || "Tid saknas";

            // Hämta det riktiga Airtable Record ID:t
            const realLessonId = student.upcomingLessonIds?.[index] || "";

            const isCompleted = student.upcomingLessonCompleted?.[index] || false;

            const dateA = new Date(todayString);
            const dateB = new Date(dateString);
            const diffTime = dateB.getTime() - dateA.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            allLessons.push({
                id: realLessonId,
                date: dateString,
                time: timeString,
                student,
                daysLeft: diffDays,
                isCompleted: isCompleted,
                homework: homeworkString,
                notes: notesString,
            });
        });
    });

    return allLessons;
};

import Debug from "debug";
import { Request, Response } from "express";
import { getAllStudents, getStudentsByTeacher, updateStudent } from "../services/student_service";

const debug = Debug("musikgladjen:studentController");

/**
 * GET /students
 * Retrieve students.
 * If logged in as a teacher, returns ONLY that teacher's students.
 */
export const index = async (req: Request, res: Response) => {
    try {
        const teacherName = req.user?.name ? req.user.name.split(" ")[0] : null;

        let students;

        if (teacherName) {
            debug(`Fetching students for teacher: ${teacherName}`);
            // Anropa din nya funktion!
            students = await getStudentsByTeacher(teacherName);
        } else {
            // Fallback om något är fel med token (eller om admin vill se alla, beroende på logik)
            debug("No teacher name found in token, fetching all students");
            students = await getAllStudents();
        }

        res.send({
            status: "success",
            data: students,
        });
    } catch (error) {
        debug("Error when trying to get students: %O", error);
        res.status(500).send({
            message: "Error fetching students",
            error: (error as Error).message,
        });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const { kommentar, terminsmal } = req.body;

        debug(`Updating student ${id}. Notes: ${kommentar}, Goals: ${terminsmal}`);
        
        const updatedStudent = await updateStudent(id, { kommentar, terminsmal });

        res.send({
            status: "success",
            data: updatedStudent,
        });
    } catch (error) {
        debug("Error when updating student: %O", error);
        res.status(500).send({
            message: "Error updating student",
            error: (error as Error).message,
        });
    }
};

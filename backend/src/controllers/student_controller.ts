import Debug from "debug";
import { Request, Response } from "express";
import { findStudents, getAllStudents, getStudentsByTeacher, updateStudent } from "../services/student_service";
import { GetStudentsQuery } from "../types/Student.types";

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

export const search = async (req: Request, res: Response) => {
    try {
        // Typsäkra parametrarna från URL:en
        const query: GetStudentsQuery = {
            city: req.query.city as string,
            instrument: req.query.instrument as string,
            lat: req.query.lat as string,
            lng: req.query.lng as string,
            radius: req.query.radius as string,
        };

        // debug(`Searching students with params: %O`, query);

        const students = await findStudents(query);

        res.send({
            status: "success",
            count: students.length,
            data: students,
        });
    } catch (error) {
        debug("Error searching students: %O", error);
        res.status(500).send({
            message: "Error searching students",
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

import Debug from "debug";
import { Request, Response } from "express";
import { findStudents, getAllStudents, getStudentsByTeacher, requestToTeachStudent, updateStudent } from "../services/student_service";
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
        // Extract teacher ID from the JWT token
        const teacherId = req.user?.id;

        // Typsäkra parametrarna från URL:en
        const query: GetStudentsQuery = {
            city: req.query.city as string,
            instrument: req.query.instrument as string,
            lat: req.query.lat as string,
            lng: req.query.lng as string,
            radius: req.query.radius as string,
            teacherId: teacherId,
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
        const { kommentar, terminsmal, standardLayout, lessonDay, lessonTimeHHMM } = req.body;

        debug(`Updating student ${id}. Notes: ${kommentar}, Goals: ${terminsmal}`);

        const updatedStudent = await updateStudent(id, {
            kommentar,
            terminsmal,
        });

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

export const requestToTeach = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const { message } = req.body;

        // Extract teacher details from the JWT token injected by the auth middleware
        const teacherId = req.user?.id;
        const teacherName = req.user?.name || "Unknown Teacher";

        if (!teacherId) {
            return res.status(401).send({ status: "fail", message: "Unauthorized: Missing teacher ID in token" });
        }

        debug(`Teacher ${teacherName} (${teacherId}) applying for student ${id}`);

        const result = await requestToTeachStudent(id, {
            teacherId,
            teacherName: teacherName || "Unknown Teacher",
            message,
        });

        res.send({
            status: "success",
            data: result,
        });
    } catch (error) {
        const msg = (error as Error).message;
        debug("Error when applying for student: %O", error);

        if (msg === "You have already sent a request for this student") {
            return res.status(400).send({
                status: "fail",
                message: msg,
                error: msg,
            });
        }

        res.status(500).send({
            status: "fail",
            message: "Error applying for student",
            error: msg,
        });
    }
};

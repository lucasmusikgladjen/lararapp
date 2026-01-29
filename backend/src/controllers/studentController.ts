import Debug from "debug";
import { Request, Response } from "express";
import { getAllStudents } from "../services/studentService";

const debug = Debug("musikgladjen:studentController");

/**
 * GET /students
 * 
 * Retrieve all students.
 * Returns a list of students.
 */
export const index = async (req: Request, res: Response) => {
    try {
        const students = await getAllStudents();
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

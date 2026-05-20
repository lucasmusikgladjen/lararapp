import Debug from "debug";
import { getTeacherById } from "./teacher_service";
import type { Teacher } from "../types/Teacher.types";

const debug = Debug("musikgladjen:teacherStatus");

export const TEACHER_STATUS_ENDED = "Slutat";

export class TeacherInactiveError extends Error {
    constructor(message = "Teacher account is no longer active") {
        super(message);
        this.name = "TeacherInactiveError";
    }
}

export const isTeacherActive = (status: Teacher["status"] | undefined | null): boolean => {
    return status !== TEACHER_STATUS_ENDED;
};

type CacheEntry = { active: boolean; expiresAt: number };
const CACHE_TTL_MS = 60_000;
const cache = new Map<string, CacheEntry>();

export const __clearTeacherStatusCache = () => cache.clear();

/**
 * Fetches the teacher by id and throws TeacherInactiveError if their status is "Slutat".
 * Result is cached for 60s per id to limit Airtable load. Admin changes propagate within a minute.
 */
export const assertTeacherActiveById = async (id: string): Promise<void> => {
    const now = Date.now();
    const cached = cache.get(id);

    if (cached && cached.expiresAt > now) {
        if (!cached.active) {
            throw new TeacherInactiveError();
        }
        return;
    }

    const teacher = await getTeacherById(id);

    if (!teacher) {
        cache.delete(id);
        throw new TeacherInactiveError("Teacher not found");
    }

    const active = isTeacherActive(teacher.status);
    cache.set(id, { active, expiresAt: now + CACHE_TTL_MS });

    if (!active) {
        debug("Teacher %s blocked: status=%s", id, teacher.status);
        throw new TeacherInactiveError();
    }
};

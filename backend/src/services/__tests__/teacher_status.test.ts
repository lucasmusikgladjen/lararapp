import {
    isTeacherActive,
    assertTeacherActiveById,
    TeacherInactiveError,
    __clearTeacherStatusCache,
} from "../teacher_status";

jest.mock("../teacher_service", () => ({
    getTeacherById: jest.fn(),
}));

import { getTeacherById } from "../teacher_service";

const getTeacherByIdMock = getTeacherById as jest.MockedFunction<typeof getTeacherById>;

const makeTeacher = (status?: "Aktiv" | "Paus" | "Slutat") =>
    ({
        id: "rec123",
        name: "Test",
        email: "t@example.com",
        studentIds: [],
        pendingStudentIds: [],
        profileImageUrl: "",
        instruments: [],
        documents: [],
        status,
    }) as any;

beforeEach(() => {
    __clearTeacherStatusCache();
    getTeacherByIdMock.mockReset();
});

describe("isTeacherActive", () => {
    it("returns true for Aktiv", () => {
        expect(isTeacherActive("Aktiv")).toBe(true);
    });

    it("returns true for Paus (paus blocks elsewhere, not here)", () => {
        expect(isTeacherActive("Paus")).toBe(true);
    });

    it("returns true when status is missing", () => {
        expect(isTeacherActive(undefined)).toBe(true);
        expect(isTeacherActive(null)).toBe(true);
    });

    it("returns false only for exactly Slutat", () => {
        expect(isTeacherActive("Slutat")).toBe(false);
    });
});

describe("assertTeacherActiveById", () => {
    it("resolves when the teacher is active", async () => {
        getTeacherByIdMock.mockResolvedValueOnce(makeTeacher("Aktiv"));
        await expect(assertTeacherActiveById("rec123")).resolves.toBeUndefined();
    });

    it("throws TeacherInactiveError when status is Slutat", async () => {
        getTeacherByIdMock.mockResolvedValueOnce(makeTeacher("Slutat"));
        await expect(assertTeacherActiveById("rec123")).rejects.toBeInstanceOf(TeacherInactiveError);
    });

    it("throws TeacherInactiveError when teacher is not found", async () => {
        getTeacherByIdMock.mockResolvedValueOnce(null);
        await expect(assertTeacherActiveById("rec123")).rejects.toBeInstanceOf(TeacherInactiveError);
    });

    it("caches the active result and does not call Airtable twice within TTL", async () => {
        getTeacherByIdMock.mockResolvedValueOnce(makeTeacher("Aktiv"));
        await assertTeacherActiveById("rec123");
        await assertTeacherActiveById("rec123");
        expect(getTeacherByIdMock).toHaveBeenCalledTimes(1);
    });

    it("caches the inactive result and keeps blocking within TTL", async () => {
        getTeacherByIdMock.mockResolvedValueOnce(makeTeacher("Slutat"));
        await expect(assertTeacherActiveById("rec123")).rejects.toBeInstanceOf(TeacherInactiveError);
        await expect(assertTeacherActiveById("rec123")).rejects.toBeInstanceOf(TeacherInactiveError);
        expect(getTeacherByIdMock).toHaveBeenCalledTimes(1);
    });
});

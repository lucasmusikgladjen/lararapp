import { get, patch, getAllRecords } from "./airtable";
import type { AirtableResponse } from "../types/Teacher.types";
import { AirtableNotificationRecord, AirtableNotificationTemplate, NotificationDTO } from "../types/Notification.types";

const TBL_NOTIFICATIONS = "tblu5XzB4HAFPbNGh";
const TBL_TEMPLATES = "tblui1WgqdfGeLfjc";

const mapToNotificationDTO = (notif: AirtableNotificationRecord, template: AirtableNotificationTemplate): NotificationDTO => {
    const n = notif.fields;
    const t = template.fields;

    // I Airtable är en okryssad ruta "undefined".
    const resolveBool = (overrideVal?: boolean, defaultVal?: boolean) => {
        if (overrideVal !== undefined) return overrideVal;
        return defaultVal === true;
    };

    const imageUrl = n.Image && n.Image.length > 0 ? n.Image[0].url : undefined;

    return {
        id: notif.id,
        status: n.Status || "active",
        createdAt: notif.createdTime,

        card: {
            title: n["Card Title"] || t["Default Card Title"] || "Ny Notis",
            description: n["Card Description"] || t["Default Card Description"] || "",
            severity: n.Severity || t["Default Severity"] || "info",
            color: n.Color || t["Default Color"] || "#4B96F8",
        },

        actionPage: {
            // Booleans (visningsregler)
            showText: resolveBool(n["Override Show Text"], t["Show Text"]),
            showImage: resolveBool(n["Override Show Image"], t["Show Image"]),
            showConfirmButtons: resolveBool(n["Override Show Confirm & Question Buttons"], t["Show Confirm & Question Buttons"]),
            showLessonReportList: resolveBool(n["Override Show Lesson Report List"], t["Show Lesson Report List"]),
            showFileUpload: resolveBool(n["Override Show File Upload"], t["Show File Upload"]),
            showChecklist: resolveBool(n["Override Show Checklist"], t["Show Checklist"]),
            showSubmitButton: resolveBool(n["Override Show Form Submit Button"], t["Show Form Submit Button"]),

            showFormFields: {
                field1: resolveBool(n["Override Show Form Field 1"], t["Show Form Field 1"]),
                field2: resolveBool(n["Override Show Form Field 2"], t["Show Form Field 2"]),
                field3: resolveBool(n["Override Show Form Field 3"], t["Show Form Field 3"]),
                field4: resolveBool(n["Override Show Form Field 4"], t["Show Form Field 4"]),
            },

            // Content
            content: {
                h1: n["H1"] || t["Default H1"] || "",
                bodyText: n["Body Text"] || t["Default Body Text"] || "",
                imageUrl: imageUrl,
                checklistItems: t["Default Checklist Items"] ? t["Default Checklist Items"].split("\n").filter((i) => i.trim() !== "") : [],
                submitButtonText: t["Default Form Submit Button Text"] || "Skicka",
                confirmButtonText: t["Default Confirm Button Text"] || "Bekräfta",
                documentType: n["Document Type"],
                formFieldLabels: {
                    field1: t["Default Form Field 1 Label"] || "",
                    field2: t["Default Form Field 2 Label"] || "",
                    field3: t["Default Form Field 3 Label"] || "",
                    field4: t["Default Form Field 4 Label"] || "",
                },
            },

            // Relaterad data
            relatedLessonIds: n.Lessons || [],
            relatedStudentIds: n.Student || [],
        },
    };
};

export const getActiveNotificationsForTeacher = async (teacherId: string): Promise<NotificationDTO[]> => {
    const formula = `Status = 'active'`;
    const encodedFormula = encodeURIComponent(formula);

    const notifResponse = await get<AirtableResponse<AirtableNotificationRecord>>(`/${TBL_NOTIFICATIONS}?filterByFormula=${encodedFormula}`);

    if (notifResponse.records.length === 0) {
        return [];
    }

    // I API-svaret är notif.fields.Teacher alltid en array av ID:n, t.ex. ["recJAOOjal..."]
    const myNotifications = notifResponse.records.filter((notif) => {
        const linkedTeachers = notif.fields.Teacher || [];
        return linkedTeachers.includes(teacherId);
    });

    if (myNotifications.length === 0) {
        return [];
    }

    const templatesResponse = await getAllRecords<AirtableResponse<AirtableNotificationTemplate>>(`/${TBL_TEMPLATES}`);
    const templates = templatesResponse.records;

    const dtoPromises = myNotifications.map((notif) => {
        const templateId = notif.fields.Template?.[0];
        const template = templates.find((t) => t.id === templateId);

        if (!template) {
            console.warn(`Template missing for notification ${notif.id}`);
            return null;
        }

        return mapToNotificationDTO(notif, template);
    });

    const mappedNotifications = dtoPromises.filter(Boolean) as NotificationDTO[];

    // ---  SORTERINGSLOGIK ---
    
    // 1. Definiera poängsystemet för Severity
    const severityWeight: Record<string, number> = {
        critical: 3,
        warning: 2,
        info: 1
    };

    // 2. Sortera listan
    mappedNotifications.sort((a, b) => {
        const weightA = severityWeight[a.card.severity] || 0;
        const weightB = severityWeight[b.card.severity] || 0;

        // Om de har olika severity, lägg den med högst poäng först
        if (weightA !== weightB) {
            return weightB - weightA;
        }

        // Om de har samma severity, sortera på datum (nyast överst)
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
    });

    return mappedNotifications;
};

export const resolveNotification = async (notificationId: string, answers: Record<string, any>) => {
    const fieldsToUpdate: Record<string, any> = {
        Status: "resolved",
    };

    if (answers.formField1) fieldsToUpdate["Form Field 1 Answer"] = answers.formField1;
    if (answers.formField2) fieldsToUpdate["Form Field 2 Answer"] = answers.formField2;
    if (answers.formField3) fieldsToUpdate["Form Field 3 Answer"] = answers.formField3;
    if (answers.formField4) fieldsToUpdate["Form Field 4 Answer"] = answers.formField4;

    const response = await patch<AirtableNotificationRecord>(`/${TBL_NOTIFICATIONS}/${notificationId}`, fieldsToUpdate);
    return response;
};

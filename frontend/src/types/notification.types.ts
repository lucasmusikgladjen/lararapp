export type NotificationSeverity = "critical" | "warning" | "info";

export interface NotificationDTO {
    id: string;
    status: string;
    createdAt: string;

    // Kortet på Dashboarden
    card: {
        title: string;
        description: string;
        severity: NotificationSeverity;
        color: string;
    };

    actionPage: {
        showText: boolean;
        showImage: boolean;
        showConfirmButtons: boolean;
        showLessonReportList: boolean;
        showFileUpload: boolean;
        showChecklist: boolean;
        showSubmitButton: boolean;
        showFormFields: {
            field1: boolean;
            field2: boolean;
            field3: boolean;
            field4: boolean;
        };

        content: {
            h1: string;
            bodyText: string;
            imageUrl?: string;
            checklistItems: string[];
            submitButtonText: string;
            confirmButtonText: string;
            documentType?: string;
            formFieldLabels: {
                field1: string;
                field2: string;
                field3: string;
                field4: string;
            };
        };

        relatedLessonIds: string[];
        relatedStudentIds: string[];
    };
}

export interface NotificationApiResponse {
    status: "success" | "fail";
    data: NotificationDTO[];
}

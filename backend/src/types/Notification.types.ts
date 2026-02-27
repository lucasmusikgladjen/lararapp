export type AirtableNotificationTemplate = {
    id: string;
    fields: {
        "Template ID"?: string;
        "Template Name"?: string;
        "Default Card Title"?: string;
        "Default Card Description"?: string;
        "Default Severity"?: "critical" | "warning" | "info";
        "Default Color"?: string;
        
        "Show Text"?: boolean;
        "Show Image"?: boolean;
        "Show Confirm & Question Buttons"?: boolean;
        "Show Lesson Report List"?: boolean;
        "Show File Upload"?: boolean;
        "Show Checklist"?: boolean;
        "Show Form Field 1"?: boolean;
        "Show Form Field 2"?: boolean;
        "Show Form Field 3"?: boolean;
        "Show Form Field 4"?: boolean;
        "Show Form Submit Button"?: boolean;
        
        "Default H1"?: string;
        "Default Body Text"?: string;
        "Default Checklist Items"?: string;
        "Default Form Field 1 Label"?: string;
        "Default Form Field 2 Label"?: string;
        "Default Form Field 3 Label"?: string;
        "Default Form Field 4 Label"?: string;
        "Default Form Submit Button Text"?: string;
        "Default Confirm Button Text"?: string;
    };
};

export type AirtableNotificationRecord = {
    id: string;
    createdTime: string;
    fields: {
        "Notification ID"?: number;
        "Teacher"?: string[]; // Linked record
        "Template"?: string[]; // Linked record
        "Status"?: "active" | "resolved";
        "Created At"?: string;
        "Resolved At"?: string;
        
        "Card Title"?: string;
        "Card Description"?: string;
        "Severity"?: "critical" | "warning" | "info";
        "Color"?: string;
        
        "H1"?: string;
        "Body Text"?: string;
        "Image"?: any[]; // Attachment
        
        "Override Show Text"?: boolean;
        "Override Show Image"?: boolean;
        "Override Show Confirm & Question Buttons"?: boolean;
        "Override Show Lesson Report List"?: boolean;
        "Override Show File Upload"?: boolean;
        "Override Show Checklist"?: boolean;
        "Override Show Form Field 1"?: boolean;
        "Override Show Form Field 2"?: boolean;
        "Override Show Form Field 3"?: boolean;
        "Override Show Form Field 4"?: boolean;
        "Override Show Form Submit Button"?: boolean;
        
        "Lessons"?: string[];
        "Student"?: string[];
        "Document Type"?: string;
        
        "Form Field 1 Answer"?: string;
        "Form Field 2 Answer"?: string;
        "Form Field 3 Answer"?: string;
        "Form Field 4 Answer"?: string;
        "Uploaded File"?: any[]; // Attachment
    };
};

// DTO: Det rena objektet vi skickar till React Native App
export type NotificationDTO = {
    id: string;
    status: string;
    createdAt: string;
    
    // Kortet på Dashboarden
    card: {
        title: string;
        description: string;
        severity: "critical" | "warning" | "info";
        color: string;
    };

    // Actionsidan (Villkor och Innehåll)
    actionPage: {
        showText: boolean;
        showImage: boolean;
        showConfirmButtons: boolean;
        showLessonReportList: boolean;
        showFileUpload: boolean;
        showChecklist: boolean;
        showFormFields: {
            field1: boolean;
            field2: boolean;
            field3: boolean;
            field4: boolean;
        };
        showSubmitButton: boolean;

        content: {
            h1: string;
            bodyText: string;
            imageUrl?: string;
            checklistItems: string[];
            formFieldLabels: {
                field1: string;
                field2: string;
                field3: string;
                field4: string;
            };
            submitButtonText: string;
            confirmButtonText: string;
            documentType?: string;
        };

        // Relaterad data
        relatedLessonIds: string[];
        relatedStudentIds: string[];
    };
};
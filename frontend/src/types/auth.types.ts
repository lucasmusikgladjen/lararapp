export type TeacherDocument = {
    name: string;
    url: string;
    type: "contract" | "tax-adjustment" | "criminal-record";
};

export type User = {
    id: string;
    name: string;
    email: string;
    studentIds: string[];
    profileImageUrl?: string;
    status: "Aktiv" | "Paus" | "Slutat" | string;

    // Address
    address?: string;
    zip?: string;
    city?: string;

    // Personal & Contact
    birthYear?: string;
    personalNumber?: string; // Read-only in UI
    phone?: string;

    // Professional
    bio?: string;
    instruments: string[];
    desiredStudentCount?: number;

    // Financial (Read-only)
    bank?: string;
    bankAccountNumber?: string;
    hourlyWage?: number;
    taxRate?: number;

    // Documents (Read-only)
    documents: TeacherDocument[];
};

export type LoginResponse = {
    status: "success" | "fail";
    data: {
        access_token: string;
        user: User;
    };
};

export type RegisterResponse = {
    status: "success" | "fail";
    data: {
        access_token: string;
        user: User;
    };
};

export type CreateTeacherData = {
    name: string;
    email: string;
    password: string;
    address: string;
    zip: string;
    city: string;
    birthYear: string;
};

// Payload for PATCH /api/profile
// We use Partial<User> to allow updating single fields, but we exclude read-only arrays/objects like documents/studentIds from the type hint to avoid confusion
export type UpdateProfilePayload = {
    name?: string;
    email?: string;
    address?: string;
    zip?: string;
    city?: string;
    phone?: string;
    bank?: string;
    bankAccountNumber?: string;
    bio?: string;
    instruments?: string[];
    desiredStudentCount?: number;
};

export type AuthState = {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    needsOnboarding: boolean;
    login: (token: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
    loadUser: () => Promise<void>;
    setNeedsOnboarding: (value: boolean) => void;
    updateUser: (userData: Partial<User>) => void;
};

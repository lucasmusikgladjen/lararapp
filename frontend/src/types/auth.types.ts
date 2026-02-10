export type User = {
    id: string;
    name: string;
    email: string;
    studentIds: string[];
    profileImageUrl?: string;
    status?: string;
};

export type LoginResponse = {
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

export type RegisterResponse = {
    status: "success" | "fail";
    data: {
        access_token: string;
        user: User;
    };
};

export type UpdateProfilePayload = {
    instruments: string[];
};

export type AuthState = {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
    loadUser: () => Promise<void>;
};

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

export type AuthState = {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
};

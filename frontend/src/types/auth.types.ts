export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  instruments: string[];
  profileImage?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  instruments: string[];
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
  };
  birthDate?: string;
  personalNumber?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  namn: string;
  instruments: string[];
  iat: number;
  exp: number;
}

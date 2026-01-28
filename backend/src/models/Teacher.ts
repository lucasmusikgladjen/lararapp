export interface Teacher {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  instruments: string[];
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
  };
  profileImage?: string;
  birthDate?: string;
  personalNumber?: string;
  directionsCount?: number;
  directionsResetTime?: Date;
  pushToken?: string;
  lastLogin?: Date;
  createdAt?: Date;
}

export interface TeacherPublic {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  instruments: string[];
  phone?: string;
  profileImage?: string;
}

export function toPublicTeacher(teacher: Teacher): TeacherPublic {
  return {
    id: teacher.id,
    email: teacher.email,
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    instruments: teacher.instruments,
    phone: teacher.phone,
    profileImage: teacher.profileImage,
  };
}

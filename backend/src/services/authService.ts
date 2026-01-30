/* import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { airtableService } from "./airtableService";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

interface RegisterData {
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
}

export const authService = {
  async login(email: string, password: string) {
    const teacher = await airtableService.getTeacherByEmail(email);

    if (!teacher) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(
      password,
      teacher.fields.PasswordHash as string
    );

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: teacher.id,
        email: teacher.fields.Email,
        namn: `${teacher.fields.Förnamn} ${teacher.fields.Efternamn}`,
        instruments: teacher.fields.Instrument,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: teacher.id,
        email: teacher.fields.Email,
        firstName: teacher.fields.Förnamn,
        lastName: teacher.fields.Efternamn,
        instruments: teacher.fields.Instrument,
      },
      token,
    };
  },

  async register(data: RegisterData) {
    const existingTeacher = await airtableService.getTeacherByEmail(data.email);

    if (existingTeacher) {
      throw new Error("Email already registered");
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const teacher = await airtableService.createTeacher({
      Förnamn: data.firstName,
      Efternamn: data.lastName,
      Email: data.email,
      PasswordHash: passwordHash,
      Instrument: data.instruments,
      Telefon: data.phone,
    });

    const token = jwt.sign(
      {
        id: teacher.id,
        email: data.email,
        namn: `${data.firstName} ${data.lastName}`,
        instruments: data.instruments,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: teacher.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        instruments: data.instruments,
      },
      token,
    };
  },

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        namn: string;
        instruments: string[];
      };

      const newToken = jwt.sign(
        {
          id: decoded.id,
          email: decoded.email,
          namn: decoded.namn,
          instruments: decoded.instruments,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return { token: newToken };
    } catch {
      throw new Error("Invalid token");
    }
  },
};
 */
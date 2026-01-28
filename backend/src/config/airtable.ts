import Airtable from "airtable";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
  throw new Error("Missing Airtable configuration");
}

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});

export const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

export const Tables = {
  TEACHERS: "Lärare",
  STUDENTS: "Elever",
  LESSONS: "Lektioner",
  NOTIFICATIONS: "AppNotifikationer",
} as const;

import { base, Tables } from "../config/airtable";

interface TeacherFields {
  Förnamn?: string;
  Efternamn?: string;
  Email?: string;
  PasswordHash?: string;
  Instrument?: string[];
  Telefon?: string;
  Adress?: string;
  [key: string]: unknown;
}

interface AirtableRecord {
  id: string;
  fields: TeacherFields;
}

export const airtableService = {
  async getTeacherByEmail(email: string): Promise<AirtableRecord | null> {
    try {
      const records = await base(Tables.TEACHERS)
        .select({
          filterByFormula: `{Email} = '${email}'`,
          maxRecords: 1,
        })
        .firstPage();

      if (records.length === 0) {
        return null;
      }

      return {
        id: records[0].id,
        fields: records[0].fields as TeacherFields,
      };
    } catch (error) {
      console.error("Error fetching teacher by email:", error);
      throw error;
    }
  },

  async getTeacherById(id: string): Promise<AirtableRecord | null> {
    try {
      const record = await base(Tables.TEACHERS).find(id);
      return {
        id: record.id,
        fields: record.fields as TeacherFields,
      };
    } catch (error) {
      console.error("Error fetching teacher by ID:", error);
      return null;
    }
  },

  async createTeacher(fields: TeacherFields): Promise<AirtableRecord> {
    try {
      const record = await base(Tables.TEACHERS).create(fields);
      return {
        id: record.id,
        fields: record.fields as TeacherFields,
      };
    } catch (error) {
      console.error("Error creating teacher:", error);
      throw error;
    }
  },

  async updateTeacher(
    id: string,
    fields: Partial<TeacherFields>
  ): Promise<AirtableRecord> {
    try {
      const record = await base(Tables.TEACHERS).update(id, fields);
      return {
        id: record.id,
        fields: record.fields as TeacherFields,
      };
    } catch (error) {
      console.error("Error updating teacher:", error);
      throw error;
    }
  },

  async getLessonsForTeacher(teacherId: string) {
    try {
      const records = await base(Tables.LESSONS)
        .select({
          filterByFormula: `FIND('${teacherId}', ARRAYJOIN({Lärare}))`,
        })
        .all();

      return records.map((record) => ({
        id: record.id,
        fields: record.fields,
      }));
    } catch (error) {
      console.error("Error fetching lessons:", error);
      throw error;
    }
  },

  async getStudentsForTeacher(teacherId: string) {
    try {
      const records = await base(Tables.STUDENTS)
        .select({
          filterByFormula: `FIND('${teacherId}', ARRAYJOIN({Lärare}))`,
        })
        .all();

      return records.map((record) => ({
        id: record.id,
        fields: record.fields,
      }));
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  },

  async getAvailableStudents() {
    try {
      const records = await base(Tables.STUDENTS)
        .select({
          filterByFormula: `{Status} = 'Söker lärare'`,
        })
        .all();

      return records.map((record) => ({
        id: record.id,
        fields: record.fields,
      }));
    } catch (error) {
      console.error("Error fetching available students:", error);
      throw error;
    }
  },
};

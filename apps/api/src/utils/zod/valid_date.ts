import z, { ZodDate } from 'zod';

export const makeDateSchema = (field: string): ZodDate => z.date({ error: `${field} de ser uma data` });

import z, { ZodBoolean } from 'zod';

export const makeBooleanSchema = (field: string): ZodBoolean => z.boolean({ error: `${field} de ser um booleano` });

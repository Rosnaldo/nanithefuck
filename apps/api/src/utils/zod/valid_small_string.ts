import z, { ZodString, ZodOptional } from 'zod';

export const makeSmallStringSchema = (field: string): ZodString =>
    z
        .string({ error: () => `${field} e obrigatório` })
        .trim()
        .min(1, `${field} deve ter 1 caracter pelo menos`)
        .max(50, `${field} não deve ultrapassar 50 caracteres`);

export const makeSmallStringOptionalSchema = (field: string): ZodOptional<ZodString> =>
    z
        .string({ error: () => `${field} e obrigatório` })
        .min(1, `${field} deve ter 1 caracter pelo menos`)
        .max(50, `${field} não deve ultrapassar 50 caracteres`)
        .optional();

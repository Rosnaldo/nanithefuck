import { ZodObject } from 'zod';

export interface ValidateParseResult {
    hasError: boolean;
    message?: string;
    data: Record<string, unknown> | undefined;
}

export const validateParse = <Params>(schema: ZodObject, params: Params): ValidateParseResult => {
    const result = schema.safeParse(params);

    const hasError = !!result?.error;
    const message = result?.error?.issues?.[0]?.message;
    const data = result.data;
    return { hasError, message, data };
};

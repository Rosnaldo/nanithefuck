import { UnauthorizedRequestException } from '#exceptions/unauthorized_request';
import { BadRequestException } from '#exceptions/bad_request';
import { IsError } from './either';
import { safeObjectify } from './safe_objectify';

export const logError = (error: unknown, endpoint: string): IsError => {
    if (error instanceof BadRequestException) {
        console.log(`${endpoint} BadRequestException: ${error.message}}`);
        return { isError: true, status: 200, message: error.message };
    }

    if (error instanceof UnauthorizedRequestException) {
        console.log(`${endpoint} UnauthorizedRequestException: ${error.message}`);
        return { isError: true, status: 200, message: error.message };
    }

    console.error('Api unexpected error:', safeObjectify(error));
    return { isError: true, status: 200, message: 'Api unexpected error' }
};

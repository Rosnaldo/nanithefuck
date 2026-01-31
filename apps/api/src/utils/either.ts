import _ from 'lodash';

export interface IsError {
    isError: true;
    message: string;
    status: number;
}

export type IsSuccess<T> = T & { isError: false; status: number; message: string };

export type Either<T> = IsError | IsSuccess<T>;

export const isSuccess = <T>(result: Either<T>): result is IsSuccess<T> => !result;

export const toResponseData = <T>(data: IsSuccess<T>): T => {
    return data;
};

const isObjectWithFields = (value: any): boolean => {
    return typeof value === 'object' && !_.isNil(value) && !Array.isArray(value);;
};

export const successData = <T>(data: T, message: string = 'sucesso'): IsSuccess<T> => {
    return {
        ...(isObjectWithFields(data) ? data : ({} as T)),
        message,
        status: 200,
        isError: false
    };
};

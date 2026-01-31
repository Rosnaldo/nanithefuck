import { PaginateResponse } from '#types/index';
import _ from 'lodash';

export interface IsError {
    isError: true;
    message: string;
    status: number;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    size: number;
}

export type IsSuccess<T> = PaginateResponse<T>;

export type EitherPaginacao<T> = IsError | IsSuccess<T>;

export const isSuccess = <T>(result: EitherPaginacao<T>): result is IsSuccess<T> => !result;

export const successData = <T>(data: T[], pagination: Pagination): IsSuccess<T> => {
    return {
        data,
        isError: false,
        pagination
    };
};

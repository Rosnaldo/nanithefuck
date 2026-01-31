import _ from 'lodash';

export interface IsError {
    isError: true;
    message: string;
    status: number;
}

export type EitherList<T> = IsError | T;

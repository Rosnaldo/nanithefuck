import z from 'zod';

import { makeSmallStringSchema } from '#utils/zod/valid_small_string';
import { makeEmailSchema } from '#utils/zod/valid_email';

import { IUser } from './types';
import { cleanMongooseObject } from '#entities/utils/clean_mongoose_doc';
import { makeEnumSchema } from '#utils/zod/valid_enum';
import { UserRoleAll } from '@repo/shared-types';

export class UserUtils {
    public readonly zodSchema = z.object({
        firstName: makeSmallStringSchema('firstName'),
        lastName: makeSmallStringSchema('lastName'),
        email: makeEmailSchema(),
        role: makeEnumSchema(UserRoleAll, 'role'),
    });

    public readonly toObject = (User: IUser['IDocument']): IUser['IParams'] => {
        const object = cleanMongooseObject(User);
        return {
            ...object,
            _id: User?._id?.toString(),
        };
    };
}

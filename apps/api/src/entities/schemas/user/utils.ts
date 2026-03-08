import z from 'zod';

import { makeSmallStringSchema } from '#utils/zod/valid_small_string';
import { makeEmailSchema } from '#utils/zod/valid_email';

import { IUser } from './types';
import { cleanMongooseObject } from '#entities/utils/clean_mongoose_doc';
import { makeEnumSchema } from '#utils/zod/valid_enum';
import { IUserAvatar, UserRoleAll } from '@repo/shared-types';
import { joinUrl } from '#utils/join_url';
import { toSlug } from '#utils/to_slug';
import _ from 'lodash';
import properties from '#properties';

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

export class UserBuilder {
    public readonly entity: Partial<IUser['IParams']> = {};

    constructor (params: Partial<IUser['IParams']>) {
        const { firstName, lastName, email, role, avatar } = params;

        const init = { firstName, lastName, email, role };
        if (ensureAllDefined(init)) {
            this.setInit(init);
        }

        if (avatar) {
            this.setAvatar(avatar);
        }
    }

    setInit = (params: Pick<IUser['IParams'], 'firstName' | 'lastName' | 'email' | 'role'>): this => {
        const { firstName, lastName, email, role } = params;
        const slug = toSlug(`${firstName}-${lastName}`);

        this.entity.firstName = firstName;
        this.entity.lastName = lastName;
        this.entity.slug = slug;
        this.entity.email = email;
        this.entity.role = role;

        return this;
    };

    setAvatar = ({ s3Path, url }: Pick<IUserAvatar, 's3Path' | 'url'>): this => {
        this.entity.avatar = {
            s3Host: properties.s3Host,
            cdnHost: properties.cdnHost,
            s3Path,
            url,
        };
        return this;
    };

    public readonly build = (): Partial<IUser['IParams']> => {
        return {
            ...this.entity
        };
    };
}

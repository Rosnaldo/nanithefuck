import z from 'zod';
import _ from 'lodash';

import { makeSmallStringSchema } from '#utils/zod/valid_small_string';
import { makeEmailSchema } from '#utils/zod/valid_email';

import { IUser } from './types';
import { cleanMongooseObject } from '#entities/utils/clean_mongoose_doc';
import { makeEnumSchema } from '#utils/zod/valid_enum';
import { IUserAvatar, UserRoleAll } from '@repo/shared-types';
import { toSlug } from '#utils/to_slug';
import { getUserModel } from '#models/singleton';
import properties from '#properties';
import { hasNoNilValues } from '#utils/has_no_nil_values';

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
    public readonly utils = new UserUtils();
    protected readonly doc: IUser['IDocument'];

    constructor(doc: IUser['IDocument'] | null = null) {
        const UserModel = getUserModel();
        if (doc != null) this.doc = doc;
        else this.doc = new UserModel();
    }

    public readonly build = (params: Partial<IUser['IParams']>): this => {
        const { firstName, lastName, email, role, avatar } = params;

        const init = { firstName, lastName, email, role };
        if (hasNoNilValues(init)) {
            this.setInit(init);
        }

        if (avatar) {
            this.setAvatar(avatar);
        }

        return this;
    };

    public readonly setInit = (params: Pick<IUser['IParams'], 'firstName' | 'lastName' | 'email' | 'role'>): this => {
        const { firstName, lastName, email, role } = params;
        const slug = toSlug(`${firstName}-${lastName}`);

        this.doc.firstName = firstName;
        this.doc.lastName = lastName;
        this.doc.slug = slug;
        this.doc.email = email;
        this.doc.role = role;

        return this;
    };

    public readonly setAvatar = ({ s3Path, url }: Pick<IUserAvatar, 's3Path' | 'url'>): this => {
        this.doc.avatar = {
            s3Host: properties.s3Host,
            cdnHost: properties.cdnHost,
            s3Path,
            url,
        };
        return this;
    };

    public readonly save = async (): Promise<IUser['IParams']> => {
        await this.doc.save();
        return this.utils.toObject(this.doc);
    };
}

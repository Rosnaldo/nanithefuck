import { Request } from 'express';
import z from 'zod';

import { logError } from '#utils/log_error';
import { UserCrud } from '#crud/user';
import { IUserController } from './params';
import { Either, successData } from '#utils/either';
import { validateParse, ValidateParseResult } from '#utils/zod/validate_parse';
import { BadRequestException } from '#exceptions/bad_request';
import { IUser } from '#schemas/user/types';
import { UserUtils } from '#schemas/user/utils';
import { makeObjectIdSchema } from '#utils/zod/valid_objectid_schema';
import { mapString } from '#utils/mapper/string';
import { toUndefined } from '#utils/mapper/to_undefined';

type IEdit = IUserController['IEdit'];
type Mapped = Omit<IEdit, 'role'> & {
    role?: string;
};

interface Props {
    mapped: Mapped;
}

export class Edit {
    public static readonly classId = Symbol.for('Controller > User > Edit');
    private readonly crud: UserCrud;
    private readonly utils: UserUtils;

    private constructor() {
        this.crud = new UserCrud();
        this.utils = new UserUtils();
    }

    static construir(classId: symbol): Edit {
        if (classId !== Symbol.for('Controller > User')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new Edit();
    }

    public readonly exec = async (props: Props): Promise<Either<string>> => {
        try {
            const { mapped } = props;
            const params = this.transform(mapped);
            const { _id, firstName, lastName, email, role } = params;

            await this.crud.update(_id, { firstName, lastName, email, role });
            return successData('success');
        } catch (error: unknown) {
            return logError(error, '/user/Edit');
        }
    };

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public readonly makeZodSchema = () => {
        const partial = this.utils.zodSchema.pick({
            firstName: true,
            lastName: true,
            email: true,
            role: true,
        }).partial();

        const schema = z.object({
            _id: makeObjectIdSchema('_id'),
            ...partial.shape,
        });

        return schema;
    };

    public readonly mapper = (body: Request['body']): Mapped => {
        const {
            _id,
            firstName,
            lastName,
            email,
            role,
        } = body;

        return {
            _id: mapString(_id),
            ...(firstName ? { firstName: toUndefined('firstName', firstName) } : {}),
            ...(lastName ? { lastName: toUndefined('lastName', lastName) } : {}),
            ...(email ? { email: toUndefined('email', email) } : {}),
            ...(role ? { role: toUndefined('role', role) } : {}),
        };
    };

    private readonly validate = (mapped: Mapped): ValidateParseResult => {
        const schema = this.makeZodSchema();

        return validateParse<Mapped>(schema, mapped);
    };

    public readonly transform = (mapped: Mapped): IEdit => {
        const zodResult = this.validate(mapped);
        if (zodResult.hasError) throw new BadRequestException(zodResult.message!);

        return zodResult.data as unknown as IEdit;
    };
}

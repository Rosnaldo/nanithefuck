import { Request } from 'express';
import z from 'zod';

import { logError } from '#utils/log_error';
import { MeetingCrud } from '#crud/meeting';
import { IMeetingController } from './params';
import { Either, successData } from '#utils/either';
import { validateParse, ValidateParseResult } from '#utils/zod/validate_parse';
import { BadRequestException } from '#exceptions/bad_request';
import { MeetingUtils } from '#schemas/meeting/utils';
import { makeObjectIdSchema } from '#utils/zod/valid_objectid_schema';
import { mapString } from '#utils/mapper/string';
import { toUndefined } from '#utils/mapper/to_undefined';
import { mapArray } from '#utils/mapper/array';

type IEdit = IMeetingController['IEdit'];
type Mapped = Omit<IEdit, 'start' | 'finish'> & {
    start?: string;
    finish?: string;
}

interface Props {
    mapped: Mapped;
}

export class Edit {
    public static readonly classId = Symbol.for('Controller > Meeting > Edit');
    private readonly crud: MeetingCrud;
    private readonly utils: MeetingUtils;

    private constructor() {
        this.crud = new MeetingCrud();
        this.utils = new MeetingUtils();
    }

    static construir(classId: symbol): Edit {
        if (classId !== Symbol.for('Controller > Meeting')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new Edit();
    }

    public readonly exec = async (props: Props): Promise<Either<string>> => {
        try {
            const { mapped } = props;
            const params = this.transform(mapped);
            const { _id, name, start, finish, description, participantIds } = params;

            await this.crud.update(_id, { name, start, finish, description, participantIds });
            return successData('success');
        } catch (error: unknown) {
            return logError(error, '/meeting/edit');
        }
    };

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public readonly makeZodSchema = () => {
        const partial = this.utils.zodSchema.pick({
            name: true,
            start: true,
            finish: true,
            description: true,
            participants: true,
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
            name,
            start,
            finish,
            description,
            participantIds,
        } = body;

        return {
            _id: mapString(_id),
            participantIds: mapArray(participantIds),
            ...(name ? { name: toUndefined('name', name) } : {}),
            ...(start ? { start: toUndefined('start', start) } : {}),
            ...(finish ? { finish: toUndefined('finish', finish) } : {}),
            ...(description ? { description: toUndefined('description', description) } : {}),
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

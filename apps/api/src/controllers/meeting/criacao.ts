import { Request } from 'express';
import z from 'zod';

import { logError } from '#utils/log_error';
import { IMeetingController } from './params';
import { Either, successData } from '#utils/either';
import { validateParse, ValidateParseResult } from '#utils/zod/validate_parse';
import { BadRequestException } from '#exceptions/bad_request';
import { IMeeting } from '#schemas/meeting/types';
import { MeetingBuilder, MeetingUtils } from '#schemas/meeting/utils';
import { mapString } from '#utils/mapper/string';

type ICriacao = IMeetingController['ICriacao'];

type Mapped = ICriacao

interface Props {
    mapped: Mapped;
}

export class Criacao {
    public static readonly classId = Symbol.for('Controller > Meeting > Criacao');
    private readonly utils: MeetingUtils;

    private constructor() {
        this.utils = new MeetingUtils();
    }

    static construir(classId: symbol): Criacao {
        if (classId !== Symbol.for('Controller > Meeting')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new Criacao();
    }

    public readonly exec = async (props: Props): Promise<Either<IMeeting['IParams']>> => {
        try {
            const { mapped } = props;
            const params = this.transform(mapped);
            const { name } = params;

            const builder = new MeetingBuilder();

            const meeting = await builder.setInit({ name, isActive: false }).save();
            return successData(meeting);
        } catch (error: unknown) {
            return logError(error, '/meeting/create');
        }
    };

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public readonly makeZodSchema = () => {
        const picked = this.utils.zodSchema.pick({
            name: true,
        });

        const schema = z.object({
            ...picked.shape,
        });

        return schema;
    };

    public readonly mapper = (body: Request['body']): Mapped => {
        const {
            name,
        } = body;

        return {
            name: mapString(name),
        };
    };

    private readonly validate = (mapped: Mapped): ValidateParseResult => {
        const schema = this.makeZodSchema();

        return validateParse<Mapped>(schema, mapped);
    };

    public readonly transform = (mapped: Mapped): ICriacao => {
        const zodResult = this.validate(mapped);
        if (zodResult.hasError) throw new BadRequestException(zodResult.message!);

        return zodResult.data as unknown as ICriacao;
    };
}

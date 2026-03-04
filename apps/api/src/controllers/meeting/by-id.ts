import { Request } from 'express';

import { logError } from '#utils/log_error';
import { MeetingCrud } from '#crud/meeting';
import { IMeetingController } from './params';
import { Either, successData } from '#utils/either';
import { IMeeting } from '#schemas/meeting/types';
import { mapString } from '#utils/mapper/string';

type IById = IMeetingController['IById'];
type Mapped = IById

interface Props {
    mapped: Mapped;
}

export class ById {
    public static readonly classId = Symbol.for('Controller > Meeting > ById');
    private readonly crud: MeetingCrud;

    private constructor() {
        this.crud = new MeetingCrud();
    }

    static construir(classId: symbol): ById {
        if (classId !== Symbol.for('Controller > Meeting')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new ById();
    }

    public readonly get = async (props: Props): Promise<Either<IMeeting['IParams']>> => {
        try {
            const { mapped } = props;
            const { _id } = mapped;

            const metting = await this.crud.findOne({ _id });
            return successData(metting);
        } catch (error: unknown) {
            return logError(error, '/meeting/by-id');
        }
    };

    public readonly mapper = (body: Request['body']): Mapped => {
        const {
            _id,
        } = body;

        return {
            _id: mapString(_id),
        };
    };
}

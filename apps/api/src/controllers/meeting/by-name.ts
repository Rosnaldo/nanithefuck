import { Request } from 'express';

import { logError } from '#utils/log_error';
import { MeetingCrud } from '#crud/meeting';
import { IMeetingController } from './params';
import { Either, successData } from '#utils/either';
import { IMeeting } from '#schemas/meeting/types';
import { mapString } from '#utils/mapper/string';

type IByName = IMeetingController['IByName'];
type Mapped = IByName

interface Props {
    mapped: Mapped;
}

export class ByName {
    public static readonly classId = Symbol.for('Controller > Meeting > ByName');
    private readonly crud: MeetingCrud;

    private constructor() {
        this.crud = new MeetingCrud();
    }

    static construir(classId: symbol): ByName {
        if (classId !== Symbol.for('Controller > Meeting')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new ByName();
    }

    public readonly get = async (props: Props): Promise<Either<IMeeting['IParams']>> => {
        try {
            const { mapped } = props;
            const { name } = mapped;

            const metting = await this.crud.findOne({ name });
            return successData(metting);
        } catch (error: unknown) {
            return logError(error, '/meeting/by-name');
        }
    };

    public readonly mapper = (body: Request['body']): Mapped => {
        const {
            name,
        } = body;

        return {
            name: mapString(name),
        };
    };
}

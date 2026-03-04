import { Request } from 'express';

import { IUser } from '#schemas/user/types';
import { logError } from '#utils/log_error';
import { UserCrud } from '#crud/user';
import { IUserController } from './params';
import { EitherList } from '#utils/either_list';
import { MeetingCrud } from '#crud/meeting';
import { mapString } from '#utils/mapper/string';

type IParticipants = IUserController['IParticipants'];

interface Props {
    params: IParticipants;
    user: IUser['IParams'];
}

export class Participants {
    public readonly classId = Symbol.for('Controller > User > Participants');
    private readonly crud: UserCrud;
    private readonly crudMeeting: MeetingCrud;

    private constructor() {
        this.crud = new UserCrud();
        this.crudMeeting = new MeetingCrud();
    }

    static construir(classId: symbol): Participants {
        if (classId !== Symbol.for('Controller > User')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new Participants();
    }

    public readonly get = async (props: Props): Promise<EitherList<IUser['IParams'][]>> => {
        try {
            const { params } = props;
            const { meetingId } = params;

            const meeting = await this.crudMeeting.findById(meetingId);
            const participantIds = meeting.participants.map((p) => p.userId);
            const list = await this.crud.findByIds(participantIds);

            return list;
        } catch (error: unknown) {
            return logError(error, '/user/participants');
        }
    };

    public readonly mapper = (body: Request['body']): IParticipants => {
        const {
            meetingId,
        } = body;

        return {
            meetingId: mapString(meetingId),
        };
    };
}

import { Request } from 'express';

import { IUser } from '#schemas/user/types';
import { logError } from '#utils/log_error';
import { UserCrud } from '#crud/user';
import { IUserController } from './params';
import { EitherList } from '#utils/either_list';
import { MeetingCrud } from '#crud/meeting';
import type { IParticipant, IUserParticipant } from '@repo/shared-types';
import { toUndefined } from '#utils/mapper/to_undefined';
import _ from 'lodash';
import { BadRequestException } from '#exceptions/bad_request';

type IMeetingParticipants = IUserController['IParticipants'];

interface Props {
    params: IMeetingParticipants;
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

    public readonly get = async (props: Props): Promise<EitherList<IUserParticipant[]>> => {
        try {
            const { params } = props;
            const { meetingId, slug } = params;

            const query = {
                ...(_.isNil(meetingId)) ? {} : { _id: meetingId },
                ...(_.isNil(slug)) ? {} : { slug },
            };

            const meeting = await this.crudMeeting.findOne(query);
            if (_.isNil(meeting)) {
                throw new BadRequestException('Meeting not found')
            }

            const participantIds = meeting.participants.map((p) => p.userId);
            const list = await this.crud.findByIds(participantIds);

            const participantsDict: Record<string, { value: IParticipant }> =
                meeting.participants.transformInDict('userId');

            return list.map((l) => ({
                ...l,
                status: participantsDict[l._id].value.status,
            }));
        } catch (error: unknown) {
            return logError(error, '/user/participants');
        }
    };

    public readonly mapper = (body: Request['body']): IMeetingParticipants => {
        const {
            meetingId,
            slug,
        } = body;

        return {
            ...(meetingId ? { meetingId: toUndefined('meetingId', meetingId) } : {}),
            ...(slug ? { slug: toUndefined('slug', slug) } : {}),
        };
    };
}

import z from 'zod';

import { makeSmallStringSchema } from '#utils/zod/valid_small_string';

import { IParticipant } from './types';
import { cleanMongooseObject } from '#entities/utils/clean_mongoose_doc';
import { makeObjectIdSchema } from '#utils/zod/valid_objectid_schema';
import { UserUtils } from '#schemas/user/utils';

export class ParticipantUtils {
    public readonly zodSchema = z.object({
        name: makeSmallStringSchema('name'),
        userId: makeObjectIdSchema('userId'),
        mettingId: makeObjectIdSchema('mettingId'),
    });

    public readonly toObject = (participant: IParticipant['IDocument']): IParticipant['IParams'] => {
        const object = cleanMongooseObject(participant);
        const utils = new UserUtils();
        return {
            ...object,
            user: (participant?.user ? utils.toObject(participant?.user) : undefined),
            userId: participant?.userId?.toString(),
            meetingId: participant?.meetingId?.toString(),
        };
    };
}

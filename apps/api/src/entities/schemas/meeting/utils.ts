import z from 'zod';

import { makeSmallStringSchema } from '#utils/zod/valid_small_string';

import { IMeeting } from './types';
import { cleanMongooseObject } from '#entities/utils/clean_mongoose_doc';
import { makeObjectIdSchema } from '#utils/zod/valid_objectid_schema';
import { makeDateSchema } from '#utils/zod/valid_date';

export class MeetingUtils {
    public readonly zodSchema = z.object({
        name: makeSmallStringSchema('name'),
        start: makeDateSchema('start'),
        finish: makeDateSchema('finish'),
        description: makeSmallStringSchema('description'),
        participantIds: z.array(makeObjectIdSchema('participantIds')),
    });

    public readonly toObject = (meeting: IMeeting['IDocument']): IMeeting['IParams'] => {
        const object = cleanMongooseObject(meeting);
        return {
            ...object,
            _id: meeting?._id?.toString(),
        };
    };
}

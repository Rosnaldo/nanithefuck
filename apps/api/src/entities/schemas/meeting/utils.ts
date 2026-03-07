import z from 'zod';

import { makeSmallStringSchema } from '#utils/zod/valid_small_string';

import { IMeeting, IParticipantSchema } from './types';
import { cleanMongooseObject } from '#entities/utils/clean_mongoose_doc';
import { makeDateSchema } from '#utils/zod/valid_date';
import { makeEnumSchema } from '#utils/zod/valid_enum';
import { IParticipant, ParticipantStatusAll, PictureTypeAll, WeekdayAll } from '@repo/shared-types';
import { makeNumberSchema } from '#utils/zod/valid_number';
import { makeBooleanSchema } from '#utils/zod/valid_boolean';
import { makeObjectIdSchema } from '#utils/zod/valid_objectid_schema';
import { makeUrlSchema } from '#utils/zod/valid_url';

export class MeetingUtils {
    public readonly zodDaySchema = z.object({
        day: makeNumberSchema('day'),
        start: makeSmallStringSchema('start'),
        finish: makeSmallStringSchema('finish'),
        weekday: makeEnumSchema(WeekdayAll, 'weekday'),
        date: makeDateSchema('date'),
        allDayLong: makeBooleanSchema('allDayLong'),
    });

    public readonly zodGallerySchema = z.object({
        url: makeUrlSchema('url'),
        type: makeEnumSchema(PictureTypeAll, 'type'),
        h: makeNumberSchema('h'),
        w: makeNumberSchema('w'),
    });

    public readonly zodParticipantSchema = z.object({
        userId: makeObjectIdSchema('userId'),
        status: makeEnumSchema(ParticipantStatusAll, 'status'),
    });

    public readonly zodSchema = z.object({
        name: makeSmallStringSchema('name'),
        slug: makeSmallStringSchema('slug'),
        days: z.array(this.zodDaySchema),
        gallery: z.array(this.zodGallerySchema),
        participants: z.array(this.zodParticipantSchema),
    });

    public readonly toObject = (meeting: IMeeting['IDocument']): IMeeting['IParams'] => {
        const object = cleanMongooseObject(meeting);
        return {
            ...object,
            _id: meeting?._id?.toString(),
            participants: meeting?.participants?.map((obj: IParticipantSchema) => {
                return {
                    userId: obj?.userId?.toString(),
                    status: obj?.status,
                } satisfies IParticipant;
            })
        };
    };
}

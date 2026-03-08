import z from 'zod';

import { makeSmallStringSchema } from '#utils/zod/valid_small_string';

import { IMeeting, IParticipantSchema } from './types';
import { cleanMongooseObject } from '#entities/utils/clean_mongoose_doc';
import { makeDateSchema } from '#utils/zod/valid_date';
import { makeEnumSchema } from '#utils/zod/valid_enum';
import { IDay, IParticipant, IPicture, ParticipantStatusAll, PictureTypeAll, WeekdayAll } from '@repo/shared-types';
import { makeNumberSchema } from '#utils/zod/valid_number';
import { makeBooleanSchema } from '#utils/zod/valid_boolean';
import { makeObjectIdSchema } from '#utils/zod/valid_objectid_schema';
import { makeUrlSchema } from '#utils/zod/valid_url';
import { toSlug } from '#utils/to_slug';
import properties from '#properties';

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

export class MeetingBuilder {
    public readonly entity: Partial<IMeeting['IParams']> = {};

    constructor (params: Partial<IMeeting['IParams']>) {
        const { name, gallery, days, participants } = params;

        const init = { name };
        if (ensureAllDefined(init)) {
            this.setInit(init);
        }

        if (gallery) {
            this.setGallery(gallery);
        }

        if (days) {
            this.setDays(days);
        }

        if (participants) {
            this.setParticipants(participants);
        }
    };

    setInit = (params: Pick<IMeeting['IParams'], 'name'>): this => {
        const { name } = params;
        const slug = toSlug(name);

        this.entity.name = name;
        this.entity.slug = slug;

        return this;
    };

    setParticipants = (participants: IParticipant[]): this => {
        this.entity.participants = participants;
        return this;
    };

    setGallery = (gallery: IPicture[]): this => {
        this.entity.gallery = gallery.map((g) => ({
            ...g,
            s3Host: properties.s3Host,
            cdnHost: properties.cdnHost,
        }));
        return this;
    };

    setDays = (days: Pick<IDay, 'start' | 'finish' | 'allDayLong' | 'isodate'>[]): this => {
        this.entity.days = days.map(d => {
            const isoDate = new Date(d.isodate);
            const dayNumber = isoDate.getDate();
            const weekdayNumber = isoDate.getDay();
            const monthNumber = isoDate.getMonth() + 1;
            const year = isoDate.getFullYear();

            function formatDDMMYYYY(date: Date): string {
                const day = String(date.getDate()).padStart(2, "0"); // garante 2 dígitos
                const month = String(date.getMonth() + 1).padStart(2, "0"); // 0-11 → 1-12
                const year = date.getFullYear();

                return `${day}/${month}/${year}`;
            }

            return {
                start: d.start,
                finish: d.finish,
                isodate: isoDate,
                day: dayNumber,
                month: monthNumber,
                year,
                weekday: WeekdayAll[weekdayNumber],
                formatted: formatDDMMYYYY(isoDate),
                allDayLong: d.allDayLong,
            } satisfies IDay
        });
        return this;
    };

    public readonly build = (): Partial<IMeeting['IParams']> => {
        return {
            ...this.entity
        };
    };
}

import z from 'zod';
import { Types } from 'mongoose';
import { makeSmallStringSchema, makeStringSchema } from '#utils/zod/valid_small_string';

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
import { getMeetingModel } from '#models/singleton';
import { hasNoNilValues } from '#utils/has_no_nil_values';

export class MeetingUtils {
    public readonly zodDaySchema = z.object({
        day: makeNumberSchema('day'),
        month: makeNumberSchema('month'),
        year: makeNumberSchema('year'),
        formatted: makeSmallStringSchema('formatted'),
        start: makeSmallStringSchema('start'),
        finish: makeSmallStringSchema('finish'),
        weekday: makeEnumSchema(WeekdayAll, 'weekday'),
        isodate: makeDateSchema('isodate'),
        allDayLong: makeBooleanSchema('allDayLong'),
    });

    public readonly zodPictureSchema = z.object({
        cdnHost: makeStringSchema('cdnHost'),
        s3Host: makeStringSchema('s3Host'),
        s3Path: makeStringSchema('s3Path'),
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
        isActive: makeBooleanSchema('isActive'),
        days: z.array(this.zodDaySchema),
        gallery: z.array(this.zodPictureSchema),
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
    public readonly utils = new MeetingUtils();
    protected readonly doc: IMeeting['IDocument'];

    constructor(doc: IMeeting['IDocument'] | null = null) {
        const MeetingModel = getMeetingModel();
        if (doc != null) this.doc = doc;
        else this.doc = new MeetingModel();
    }

    public readonly build = (params: Partial<IMeeting['IParams']>): this => {
        const { name, isActive, gallery, days, participants } = params;

        const init = { name, isActive };
        if (hasNoNilValues(init)) {
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

        return this;
    };

    public readonly setInit = (params: Pick<IMeeting['IParams'], 'name' | 'isActive'>): this => {
        const { name, isActive } = params;
        const slug = toSlug(name);

        this.doc.name = name;
        this.doc.slug = slug;
        this.doc.isActive = isActive;

        return this;
    };

    public readonly setParticipants = (participants: IParticipant[]): this => {
        this.doc.participants = participants.map((p) => ({
            userId: new Types.ObjectId(p.userId),
            status: p.status,
        }));
        return this;
    };

    public readonly setGallery = (gallery: Pick<IPicture, 'type' | 'w' | 'h' | 'url' | 's3Path'>[]): this => {
        this.doc.gallery = gallery.map((g) => ({
            ...g,
            s3Host: properties.s3Host,
            cdnHost: properties.cdnHost,
        }));
        return this;
    };

    public readonly addToGallery = (picture: Pick<IPicture, 'type' | 'w' | 'h' | 'url' | 's3Path'>): this => {
        this.doc.gallery?.push({
            ...picture,
            s3Host: properties.s3Host,
            cdnHost: properties.cdnHost,
        });
        return this;
    };

    public readonly setDays = (days: Pick<IDay, 'start' | 'finish' | 'allDayLong' | 'isodate'>[]): this => {
        this.doc.days = days.map(d => {
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

    public readonly save = async (): Promise<IMeeting['IParams']> => {
        await this.doc.save();
        return this.utils.toObject(this.doc);
    };
}

import { Request } from 'express';
import z from 'zod';

import { logError } from '#utils/log_error';
import { MeetingCrud } from '#crud/meeting';
import { IMeetingController } from './params';
import { Either, successData } from '#utils/either';
import { validateParse, ValidateParseResult } from '#utils/zod/validate_parse';
import { BadRequestException } from '#exceptions/bad_request';
import { MeetingUtils } from '#schemas/meeting/utils';
import { makeObjectIdSchema } from '#utils/zod/valid_objectid_schema';
import { mapString } from '#utils/mapper/string';
import { toUndefined } from '#utils/mapper/to_undefined';
import { mapNumber } from '#utils/mapper/number';
import { mapBoolean } from '#utils/mapper/boolean';

type IEdit = IMeetingController['IEdit'];
type Mapped = IEdit

interface Props {
    mapped: Mapped;
}

export class Edit {
    public static readonly classId = Symbol.for('Controller > Meeting > Edit');
    private readonly crud: MeetingCrud;
    private readonly utils: MeetingUtils;

    private constructor() {
        this.crud = new MeetingCrud();
        this.utils = new MeetingUtils();
    }

    static construir(classId: symbol): Edit {
        if (classId !== Symbol.for('Controller > Meeting')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new Edit();
    }

    public readonly exec = async (props: Props): Promise<Either<string>> => {
        try {
            const { mapped } = props;
            const params = this.transform(mapped);
            const { _id, name, slug, isActive, days, participants, gallery } = params;

            await this.crud.update(_id, { name, slug, isActive, days, participants, gallery });
            return successData('success');
        } catch (error: unknown) {
            return logError(error, '/meeting/edit');
        }
    };

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public readonly makeZodSchema = () => {
        const meeting = this.utils.zodSchema.pick({
            name: true,
            slug: true,
            isActive: true,
        });

        const picture = this.utils.zodPictureSchema.pick({
            w: true,
            h: true,
            url: true,
            s3Host: true,
            s3Path: true,
            type: true,
        });

        const picturePartial = this.utils.zodPictureSchema.pick({
            cdnHost: true,
        }).partial();

        const participant = this.utils.zodParticipantSchema.pick({
            userId: true,
            status: true,
        });

        const day = this.utils.zodDaySchema.pick({
            day: true,
            month: true,
            year: true,
            formatted: true,
            isodate: true,
            weekday: true,
            allDayLong: true,
        });

        const dayPartial = this.utils.zodDaySchema.pick({
            start: true,
            finish: true,
        }).partial();

        const schema = z.object({
            _id: makeObjectIdSchema('_id'),
            ...meeting.shape,
            days: z.array(z.object({
                ...day.shape,
                ...dayPartial.partial,
            })),
            gallery: z.array(z.object({
                ...picture.shape,
                ...picturePartial.partial,
            })),
            participants: z.array(z.object({
                ...participant.shape
            })),
        });

        return schema;
    };

    public readonly mapper = (body: Request['body']): Mapped => {
        const {
            _id,
            name,
            slug,
            isActive,
            days,
            gallery,
            participants,
        } = body;

        console.log('isActive', isActive, mapBoolean(isActive))

        return {
            _id: mapString(_id),
            days: (days || []).map((d: any) => ({
                day: mapNumber(d.day),
                month: mapNumber(d.month),
                year: mapNumber(d.year),
                formatted: mapString(d.formatted),
                ...(d.start ? { start: toUndefined('start', d.start) } : {}),
                ...(d.finish ? { finish: toUndefined('finish', d.finish) } : {}),
                ...(d.weekday ? { weekday: toUndefined('weekday', d.weekday) } : {}),
                isodate: new Date(d.isodate),
                allDayLong: mapBoolean({ v: d.allDayLong, defaultV: false }),
            })),
            gallery: (gallery || []).map((d: any) => ({
                ...(d.cdnHost? { cdnHost: toUndefined('cdnHost', d.cdnHost) } : {}),
                s3Host: mapString(d.s3Host),
                s3Path: mapString(d.s3Path),
                type: mapString(d.type),
                url: mapString(d.url),
                w: mapNumber(d.w),
                h: mapNumber(d.h),
            })),
            participants: (participants || []).map((d: any) => ({
                userId: mapString(d.userId),
                status: mapString(d.status),
            })),
            name: mapString(name),
            slug: mapString(slug),
            isActive: mapBoolean({ v: isActive, defaultV: false }),
        };
    };

    private readonly validate = (mapped: Mapped): ValidateParseResult => {
        const schema = this.makeZodSchema();
        return validateParse<Mapped>(schema, mapped);
    };

    public readonly transform = (mapped: Mapped): IEdit => {
        const zodResult = this.validate(mapped);
        if (zodResult.hasError) throw new BadRequestException(zodResult.message!);

        return zodResult.data as unknown as IEdit;
    };
}

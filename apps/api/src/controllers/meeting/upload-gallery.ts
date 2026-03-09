import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { logError } from '#utils/log_error';
import { IMeetingController } from './params';
import { Either, successData } from '#utils/either';
import { IMeeting } from '#schemas/meeting/types';
import { mapString } from '#utils/mapper/string';
import { compressToTargetSize } from '#utils/image/compress';
import properties from '#properties';
import { BadRequestException } from '#exceptions/bad_request';
import { uploadToS3 } from '#helpers/s3';
import { MeetingBuilder } from '#schemas/meeting/utils';
import { mapNumber } from '#utils/mapper/number';
import { Request } from 'express';
import { PictureType } from '@repo/shared-types';
import { joinUrl } from '#utils/join_url';
import { getMeetingDao } from '#daos/singleton';

type IUploadGallery = IMeetingController['IUploadGallery'];
type Mapped = IUploadGallery

interface Props {
    file: Express.Multer.File;
    mapped: Mapped;
}

export class UploadGallery {
    public static readonly classId = Symbol.for('UploadGallery');

    private constructor() {}

    static construir(classId: symbol): UploadGallery {
        if (classId !== Symbol.for('Controller > Meeting')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new UploadGallery();
    }

    public readonly exec = async (props: Props): Promise<Either<IMeeting['IParams']>> => {
        try {
            const { file, mapped } = props;
            const { meetingId, h, w } = mapped;

            const meeting = await getMeetingDao().findOne({ _id: meetingId });
            if (_.isNil(meeting)) {
                throw new BadRequestException('Meeting não encontrado')
            }

            let content;
            const isImage = file.mimetype.startsWith('image/');
            if (isImage) {
                content = await compressToTargetSize(
                    file.buffer,
                    200 // KB
                );
            } else {
                content = file.buffer
            }
            const id = uuidv4();
            const s3Path = `meetings/${properties.nodeEnv}/${meeting.slug}/gallery/${id}.jpeg`;
            const bucket = properties.awsS3Bucket!;

            await uploadToS3({
                bucket,
                key: s3Path,
                body: content,
                contentType: file.mimetype,
            });

            const type = isImage ? 'image' : 'video';

            const builder = new MeetingBuilder(meeting);
            builder.addToGallery(
                {
                    type: type as keyof typeof PictureType,
                    w,
                    h,
                    s3Path,
                    url: joinUrl(properties.s3Host, s3Path),
                }
            );
            const updated = await builder.save();
            return successData(updated);
        } catch (error: unknown) {
            return logError(error, '/meeting/by-id');
        }
    };

    public readonly mapper = (body: Request['body']): Mapped => {
        const {
            w,
            h,
            meetingId,
        } = body;

        return {
            w: mapNumber(w),
            h: mapNumber(h),
            meetingId:  mapString(meetingId),
        };
    };
}

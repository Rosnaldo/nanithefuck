import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { logError } from '#utils/log_error';
import { UserCrud } from '#crud/user';
import { Either, successData } from '#utils/either';
import { IUser } from '#schemas/user/types';
import { compressToTargetSize } from '#utils/image/compress';
import properties from '#properties';
import { IUserAvatar, UserRole } from '@repo/shared-types';
import { UnauthorizedRequestException } from '#exceptions/unauthorized_request';
import { getUserDao } from '#daos/singleton';
import _ from 'lodash';
import { BadRequestException } from '#exceptions/bad_request';
import { joinUrl } from '#utils/join_url';

interface Props {
    buffer: Buffer;
    mimetype: string;
    userId: string;
    userSource: IUser['IParams'];
}

const s3 = new S3Client({
    region: properties.awsRegion,
    credentials: {
        accessKeyId: properties.awsAccessKeyId!,
        secretAccessKey: properties.awsSecretAccessKey!,
    },
});

type UploadParams = {
    bucket: string;
    key: string;
    body: Buffer;
    contentType?: string;
};

export async function uploadToS3({
    bucket,
    key,
    body,
    contentType = "application/octet-stream",
}: UploadParams): Promise<void> {
    await s3.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: contentType,
        })
    );
}

export class Avatar {
    public static readonly classId = Symbol.for('Controller > User > Criacao');
    private readonly crud: UserCrud;

    private constructor() {
        this.crud = new UserCrud();
    }

    static construir(classId: symbol): Avatar {
        if (classId !== Symbol.for('Controller > User')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new Avatar();
    }

    public readonly exec = async (props: Props): Promise<Either<IUser['IParams']>> => {
        try {
            const { userId, buffer, mimetype, userSource } = props;

            if (userSource.role !== UserRole.admin && userSource._id !== userId) {
                throw new UnauthorizedRequestException('Usuario sem permissão')
            }

            const compressed = await compressToTargetSize(
                buffer,
                200 // KB
            );
            const user = await getUserDao().findOne({ _id: userId });
            if (_.isNil(user)) {
                 throw new BadRequestException('Usuario não encontrado')
            }

            const s3Path = `/avatars/${properties.nodeEnv}/${user.slug}/${userId}.jpeg`;
            const bucket = properties.awsS3Bucket!;

            await uploadToS3({
                bucket,
                key: s3Path,
                body: compressed,
                contentType: mimetype,
            });

            const s3Host = properties.s3Host;
            const avatar = {
                s3Path,
                s3Host,
                cdnHost: '',
                url: joinUrl(s3Host, s3Path),
            } satisfies IUserAvatar;

            const userNew = await this.crud.update(userId, { avatar });
            return successData(userNew);
        } catch (error: unknown) {
            return logError(error, '/users/upload-avatar');
        }
    };
}

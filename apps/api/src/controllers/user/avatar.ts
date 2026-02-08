import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { logError } from '#utils/log_error';
import { UserCrud } from '#crud/user';
import { Either, successData } from '#utils/either';
import { IUser } from '#schemas/user/types';
import { compressToTargetSize } from '#utils/image/compress';
import properties from '#properties';

interface Props {
    buffer: Buffer;
    userId: string;
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
}: UploadParams): Promise<string> {
    await s3.send(
        new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        })
    );

    return `https://${bucket}.s3.amazonaws.com/${key}`;
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
            const { userId, buffer } = props;

            const compressed = await compressToTargetSize(
                buffer,
                200 // KB
            );
            const key = `avatars/${userId}.jpg`;
            const url = await uploadToS3({
                bucket: properties.awsS3Bucket!,
                key,
                body: compressed,
                contentType: "image/jpeg",
            });

            const user = await this.crud.update(userId, { avatar: url })
            return successData(user);
        } catch (error: unknown) {
            return logError(error, 'api/upload-avatar');
        }
    };
}

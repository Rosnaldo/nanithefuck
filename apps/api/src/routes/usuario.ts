import { UserController } from '#controllers/user';
import { compressToTargetSize } from '#utils/image/compress';
import upload from '#utils/image/multer-upload';
import { type Application } from 'express';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import properties from '#properties';

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

export default (app: Application) => {
    app.get(
        '/api/users/list',
        async (req, res) => {
            const { user } = req;
            const controller = new UserController();
            const params = controller.paginacao!.mapper(req.query);
            const either = await controller.paginacao!.get({ user, params });
            return res.status(200).send(either);
        }
    );
    app.get(
        '/api/users/by-email',
        async (req, res) => {
            const controller = new UserController();
            const params = controller.byEmail!.mapper(req.query);
            const either = await controller.byEmail!.get({ params });
            return res.status(200).send(either);
        }
    );
    app.post(
        '/api/users/create',
        async (req, res) => {
            const controller = new UserController();
            const mapped = controller.criacao!.mapper(req.body);
            const either = await controller.criacao!.exec({ mapped });
            return res.status(200).send(either);
        }
    );
    app.put(
        '/api/users/edit',
        async (req, res) => {
            const controller = new UserController();
            const mapped = controller.edit!.mapper({ _id: req.query._id, ...req.body });
            const either = await controller.edit!.exec({ mapped });
            return res.status(200).send(either);
        }
    );
    app.delete(
        '/api/users/delete',
        async (req, res) => {
            const controller = new UserController();
            const mapped = controller.delete!.mapper(req.query);
            const either = await controller.delete!.exec({ mapped });
            return res.status(200).send(either);
        }
    );
    app.post(
        '/api/upload-avatar',
        upload.single('image'),
        async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ error: 'Image is required' });
                }
            
                const compressed = await compressToTargetSize(
                    req.file.buffer,
                    200 // KB
                );

                const userId = 'f6f3u-dds'
                const key = `avatars/${userId}.jpg`;

                const url = await uploadToS3({
                    bucket: properties.awsS3Bucket!,
                    key,
                    body: compressed,
                    contentType: "image/jpeg",
                });

                return res.json({ url });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to upload image' });
            }
        }
    );
};

import { UserController } from '#controllers/user';
import { compressToTargetSize } from '#utils/image/compress';
import upload from '#utils/image/multer-upload';
import { type Application } from 'express';

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
        '/upload-avatar',
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
            
                // 🔹 Option 1: return image directly
                res.set('Content-Type', 'image/jpeg');
                return res.send(compressed);
            
                // 🔹 Option 2: save to disk / cloud
                // fs.writeFileSync('avatar.jpg', compressed)
            
                // 🔹 Option 3: upload to S3 / R2 / MinIO
                // const url = await uploadToStorage(compressed)
        
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to upload image' });
            }
        }
    );
};

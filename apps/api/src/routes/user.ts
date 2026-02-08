import { type Application } from 'express';

import { UserController } from '#controllers/user';
import upload from '#utils/image/multer-upload';
import { getUserMiddleware } from '#middleware/get_user';
import { authorizeMiddleware } from '#middleware/authorize';
import { UserRole } from '@repo/shared-types';

export default (app: Application) => {
    app.get(
        '/api/users/list',
        getUserMiddleware,
        authorizeMiddleware([UserRole.admin, UserRole.member]),
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
        getUserMiddleware,
        authorizeMiddleware([UserRole.admin, UserRole.member]),
        async (req, res) => {
            const controller = new UserController();
            const params = controller.byEmail!.mapper(req.query);
            const either = await controller.byEmail!.get({ params });
            return res.status(200).send(either);
        }
    );
    app.post(
        '/api/users/create',
        getUserMiddleware,
        authorizeMiddleware([UserRole.admin, UserRole.member]),
        async (req, res) => {
            const controller = new UserController();
            const mapped = controller.criacao!.mapper(req.body);
            const either = await controller.criacao!.exec({ mapped });
            return res.status(200).send(either);
        }
    );
    app.put(
        '/api/users/edit',
        getUserMiddleware,
        authorizeMiddleware([UserRole.admin, UserRole.member]),
        async (req, res) => {
            const controller = new UserController();
            console.log('rui', req.body)
            const mapped = controller.edit!.mapper({ ...req.body });
            const either = await controller.edit!.exec({ mapped, userSource: req.user });
            return res.status(200).send(either);
        }
    );
    app.delete(
        '/api/users/delete',
        getUserMiddleware,
        authorizeMiddleware([UserRole.admin, UserRole.member]),
        async (req, res) => {
            const controller = new UserController();
            const mapped = controller.delete!.mapper(req.query);
            const either = await controller.delete!.exec({ mapped });
            return res.status(200).send(either);
        }
    );
    app.post(
        '/api/upload-avatar',
        getUserMiddleware,
        authorizeMiddleware([UserRole.admin, UserRole.member]),
        upload.single('image'),
        async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ error: 'Image is required' });
                }

                const userId = req.user._id;
                const controller = new UserController();
                const either = await controller.avatar!.exec({ userId, buffer: req.file.buffer });
                return res.status(200).send(either);
            } catch (err) {
                res.status(500).json({ error: 'Failed to upload image' });
            }
        }
    );
};

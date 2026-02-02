import { MeetingController } from '#controllers/meeting';
import type { Application } from 'express';

export default (app: Application) => {
    app.get(
        '/api/meetings/list',
        async (req, res) => {
            const controller = new MeetingController();
            const params = controller.paginacao!.mapper(req.query);
            const either = await controller.paginacao!.get({ params });
            return res.status(200).send(either);
        }
    );
    app.get(
        '/api/meetings/by-name',
        async (req, res) => {
            const controller = new MeetingController();
            const mapped = controller.byName!.mapper(req.query);
            const either = await controller.byName!.get({ mapped });
            return res.status(200).send(either);
        }
    );
    app.post(
        '/api/meetings/create',
        async (req, res) => {
            const controller = new MeetingController();
            const mapped = controller.criacao!.mapper(req.body);
            const either = await controller.criacao!.exec({ mapped });
            return res.status(200).send(either);
        }
    );
    app.put(
        '/api/meetings/edit',
        async (req, res) => {
            const controller = new MeetingController();
            const mapped = controller.edit!.mapper({ _id: req.query._id, ...req.body });
            const either = await controller.edit!.exec({ mapped });
            return res.status(200).send(either);
        }
    );
    app.delete(
        '/api/meetings/delete',
        async (req, res) => {
            const controller = new MeetingController();
            const mapped = controller.delete!.mapper(req.query);
            const either = await controller.delete!.exec({ mapped });
            return res.status(200).send(either);
        }
    );
};

import { ParticipantController } from '#controllers/participant';
import type { Application } from 'express';

export default (app: Application) => {
    app.get(
        '/api/participants/pagination',
        async (req, res) => {
            const controller = new ParticipantController();
            const mapped = controller.pagination!.mapper(req.query);
            const either = await controller.pagination!.get({ mapped });
            return res.status(200).send(either);
        }
    );
};

import { mockMeeting } from '../../entities/schemas/meeting/mock';
import { MeetingController } from 'src/controllers/meeting';
import { mongooseBootstrap } from 'src/mongoose_bootstrap';
import { disconnectMain } from 'src/db/singleton';
import { IMeeting } from 'src/entities/schemas/meeting/types';

let meeting: IMeeting['IParams'];

beforeAll(async () => {
    await mongooseBootstrap();
    const builder = mockMeeting({
        init: {},
        participants: [],
        days: [],
        gallery: [],
    });
    meeting = await builder.save();
}, 300_000);

afterAll(async () => {
    await disconnectMain();
});

describe('Controller > Meeting > BySlug', () => {
    it('get', async () => {
        const params = {
            slug: meeting.slug,
        };

        const controller = new MeetingController();

        const mapped = controller.bySlug!.mapper(params)
        const result = await controller.bySlug.get({ mapped });

        console.log(result)
    });
});

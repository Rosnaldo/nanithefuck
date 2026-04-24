import { Expect, Equal } from 'src/types';
import { IDayParams, IParticipantParams, IPictureParams } from 'src/entities/schemas/meeting/types';
import { MeetingUtils } from 'src/entities/schemas/meeting/utils';
import z from 'zod';

const utils = new MeetingUtils();

describe('Entities > Schema > Meeting', () => {
    it('validate type day', async () => {
        type IUtils = z.infer<typeof utils.zodDaySchema>;
        type _t = Expect<Equal<IDayParams, IUtils>>
    });

    it('validate type participants', async () => {
        type IUtils = z.infer<typeof utils.zodParticipantSchema>;
        type _t = Expect<Equal<IParticipantParams, IUtils>>
    });

    it('validate type picture', async () => {
        type IUtils = z.infer<typeof utils.zodPictureSchema>;
        type _t = Expect<Equal<IPictureParams, IUtils>>
    });
});

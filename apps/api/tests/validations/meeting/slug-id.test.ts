import { Expect, Equal } from 'src/types';
import { IMeeting } from 'src/entities/schemas/meeting/types';
import type { IOutput } from 'src/validations/meetings/by-slug';
import { MeetingUtils } from 'src/entities/schemas/meeting/utils';
import z from 'zod';

const utils = new MeetingUtils();

describe('Validations > Meeting > BySlug', () => {
    it('validate output type ', async () => {
        type IUtils = z.infer<typeof utils.zodSchema>;
        type _t = Expect<Equal<IMeeting['IParams'], IUtils>>
    });
});

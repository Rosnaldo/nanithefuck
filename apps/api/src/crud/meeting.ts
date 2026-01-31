import mongoose, { ProjectionType } from 'mongoose';
import { getMeetingDao } from '#daos/singleton';

import { BadRequestException } from '#exceptions/bad_request';
import { UniqueIndex } from '#indexes/unique_index';
import { ICrud } from './type';
import { isMongoError } from '#utils/is_mongo_error';
import { FilterQuery, QueryOptions } from 'mongoose';
import { IMeeting } from '#schemas/meeting/types';
import { MeetingUtils } from '#schemas/meeting/utils';

export class MeetingCrud implements ICrud<IMeeting['IParams']> {
    public readonly utils = new MeetingUtils();

    public readonly find = async (data: FilterQuery<IMeeting['IParams']>, projection: ProjectionType<IMeeting['IParams']> = {}, options: QueryOptions<IMeeting['IParams']> = {}): Promise<Array<IMeeting['IParams']>> => {
        const meetings = await getMeetingDao().find(data, projection, options);
        return meetings.map((u) => this.utils.toObject(u));
    };

    public readonly findByIds = async (ids: string[], projection: ProjectionType<IMeeting['IParams']> = {}): Promise<Array<IMeeting['IParams']>> => {
        return await this.find({ _id: { $in: ids } }, projection);
    };

    public readonly findById = async (_id: string): Promise<IMeeting['IParams']> =>
        await this.findOne({ _id });

    public readonly findOne = async (data: FilterQuery<IMeeting['IParams']>): Promise<IMeeting['IParams']> => {
        const meeting = await getMeetingDao().findOne(data);
        if (!meeting) throw new BadRequestException('Meeting não encontrado');
        return this.utils.toObject(meeting);
    };

    public create = async (data: Partial<IMeeting['IParams']>): Promise<IMeeting['IParams']> => {
        try {
            const meeting = await getMeetingDao().inserir(data);
            return this.utils.toObject(meeting);
        } catch (error: unknown) {
            this.verifyError(error);
            throw error;
        }
    };

    public update = async (_id: string, data: Partial<IMeeting['IParams']>): Promise<IMeeting['IParams']> => {
        try {
            const meeting = await getMeetingDao().findOneAndUpdate(_id, data);
            if (!meeting) throw new BadRequestException('Erro de Update: Meeting não encontrado');
            return this.utils.toObject(meeting);
        } catch (error: unknown) {
            this.verifyError(error);
            throw error;
        }
    };

    public delete = async (_id: string): Promise<void> => {
        try {
            return await getMeetingDao().delete(_id).then();
        } catch (error: unknown) {
            this.verifyError(error);
            throw error;
        }
    };

    private readonly verifyError = (error: unknown): void => {
        if (error instanceof Error) {
            if (isMongoError(error)) {
                this.verifyUniqueIndexError(error);
            }
            this.verifyValidationError(error);
        }
    };

    private readonly verifyValidationError = (error: unknown): void => {
        if (error instanceof mongoose.Error.ValidationError) {
            throw new BadRequestException(error?.message);
        }
    };

    private readonly verifyUniqueIndexError = (error: Error): void => {
        const uniqueName = error.message.includes(UniqueIndex.Meeting.name.key);
        if (uniqueName) {
            throw new BadRequestException(UniqueIndex.Meeting.name.error);
        }
    };
}

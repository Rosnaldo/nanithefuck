import { Types } from 'mongoose';
import type { DeleteResult, FilterQuery, ProjectionType, QueryOptions, SaveOptions } from 'mongoose';

import { GetIndexes } from './types';
import { IMeeting } from '#schemas/meeting/types';

export type IMeetingDao = ReturnType<typeof MeetingFactoryDao>;

export const MeetingFactoryDao = (model: IMeeting['IModel']) => ({
    count: async (query: FilterQuery<IMeeting['IParams']>): Promise<number> =>
        model.countDocuments(query),

    exists: async (_id: Types.ObjectId): Promise<boolean> => {
        const result = await model.exists({ _id });
        return !!result;
    },

    getIndexes: async (): Promise<GetIndexes> => {
        return model.collection.getIndexes();
    },

    inserir: async (data: Partial<IMeeting['IParams']>, options: SaveOptions = {}): Promise<IMeeting['IDocument']> =>
        await new model(data).save(options),

    find: async (
        query: FilterQuery<IMeeting>,
        projection: ProjectionType<IMeeting['IParams']>  = {},
        options: QueryOptions<IMeeting['IParams']>  = {}
    ): Promise<Array<IMeeting['IDocument']>> => await model.find(query, projection, options),

    findById: async (_id: string, projection: any = {}): Promise<IMeeting['IDocument'] | null> =>
        await model.findById(_id, projection),

    findOne: async (query: FilterQuery<IMeeting['IParams']>, projection: ProjectionType<IMeeting['IParams']> = {}): Promise<IMeeting['IDocument'] | null> =>
        await model.findOne(query, projection),

    findByEmail: async (email: string): Promise<IMeeting['IDocument'] | null> => model.findOne({ email }),

    findOneAndUpdate: async (
        _id: string,
        atualizacoes: Partial<IMeeting['IParams']>
    ): Promise<IMeeting['IDocument'] | null> =>
        await model.findOneAndUpdate(
            { _id },
            { $set: atualizacoes },
            {}
        ),

    delete: async (
            _id: string,
        ): Promise<DeleteResult> =>
            await model.deleteOne(
                { _id },
            ),
});

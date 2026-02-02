import { Types } from 'mongoose';
import type { DeleteResult, FilterQuery, ProjectionType, QueryOptions, SaveOptions } from 'mongoose';

import { GetIndexes } from './types';
import { IParticipant } from '#schemas/participant/types';

export type IParticipantDao = ReturnType<typeof ParticipantFactoryDao>;

export const ParticipantFactoryDao = (model: IParticipant['IModel']) => ({
    count: async (query: FilterQuery<IParticipant['IParams']>): Promise<number> =>
        model.countDocuments(query),

    exists: async (_id: Types.ObjectId): Promise<boolean> => {
        const result = await model.exists({ _id });
        return !!result;
    },

    getIndexes: async (): Promise<GetIndexes> => {
        return model.collection.getIndexes();
    },

    inserir: async (data: Partial<IParticipant['IParams']>, options: SaveOptions = {}): Promise<IParticipant['IDocument']> =>
        await new model(data).save(options),

    find: async (
        query: FilterQuery<IParticipant>,
        projection: ProjectionType<IParticipant['IParams']>  = {},
        options: QueryOptions<IParticipant['IParams']>  = {}
    ): Promise<Array<IParticipant['IDocument']>> => await model.find(query, projection, options),


    findOneAndUpdate: async (
        _id: string,
        atualizacoes: Partial<IParticipant['IParams']>
    ): Promise<IParticipant['IDocument'] | null> =>
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

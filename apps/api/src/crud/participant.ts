import mongoose, { ProjectionType } from 'mongoose';

import { BadRequestException } from '#exceptions/bad_request';
import { UniqueIndex } from '#indexes/unique_index';
import { isMongoError } from '#utils/is_mongo_error';
import { FilterQuery, QueryOptions } from 'mongoose';
import { getParticipantModel } from '#models/singleton';
import { ParticipantUtils } from '#schemas/participant/utils';
import { IParticipant } from '#schemas/participant/types';

export class ParticipantCrud {
    public readonly utils = new ParticipantUtils();

    public readonly find = async (data: FilterQuery<IParticipant['IParams']>, projection: ProjectionType<IParticipant['IParams']> = {}, options: QueryOptions<IParticipant['IParams']> = {}): Promise<Array<IParticipant['IParams']>> => {
        const participants = await getParticipantModel().find(data, projection, options);
        return participants.map((u) => this.utils.toObject(u));
    };

     public create = async (data: Partial<IParticipant['IParams']>): Promise<IParticipant['IParams']> => {
            try {
                const participant = await getParticipantModel().insertOne(data);
                return this.utils.toObject(participant);
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

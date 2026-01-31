import mongoose from 'mongoose';

import { ParticipantStatus, ParticipantStatusAll } from '@repo/shared-types';
import { IParticipantSchema, IMeeting } from './types';
import { userCollectionName } from '#const/collection_name_mapping';

const { Schema } = mongoose;

export const ParticipantSchema = new Schema<IParticipantSchema>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: userCollectionName,
            require: false
        },
        status: {
            type: String,
            enum: ParticipantStatusAll,
            default: ParticipantStatus.pending,
        }
    },
);

export const MeetingSchema = new Schema<IMeeting['ISchema']>(
    {
        name: { type: String, required: true },
        start: { type: Date, required: true },
        finish: { type: Date, required: true },
        description: { type: String, required: true },
        participantIds: [
            {
                type: Schema.Types.ObjectId,
                ref: userCollectionName,
            },
        ],
    },
    {
        strict: false,
        timestamps: {
            createdAt: 'dataCriacao',
            updatedAt: 'dataAtualizacao'
        }
    }
);

MeetingSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
    this.setOptions({ returnDocument: 'after', runValidators: true, context: 'query' });
    next();
});

MeetingSchema.virtual('user', {
    ref: userCollectionName,
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
});

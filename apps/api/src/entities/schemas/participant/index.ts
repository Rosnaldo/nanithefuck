import mongoose from 'mongoose';

import { ParticipantStatus, ParticipantStatusAll } from '@repo/shared-types';
import { IParticipantSchema } from './types';
import { meetingCollectionName, userCollectionName } from '#const/collection_name_mapping';

const { Schema } = mongoose;

export const ParticipantSchema = new Schema<IParticipantSchema>(
    {
        meetingId: {
            type: Schema.Types.ObjectId,
            ref: meetingCollectionName,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: userCollectionName,
            required: true
        },
        status: {
            type: String,
            enum: ParticipantStatusAll,
            default: ParticipantStatus.pending,
        }
    },
    {
        strict: false,
        timestamps: {
            createdAt: 'dataCriacao',
            updatedAt: 'dataAtualizacao'
        },
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

ParticipantSchema.virtual('user', {
    ref: userCollectionName,
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
});

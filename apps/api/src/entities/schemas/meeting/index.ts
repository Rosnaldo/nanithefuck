import mongoose from 'mongoose';

import { userCollectionName } from '#const/collection_name_mapping';
import { IMeeting } from './types';

const { Schema } = mongoose;

export const MeetingSchema = new Schema<IMeeting['ISchema']>(
    {
        name: { type: String, required: true },
        days: [
            {
                day: { type: Date, required: true },
                start: { type: Date, required: true },
                finish: { type: Date, required: true },
            }
        ],
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

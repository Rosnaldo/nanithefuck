import mongoose from 'mongoose';
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
        gallery: [
            {
                type: { type: String, required: true },
                url: { type: String, required: true },
                w: { type: Number, required: true },
                h: { type: Number, required: true },
            }
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

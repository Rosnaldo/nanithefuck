import mongoose from 'mongoose';
import { IMeeting } from './types';
import { ParticipantStatus, Weekday } from '@repo/shared-types';

const { Schema } = mongoose;

export const MeetingSchema = new Schema<IMeeting['ISchema']>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true },
        isActive: { type: Boolean, default: false, required: true },
        days: [
            {
                day: { type: Number, required: true },
                month: { type: Number, required: true },
                year: { type: Number, required: true },
                isodate: { type: Date, required: true },
                weekday: {
                    type: String,
                    enum: Object.keys(Weekday),
                    required: true,
                },
                formatted: { type: String, required: true },
                start: { type: String, required: false },
                finish: { type: String, required: false },
                allDayLong: { type: Boolean, required: true, default: false },
            }
        ],
        gallery: [
            {
                type: { type: String, required: true },
                s3Path: { type: String, required: true },
                s3Host: { type: String, required: true },
                cdnHost: { type: String, required: false },
                url: { type: String, required: true },
                w: { type: Number, required: true },
                h: { type: Number, required: true },
            }
        ],
        participants: [
            {
                userId: { type: String, required: true },
                status: {
                    type: String,
                    enum: Object.keys(ParticipantStatus),
                    required: true,
                },
            }
        ],
    },
    {
        strict: false,
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
    }
);


MeetingSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
    this.setOptions({ returnDocument: 'after', runValidators: true, context: 'query' });
    next();
});

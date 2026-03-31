import mongoose from 'mongoose';
import { IDaySchema, IMeeting, IPictureSchema } from './types';
import { ParticipantStatus, Weekday } from '@repo/shared-types';

const { Schema } = mongoose;

const PictureSchema = new Schema<IPictureSchema>(
  {
    type: { type: String, required: true },
    s3Path: { type: String, required: true },
    s3Host: { type: String, required: true },
    cdnHost: { type: String, required: false },
    url: { type: String, required: true },
    w: { type: Number, required: true },
    h: { type: Number, required: true },
  },
);

const DaySchema = new Schema<IDaySchema>(
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
  },
);

export const MeetingSchema = new Schema<IMeeting['ISchema']>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true },
        isActive: { type: Boolean, default: false, required: true },
        days: [DaySchema],
        gallery: [PictureSchema],
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

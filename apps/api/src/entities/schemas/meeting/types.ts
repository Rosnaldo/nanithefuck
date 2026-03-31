import { Types, HydratedDocument, Model } from 'mongoose';

import { Query } from 'mongoose';
import { IMeeting as IMeetingParams, ParticipantStatus, Weekday } from '@repo/shared-types';

export interface IPictureSchema {
    type: string;
    s3Path: string;
    s3Host: string;
    cdnHost?: string;
    url: string;
    w: number;
    h: number;
}

export interface IDaySchema {
    day: number;
    month: number;
    year: number;
    formatted: string;
    start?: string;
    finish?: string;
    weekday: keyof typeof Weekday;
    isodate: Date;
    allDayLong: boolean;
}

export interface IParticipantSchema {
    userId: Types.ObjectId;
    status: keyof typeof ParticipantStatus;
}

export interface IMeetingSchema {
    _id: Types.ObjectId;
    name: string;
    slug: string;
    isActive: boolean;
    days: Array<IDaySchema>;
    gallery: Array<IPictureSchema>;
    participants: Array<IParticipantSchema>;
}

type IMeetingDocument = HydratedDocument<IMeetingSchema> & { _id: Types.ObjectId } ;

type IMeetingModel = Model<IMeeting['ISchema']>;

type IMeetingQuery = Query<any, any, any, IMeeting['ISchema']>;

export interface IMeeting {
    ISchema: IMeetingSchema;
    IDocument: IMeetingDocument;
    IParams: IMeetingParams;
    IModel: IMeetingModel;
    IQuery: IMeetingQuery;
}

import { Types, HydratedDocument, Model } from 'mongoose';

import { Query } from 'mongoose';
import { IMeeting as IMeetingParams, IDay, IPicture, ParticipantStatus } from '@repo/shared-types';

interface IParticipantSchema {
    userId: Types.ObjectId;
    status: keyof typeof ParticipantStatus;
}

export interface IMeetingSchema {
    _id: Types.ObjectId;
    name: string;
    slug: string;
    days: Array<IDay>;
    gallery: Array<IPicture>;
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

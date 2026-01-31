import { Types, HydratedDocument, Model } from 'mongoose';

import { Query } from 'mongoose';
import { ParticipantStatus, IMeeting as IMeetingParams } from '@repo/shared-types';

export interface IParticipantSchema {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    status: keyof typeof ParticipantStatus;
}

export interface IMeetingSchema {
    _id: Types.ObjectId;
    name: string;
    start: Date;
    finish: Date;
    description: string;
    participantIds: string[];
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

import { Types, HydratedDocument, Model } from 'mongoose';

import { Query } from 'mongoose';
import { IMeeting as IMeetingParams, IDay, IPicture } from '@repo/shared-types';

export interface IMeetingSchema {
    _id: Types.ObjectId;
    name: string;
    days: Array<IDay>;
    gallery: Array<IPicture>;
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

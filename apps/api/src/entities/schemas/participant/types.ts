import { Types, HydratedDocument, Model } from 'mongoose';

import { Query } from 'mongoose';
import { ParticipantStatus } from '@repo/shared-types';
import { IParticipant as IParticipantParams } from '@repo/shared-types';
import { IUser } from '#schemas/user/types';

export interface IParticipantSchema {
    _id: Types.ObjectId;
    meetingId: Types.ObjectId;
    userId: Types.ObjectId;
    user?: IUser['IDocument'];
    status: keyof typeof ParticipantStatus;
}

type IParticipantDocument = HydratedDocument<IParticipantSchema> & { _id: Types.ObjectId } ;

type IParticipantModel = Model<IParticipant['ISchema']>;

type IParticipantQuery = Query<any, any, any, IParticipant['ISchema']>;

export interface IParticipant {
    ISchema: IParticipantSchema;
    IDocument: IParticipantDocument;
    IParams: IParticipantParams;
    IModel: IParticipantModel;
    IQuery: IParticipantQuery;
}

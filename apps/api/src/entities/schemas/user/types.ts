import { Types, HydratedDocument, Model } from 'mongoose';

import { IUser as IUserParams } from '@repo/shared-types';
import { Query } from 'mongoose';

export interface IUserSchema {
    _id: Types.ObjectId;
    firstName: string;
    lastName?: string;
    email?: string;
    role?: string;
    avatar?: string;
}

type IUserDocument = HydratedDocument<IUserSchema> & { _id: Types.ObjectId } ;

type IUserModel = Model<IUser['ISchema']>;

type IUserQuery = Query<any, any, any, IUser['ISchema']>;

export interface IUser {
    ISchema: IUserSchema;
    IDocument: IUserDocument;
    IParams: IUserParams;
    IModel: IUserModel;
    IQuery: IUserQuery;
}

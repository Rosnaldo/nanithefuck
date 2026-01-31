
import { meetingCollectionName, userCollectionName } from '#const/collection_name_mapping';
import { getMainConnection } from '#db/singleton';
import { MeetingSchema } from '#schemas/meeting';
import { IMeeting } from '#schemas/meeting/types';

import { UserSchema } from '#schemas/user';
import { IUser } from '#schemas/user/types';

let UserModel: IUser['IModel'];
let MeetingModel: IMeeting['IModel'];

export const getUserModel = (): IUser['IModel'] => {
    if (!UserModel) {
        const connection = getMainConnection();
        UserModel = connection.model(
            userCollectionName,
            UserSchema,
            userCollectionName
        ) as IUser['IModel'];
    }
    return UserModel;
};

export const getMeetingModel = (): IMeeting['IModel'] => {
    if (!MeetingModel) {
        const connection = getMainConnection();
        MeetingModel = connection.model(
            meetingCollectionName,
            MeetingSchema,
            meetingCollectionName
        ) as IMeeting['IModel'];
    }
    return MeetingModel;
};

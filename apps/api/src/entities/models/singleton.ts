
import { meetingCollectionName, migrationCollectionName, userCollectionName } from '#const/collection_name_mapping';
import { getMainConnection } from '#db/singleton';
import { MeetingSchema } from '#schemas/meeting';
import { IMeeting } from '#schemas/meeting/types';
import { IMigration, MigrationSchema } from '#schemas/migration';

import { UserSchema } from '#schemas/user';
import { IUser } from '#schemas/user/types';

let UserModel: IUser['IModel'];
let MeetingModel: IMeeting['IModel'];
let MigrationModel: IMigration['IModel'];

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

export const getMigrationModel = (): IMigration['IModel'] => {
    if (!MigrationModel) {
        const connection = getMainConnection();
        MigrationModel = connection.model(
            migrationCollectionName,
            MigrationSchema,
            migrationCollectionName
        ) as IMigration['IModel'];
    }
    return MigrationModel;
};

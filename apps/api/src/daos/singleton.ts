import { getMeetingModel, getMigrationModel, getUserModel } from "#models/singleton";
import { IMeetingDao, MeetingFactoryDao } from "./meeting_dao";
import { IMigrationDao, MigrationFactoryDao } from "./migration_dao";
import { IUserDao, UserFactoryDao } from "./user_dao";

let UserDao: IUserDao;
let MeetingDao: IMeetingDao;
let MigrationDao: IMigrationDao;

export const getUserDao = (): IUserDao => {
    if (!UserDao) {
        UserDao = UserFactoryDao(getUserModel());
    }
    return UserDao;
};

export const getMeetingDao = (): IMeetingDao => {
    if (!MeetingDao) {
        MeetingDao = MeetingFactoryDao(getMeetingModel());
    }
    return MeetingDao;
};

export const getMigrationDao = (): IMigrationDao => {
    if (!MigrationDao) {
        MigrationDao = MigrationFactoryDao(getMigrationModel());
    }
    return MigrationDao;
};

import { getMeetingModel, getParticipantModel, getUserModel } from "#models/singleton";
import { IMeetingDao, MeetingFactoryDao } from "./meeting_dao";
import { IParticipantDao, ParticipantFactoryDao } from "./participant_dao";
import { IUserDao, UserFactoryDao } from "./user_dao";

let UserDao: IUserDao;
let MeetingDao: IMeetingDao;
let ParticipantDao: IParticipantDao;

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

export const getParticipantDao = (): IParticipantDao => {
    if (!ParticipantDao) {
        ParticipantDao = ParticipantFactoryDao(getParticipantModel());
    }
    return ParticipantDao;
};

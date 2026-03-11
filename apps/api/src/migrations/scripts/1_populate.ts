import { getUserDao } from "#daos/singleton";
import { MeetingBuilder } from "#schemas/meeting/utils";
import { UserBuilder } from "#schemas/user/utils";
import { IUserAvatar, ParticipantStatus } from "@repo/shared-types";
import { IUser } from "#schemas/user/types";
import properties from "#properties";

type UserPick = Pick<IUser['IParams'], 'firstName' | 'lastName' | 'email' | 'role'> & {
    avatar: Pick<IUserAvatar, 's3Path'>;
};

const admin: UserPick = {
    firstName: "Andrey",
    lastName: "Tsuzuki",
    email: "andreytsuzuki@gmail.com",
    avatar: {
        s3Path: `avatars/${properties.nodeEnv}/young-brazilian-man-smiling.jpg`
    },
    role: 'admin',
};

export const migrate = {
    run: async () => {
        await (new UserBuilder())
            .setInit({
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                role: admin.role,
            })
            .save();
        const user = await getUserDao().findOne({ email: admin.email });

        const name = 'Chacara Meets';
        return await (new MeetingBuilder())
            .setInit({ name, isActive: false })
            .setParticipants([
                {
                    userId: user!._id.toString(),
                    status: ParticipantStatus.confirmed,
                }
            ])
            .save()
    }
}

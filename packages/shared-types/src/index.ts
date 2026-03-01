export const ParticipantStatus = {
    confirmed: 'confirmed',
    pending: 'pending',
} as const;

export const ParticipantStatusAll = [
    ParticipantStatus.confirmed,
    ParticipantStatus.pending,
];

export const UserRole = {
    admin: 'admin',
    member: 'member',
} as const;

export const UserRoleAll = [
    UserRole.admin,
    UserRole.member,
];

export interface IUser {
    _id: string;
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    role: keyof typeof UserRole;
}

export interface IParticipant {
    _id: string;
    meetingId: string;
    meeting?: IMeeting;
    userId: string;
    user?: IUser;
    status: keyof typeof ParticipantStatus;
}

export interface IDay {
    day: Date;
    start: Date;
    finish: Date;
}

export interface IPicture {
    type: string;
    url: string;
    w: number;
    h: number;
}

export interface IMeeting {
    _id: string;
    name: string;
    days: Array<IDay>;
    gallery: Array<IPicture>;
}

export class UserUtils {
    public readonly getFullname = (user?: IUser) => `${user?.firstName} ${user?.lastName}`;

    public readonly getInitials = (user?: IUser) => {
        const name = user?.firstName;
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    public readonly getAvatarColor = (
        colors: readonly string[],
        user?: IUser
    ) => {
        if (!colors.length) return '';

        const seed = user?.email || user?._id || '';
        let hash = 0;

        for (let i = 0; i < seed.length; i++) {
            hash = (hash << 5) - hash + seed.charCodeAt(i);
            hash |= 0;
        }

        return colors[Math.abs(hash) % colors.length];
    };
};

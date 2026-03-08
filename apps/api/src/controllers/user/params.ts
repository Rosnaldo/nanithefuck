import { IUser } from "#schemas/user/types";

interface IParticipants {
    meetingId: string;
}

interface IPaginacao {
    search?: string;
    page: number;
    pageSize: number;
    isPagination?: boolean;
}

interface ICriacao {
    firstName: IUser['IParams']['firstName'];
    lastName: IUser['IParams']['lastName'];
    email: IUser['IParams']['email'];
    role: IUser['IParams']['role'];
}

interface IByEmail {
    email: IUser['IParams']['email'];
    firstName: IUser['IParams']['firstName'];
    lastName: IUser['IParams']['lastName'];
}

interface IDelete {
    _id: IUser['IParams']['_id'];
}

interface IEdit {
    _id: IUser['IParams']['_id'];
    firstName?: IUser['IParams']['firstName'];
    lastName?: IUser['IParams']['lastName'];
    email?: IUser['IParams']['email'];
    role?: IUser['IParams']['role'];
}

export interface IUserController {
    IParticipants: IParticipants;
    IPaginacao: IPaginacao;
    ICriacao: ICriacao;
    IByEmail: IByEmail;
    IDelete: IDelete;
    IEdit: IEdit;
}

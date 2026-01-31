import { IUser } from "#schemas/user/types";

interface IPaginacao {
    page: number;
    pageSize: number;
}

interface ICriacao {
    firstName: IUser['IParams']['firstName'];
    lastName: IUser['IParams']['lastName'];
    email: IUser['IParams']['email'];
    role: IUser['IParams']['role'];
}

interface IByEmail {
    email?: IUser['IParams']['email'];
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
    IPaginacao: IPaginacao;
    ICriacao: ICriacao;
    IByEmail: IByEmail;
    IDelete: IDelete;
    IEdit: IEdit;
}

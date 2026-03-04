import { IMeeting } from "#schemas/meeting/types";

interface IById {
    _id: string;
}

interface IPaginacao {
    page: number;
    pageSize: number;
}

interface ICriacao {
    name: IMeeting['IParams']['name'];
    days: IMeeting['IParams']['days'];
}

interface IDelete {
    _id: IMeeting['IParams']['_id'];
}

interface IEdit {
    _id: IMeeting['IParams']['_id'];
    name?: IMeeting['IParams']['name'];
    days?: IMeeting['IParams']['days'];
}

export interface IMeetingController {
    IPaginacao: IPaginacao;
    IById: IById;
    ICriacao: ICriacao;
    IDelete: IDelete;
    IEdit: IEdit;
}

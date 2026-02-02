import { IMeeting } from "#schemas/meeting/types";

interface IByName {
    name: string;
}

interface IPaginacao {
    page: number;
    pageSize: number;
}

interface ICriacao {
    name: IMeeting['IParams']['name'];
    days: IMeeting['IParams']['days'];
    participantIds: IMeeting['IParams']['participantIds'];
}

interface IDelete {
    _id: IMeeting['IParams']['_id'];
}

interface IEdit {
    _id: IMeeting['IParams']['_id'];
    name?: IMeeting['IParams']['name'];
    days?: IMeeting['IParams']['days'];
    participantIds?: IMeeting['IParams']['participantIds'];
}

export interface IMeetingController {
    IPaginacao: IPaginacao;
    IByName: IByName;
    ICriacao: ICriacao;
    IDelete: IDelete;
    IEdit: IEdit;
}

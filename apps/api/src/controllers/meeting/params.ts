import { IMeeting } from "#schemas/meeting/types";

interface IPaginacao {
    page: number;
    pageSize: number;
}

interface ICriacao {
    name: IMeeting['IParams']['name'];
    start: IMeeting['IParams']['start'];
    finish: IMeeting['IParams']['finish'];
    participantIds: IMeeting['IParams']['participantIds'];
    description: IMeeting['IParams']['description'];
}

interface IDelete {
    _id: IMeeting['IParams']['_id'];
}

interface IEdit {
    _id: IMeeting['IParams']['_id'];
    name?: IMeeting['IParams']['name'];
    start?: IMeeting['IParams']['start'];
    finish?: IMeeting['IParams']['finish'];
    participantIds?: IMeeting['IParams']['participantIds'];
    description?: IMeeting['IParams']['description'];
}

export interface IMeetingController {
    IPaginacao: IPaginacao;
    ICriacao: ICriacao;
    IDelete: IDelete;
    IEdit: IEdit;
}

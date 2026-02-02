interface IPaginacao {
    page: number;
    pageSize: number;
    meetingId: string;
}

export interface IParticipantController {
    IPaginacao: IPaginacao;
}

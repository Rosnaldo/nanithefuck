import { IMeeting } from "#schemas/meeting/types";
import { IPicture } from "@repo/shared-types";

interface IById {
    _id: string;
}

interface IBySlug {
    slug: string;
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
    name: IMeeting['IParams']['name'];
    slug: IMeeting['IParams']['slug'];
    days: IMeeting['IParams']['days'];
    gallery: IMeeting['IParams']['gallery'];
    participants: IMeeting['IParams']['participants'];
}

interface IUploadGallery {
    meetingId: string;
    h: IPicture['h'];
    w: IPicture['w'];
}

export interface IMeetingController {
    IPaginacao: IPaginacao;
    IById: IById;
    IBySlug: IBySlug;
    ICriacao: ICriacao;
    IDelete: IDelete;
    IEdit: IEdit;
    IUploadGallery: IUploadGallery;
}

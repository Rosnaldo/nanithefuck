import { Request } from 'express';

import { logError } from '#utils/log_error';
import { EitherPaginacao, successData } from '#utils/either_paginacao';
import { mapNumber } from '#utils/mapper/number';
import { mapString } from '#utils/mapper/string';
import { IParticipantController } from './params';
import { ParticipantCrud } from '#crud/participant';
import { IParticipant } from '#schemas/participant/types';
import { getParticipantDao } from '#daos/singleton';

type IPaginacao = IParticipantController['IPaginacao'];

interface Props {
    mapped: IPaginacao;
}

export class Pagination {
    public readonly classId = Symbol.for('Controller > Participant > Paginacao');
    private readonly crud: ParticipantCrud;

    private constructor() {
        this.crud = new ParticipantCrud();
    }

    static construir(classId: symbol): Pagination {
        if (classId !== Symbol.for('Controller > Participant')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new Pagination();
    }

    public readonly get = async (props: Props): Promise<EitherPaginacao<IParticipant['IParams']>> => {
        try {
            const { mapped } = props;
            const { page, pageSize, meetingId } = mapped;
            const query = { meetingId };
            const skip = (page - 1) * pageSize;
            const populate = {
                populate: [
                    { path: "user" },
                ]
            };

            const list = await this.crud.find(query, {}, { limit: pageSize, skip, ...populate });
            const totalRecords = await getParticipantDao().count(query);

            return successData(list, {
                currentPage: page,
                totalPages: Math.ceil(totalRecords / pageSize),
                totalRecords,
                size: pageSize
            });
        } catch (error: unknown) {
            return logError(error, '/participant/pagination');
        }
    };

    public readonly mapper = (body: Request['body']): IPaginacao => {
        const {
            page,
            pageSize,
            meetingId,
        } = body;

        return {
            pageSize: mapNumber(pageSize, 10),
            page: mapNumber(page, 1),
            meetingId: mapString(meetingId),
        };
    };
}

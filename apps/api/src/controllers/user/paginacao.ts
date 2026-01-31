import { Request } from 'express';

import { getUserDao } from '#daos/singleton';

import { IUser } from '#schemas/user/types';
import { logError } from '#utils/log_error';
import { UserCrud } from '#crud/user';
import { IUserController } from './params';
import { EitherPaginacao, successData } from '#utils/either_paginacao';
import { mapNumber } from '#utils/mapper/number';

type IPaginacao = IUserController['IPaginacao'];

interface Props {
    params: IPaginacao;
    user: IUser['IParams'];
}

export class Paginacao {
    public readonly classId = Symbol.for('Controller > User > Paginacao');
    private readonly crud: UserCrud;

    private constructor() {
        this.crud = new UserCrud();
    }

    static construir(classId: symbol): Paginacao {
        if (classId !== Symbol.for('Controller > User')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new Paginacao();
    }

    public readonly get = async (props: Props): Promise<EitherPaginacao<IUser['IParams']>> => {
        try {
            const { params } = props;
            const { page, pageSize } = params;
            const query = {};
            const skip = (page - 1) * pageSize;

            const list = await this.crud.find(query, {}, { limit: pageSize, skip });
            const totalRecords = await getUserDao().count(query);

            return successData(list, {
                currentPage: page,
                totalPages: Math.ceil(totalRecords / pageSize),
                totalRecords,
                size: pageSize
            });
        } catch (error: unknown) {
            return logError(error, '/user/list');
        }
    };

    public readonly mapper = (body: Request['body']): IPaginacao => {
        const {
            page,
            pageSize,
        } = body;

        return {
            pageSize: mapNumber(pageSize, 10),
            page: mapNumber(page, 1),
        };
    };
}

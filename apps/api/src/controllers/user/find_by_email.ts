import { Request } from 'express';
import _ from 'lodash';

import { IUser } from '#schemas/user/types';
import { logError } from '#utils/log_error';
import { IUserController } from './params';
import { Either, successData } from '#utils/either';
import { mapString } from '#utils/mapper/string';
import { getUserDao } from '#daos/singleton';
import { UserUtils } from '#schemas/user/utils';

type IByEmail = IUserController['IByEmail'];

interface Props {
    params: IByEmail;
}

export class FindByEmail {
    public readonly classId = Symbol.for('Controller > User > FindByEmail');
    private readonly utils: UserUtils;

    private constructor() {
        this.utils = new UserUtils();
    }

    static construir(classId: symbol): FindByEmail {
        if (classId !== Symbol.for('Controller > User')) {
            throw new Error(`${classId.toString()}: não pode ser instanciado`);
        }
        return new FindByEmail();
    }

    public readonly get = async (props: Props): Promise<Either<IUser['IParams']>> => {
        try {
            const { params } = props;
            const { email } = params;
            const query = { email };
            const user = await getUserDao().findOne(query);

            return successData(this.utils.toObject(user!));
        } catch (error: unknown) {
            return logError(error, '/user/by-email');
        }
    };

    public readonly mapper = (body: Request['body']): IByEmail => {
        const {
            email,
            firstName,
            lastName,
        } = body;

        return {
            email: mapString(email),
            firstName: mapString(firstName),
            lastName: mapString(lastName),
        };
    };
}

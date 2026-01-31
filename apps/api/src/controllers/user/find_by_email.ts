import { Request } from 'express';

import { IUser } from '#schemas/user/types';
import { logError } from '#utils/log_error';
import { UserCrud } from '#crud/user';
import { IUserController } from './params';
import { Either, successData } from '#utils/either';
import { mapString } from '#utils/mapper/string';

type IByEmail = IUserController['IByEmail'];

interface Props {
    params: IByEmail;
}

export class FindByEmail {
    public readonly classId = Symbol.for('Controller > User > FindByEmail');
    private readonly crud: UserCrud;

    private constructor() {
        this.crud = new UserCrud();
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
            const user = await this.crud.findOne(query);

            return successData(user);
        } catch (error: unknown) {
            return logError(error, '/user/by-email');
        }
    };

    public readonly mapper = (body: Request['body']): IByEmail => {
        const {
            email,
        } = body;

        return {
            email: mapString(email),
        };
    };
}

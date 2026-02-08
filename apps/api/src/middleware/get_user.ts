import { type Request, type Response, type NextFunction } from 'express';
import _ from 'lodash';

import { keycloakApi } from '#apis/keycloak';
import { getUserDao } from '#daos/singleton';
import { UserUtils } from '#schemas/user/utils';

export const getUserMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization || '';

        const authResponse = await keycloakApi.get('/protocol/openid-connect/userinfo', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
    
        const email = authResponse.data.email;
        const user = await getUserDao().findByEmail(email);
        if (_.isNil(user)) {
            throw new Error('Usuario não encontrado');
        }
    
        const utils = new UserUtils();
    
        req.user = utils.toObject(user);
    
        return next();
    } catch (error) {
        return next({ isError: true, message: 'Não autorizado', status: 401 })
    }
};

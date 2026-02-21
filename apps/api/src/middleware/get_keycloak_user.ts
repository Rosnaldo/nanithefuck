import { type Request, type Response, type NextFunction } from 'express';
import _ from 'lodash';

import { keycloakApi } from '#apis/keycloak';

export const GetKeycloakUser = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization || '';

        const authResponse = await keycloakApi.get('/protocol/openid-connect/userinfo', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
        req.userKc = {
            id: authResponse.data.sub,
            email: authResponse.data.email,
            firstName: authResponse.data.given_name,
            lastName: authResponse.data.family_name,
        };

        return next();
    } catch (error) {
        console.log('GetKeycloakUser: Não autorizado')
        return next({ isError: true, message: 'Não autorizado', status: 401 })
    }
};

import { type Request, type Response, type NextFunction } from 'express';
import _ from 'lodash';

import { keycloakApi } from '#apis/keycloak';
import properties from '#properties';
import { getKcMain } from '#keycloak/singleton';

export const GetKeycloakUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization || '';

        const kcMain = getKcMain();
        const client = await kcMain.getKcClientCredentials();

        const params = new URLSearchParams();
        params.append("token", token);
        const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

        const authResponse = await keycloakApi.post('/protocol/openid-connect/token/introspect',
            params,
            {
                headers,
                auth: {
                    username: properties.keycloakClientApiId,
                    password: properties.keycloakClientApiSecret,
                },
            });

        const user = await client.users.findOne({
            id: authResponse.data.sub,
            realm: 'poc'
        });

        req.userKc = {
            id: authResponse.data.sub,
            email: user?.email,
            firstName: user?.firstName,
            lastName: user?.lastName,
        };

        console.log('req.userKc', req.userKc)

        return next();
    } catch (error) {
        console.log('GetKeycloakUser: Não autorizado', error)
        return res.status(403).send({ isError: true, data: {}, message: 'Não autorizado', status: 401 });
    }
};

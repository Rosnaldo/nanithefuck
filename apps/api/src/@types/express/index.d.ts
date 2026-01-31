import { IUser } from '../../entitites/schemas/ususario';

declare global {
    namespace Express {
        interface Request {
            user: IUser['IDocument'];
        }
    }
}

export {};

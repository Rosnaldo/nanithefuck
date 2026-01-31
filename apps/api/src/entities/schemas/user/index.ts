import mongoose from 'mongoose';

import { IUser } from './types';
import { UserRole, UserRoleAll } from '@repo/shared-types';

const { Schema } = mongoose;

export const UserSchema = new Schema<IUser['ISchema']>(
    {
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        email: { type: String, require: false },
        role: {
            type: String,
            enum: UserRoleAll,
            default: UserRole.member,
        }
    },
    {
        strict: false,
        timestamps: {
            createdAt: 'dataCriacao',
            updatedAt: 'dataAtualizacao'
        }
    }
);

UserSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
    this.setOptions({ returnDocument: 'after', runValidators: true, context: 'query' });
    next();
});

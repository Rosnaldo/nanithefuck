import { Criacao } from './criacao';
import { Delete } from './delete';
import { Edit } from './edit';
import { FindByEmail } from './find_by_email';
import { Paginacao } from './paginacao';

export class UserController {
    public readonly classId = Symbol.for('Controller > User');

    public readonly paginacao: Paginacao;
    public readonly criacao: Criacao;
    public readonly byEmail: FindByEmail;
    public readonly delete: Delete;
    public readonly edit: Edit;

    constructor() {
        this.criacao = Criacao.construir( this.classId);
        this.paginacao = Paginacao.construir(this.classId);
        this.byEmail = FindByEmail.construir(this.classId);
        this.delete = Delete.construir(this.classId);
        this.edit = Edit.construir(this.classId);
    }
}

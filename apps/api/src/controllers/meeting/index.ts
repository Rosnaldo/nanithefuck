import { Criacao } from './criacao';
import { Delete } from './delete';
import { Edit } from './edit';
import { Paginacao } from './paginacao';

export class MeetingController {
    public readonly classId = Symbol.for('Controller > Meeting');

    public readonly paginacao: Paginacao;
    public readonly criacao: Criacao;
    public readonly delete: Delete;
    public readonly edit: Edit;

    constructor() {
        this.criacao = Criacao.construir( this.classId);
        this.paginacao = Paginacao.construir(this.classId);
        this.delete = Delete.construir(this.classId);
        this.edit = Edit.construir(this.classId);
    }
}

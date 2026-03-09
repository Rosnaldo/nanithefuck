import { ById } from './by-id';
import { Criacao } from './criacao';
import { Delete } from './delete';
import { Edit } from './edit';
import { Paginacao } from './paginacao';
import { UploadGallery } from './upload-gallery';

export class MeetingController {
    public readonly classId = Symbol.for('Controller > Meeting');

    public readonly paginacao: Paginacao;
    public readonly byId: ById;
    public readonly criacao: Criacao;
    public readonly delete: Delete;
    public readonly edit: Edit;
    public readonly uploadGallery: UploadGallery;

    constructor() {
        this.criacao = Criacao.construir( this.classId);
        this.paginacao = Paginacao.construir(this.classId);
        this.byId = ById.construir(this.classId);
        this.delete = Delete.construir(this.classId);
        this.edit = Edit.construir(this.classId);
        this.uploadGallery = UploadGallery.construir(this.classId);
    }
}

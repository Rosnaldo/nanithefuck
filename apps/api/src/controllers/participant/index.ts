import { Pagination } from './pagination';

export class ParticipantController {
    public readonly classId = Symbol.for('Controller > Participant');

    public readonly pagination: Pagination;

    constructor() {
        this.pagination = Pagination.construir( this.classId);
    }
}

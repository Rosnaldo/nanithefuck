import { getMeetingModel, getParticipantModel, getUserModel } from '#models/singleton';

export class LoadModels {
    private readonly loadModels = (): void => {
        try {
            getUserModel();
            getParticipantModel();
            getMeetingModel();
        } catch (error) {
            console.error(`[LoadModels.loadModels]: Error loading models`, error)
            throw error;
        }
    };

    public readonly synchronous = (): void => this.loadModels();
};

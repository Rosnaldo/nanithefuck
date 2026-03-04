import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

dotenv.config({
    path: `.env.${process.env.API_NODE_ENV}`,
    override: true
});

import { getMeetingDao, getUserDao } from "#daos/singleton";
import { mongooseBootstrap } from "#mongoose_bootstrap";
import { IUser } from "#schemas/user/types";
import { generateMeeting } from 'mock-meetings';

const members: Omit<IUser['IParams'], '_id' | 'createdAt' | 'updatedAt'>[] = [
    {
        firstName: "Lucas",
        lastName: "Silva",
        email: "lucas.silva@exemplo.com",
        avatar: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/avatars/young-brazilian-man-smiling.jpg",
        role: 'member',
    },
    {
        firstName: "Mariana",
        lastName: "Costa",
        email: "mariana.costa@exemplo.com",
        avatar: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/avatars/young-brazilian-woman-curly-hair.jpg",
        role: 'member',
    },
    {
        firstName: "Pedro",
        lastName: "Henrique",
        email: "pedro.henrique@exemplo.com",
        avatar: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/avatars/brazilian-man-beard-casual.jpg",
        role: 'member',
    },
    {
        firstName: "Juliana",
        lastName: "Alves",
        email: "juliana.alves@exemplo.com",
        avatar: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/avatars/brazilian-woman-sunglasses-summer.jpg",
        role: 'member',
    },
    {
        firstName: "Rafael",
        lastName: "Santos",
        email: "rafael.santos@exemplo.com",
        avatar: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/avatars/young-man-athletic-brazilian.jpg",
        role: 'member',
    },
    {
        firstName: "Camila",
        lastName: "Oliveira",
        email: "camila.oliveira@exemplo.com",
        avatar: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/avatars/brazilian-woman-long-hair-smiling.jpg",
        role: 'member',
    },
    {
        firstName: "Bruno",
        lastName: "Ferreira",
        email: "bruno.ferreira@exemplo.com",
        avatar: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/avatars/brazilian-man-casual-style.jpg",
        role: 'member',
    },
    {
        firstName: "Amanda",
        lastName: "Ribeiro",
        email: "amanda.ribeiro@exemplo.com",
        avatar: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/avatars/brazilian-woman-short-hair-modern.jpg",
        role: 'member',
    },
    {
        firstName: "Thiago",
        lastName: "Mendes",
        email: "thiago.mendes@exemplo.com",
        avatar: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/avatars/brazilian-man-glasses-friendly.jpg",
        role: 'member',
    },
    {
        firstName: "Fernanda",
        lastName: "Lima",
        email: "fernanda.lima@exemplo.com",
        avatar: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/avatars/brazilian-woman-blonde-beach-style.jpg",
        role: 'member',
    },
    {
        firstName: "Gabriel",
        lastName: "Souza",
        email: "gabriel.souza@exemplo.com",
        avatar: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/avatars/brazilian-man-tattoo-arm.jpg",
        role: 'member',
    },
    {
        firstName: "Beatriz",
        lastName: "Rocha",
        email: "beatriz.rocha@exemplo.com",
        avatar: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/avatars/brazilian-woman-fitness-style.jpg",
        role: 'member',
    },
    {
        firstName: "Diego",
        lastName: "Martins",
        email: "diego.martins@exemplo.com",
        avatar: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/avatars/brazilian-man-surfer-look.jpg",
        role: 'member',
    },
    {
        firstName: "Isabela",
        lastName: "Santos",
        email: "isabela.santos@exemplo.com",
        avatar: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/avatars/brazilian-woman-elegant-style.jpg",
        role: 'member',
    },
    {
        firstName: "Matheus",
        lastName: "Lima",
        email: "matheus.lima@exemplo.com",
        avatar: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/avatars/placeholder.svg?height=80&amp;width=80",
        role: 'member',
    },
];

export const populate = async () => {
    await getUserDao().inserir({
        firstName: "Andrey",
        lastName: "Tsuzuki",
        email: "andreytsuzuki@gmail.com",
        avatar: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/avatars/young-brazilian-man-smiling.jpg",
        role: 'admin',
    });

    await getUserDao().inserirBatch(members);
    const newMembers = await getUserDao().find({});

    const ids = newMembers.map((m) => m.id)

    const meeting = generateMeeting(ids)
    await getMeetingDao().inserir(meeting)
}

;(async () => {
    await mongooseBootstrap();
    await populate();
    process.exit(0);
})();

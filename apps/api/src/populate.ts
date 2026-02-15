import { getMeetingDao, getUserDao } from "#daos/singleton";
import { getParticipantModel } from "#models/singleton";
import { mongooseBootstrap } from "#mongoose_bootstrap";
import { IUser } from "#schemas/user/types";

const members: Omit<IUser['IParams'], '_id'>[] = [
  {
    firstName: "Lucas",
    lastName: "Silva",
    email: "lucas.silva@exemplo.com",
    avatar: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/avatars/young-brazilian-man-smiling.jpg",
    role: 'member',
  },
  {
    firstName: "Mariana",
    lastName: "Costa",
    email: "mariana.costa@exemplo.com",
    avatar: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/avatars/young-brazilian-woman-curly-hair.jpg",
    role: 'member',
  },
  {
    firstName: "Pedro",
    lastName: "Henrique",
    email: "pedro.henrique@exemplo.com",
    avatar: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/avatars/brazilian-man-beard-casual.jpg",
    role: 'member',
  },
  {
    firstName: "Juliana",
    lastName: "Alves",
    email: "juliana.alves@exemplo.com",
    avatar: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/avatars/brazilian-woman-sunglasses-summer.jpg",
    role: 'member',
  },
  {
    firstName: "Rafael",
    lastName: "Santos",
    email: "rafael.santos@exemplo.com",
    avatar: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/avatars/young-man-athletic-brazilian.jpg",
    role: 'member',
  },
  {
    firstName: "Camila",
    lastName: "Oliveira",
    email: "camila.oliveira@exemplo.com",
    avatar: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/avatars/brazilian-woman-long-hair-smiling.jpg",
    role: 'member',
  },
  {
    firstName: "Bruno",
    lastName: "Ferreira",
    email: "bruno.ferreira@exemplo.com",
    avatar: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/avatars/brazilian-man-casual-style.jpg",
    role: 'member',
  },
  {
    firstName: "Amanda",
    lastName: "Ribeiro",
    email: "amanda.ribeiro@exemplo.com",
    avatar: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/avatars/brazilian-woman-short-hair-modern.jpg",
    role: 'member',
  },
  {
    firstName: "Thiago",
    lastName: "Mendes",
    email: "thiago.mendes@exemplo.com",
    avatar: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/avatars/brazilian-man-glasses-friendly.jpg",
    role: 'member',
  },
  {
    firstName: "Fernanda",
    lastName: "Lima",
    email: "fernanda.lima@exemplo.com",
    avatar: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/avatars/brazilian-woman-blonde-beach-style.jpg",
    role: 'member',
  },
  {
    firstName: "Gabriel",
    lastName: "Souza",
    email: "gabriel.souza@exemplo.com",
    avatar: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/avatars/brazilian-man-tattoo-arm.jpg",
    role: 'member',
  },
  {
    firstName: "Beatriz",
    lastName: "Rocha",
    email: "beatriz.rocha@exemplo.com",
    avatar: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/avatars/brazilian-woman-fitness-style.jpg",
    role: 'member',
  },
  {
    firstName: "Diego",
    lastName: "Martins",
    email: "diego.martins@exemplo.com",
    avatar: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/avatars/brazilian-man-surfer-look.jpg",
    role: 'member',
  },
  {
    firstName: "Isabela",
    lastName: "Santos",
    email: "isabela.santos@exemplo.com",
    avatar: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/avatars/brazilian-woman-elegant-style.jpg",
    role: 'member',
  },
  {
    firstName: "Matheus",
    lastName: "Lima",
    email: "matheus.lima@exemplo.com",
    avatar: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/avatars/placeholder.svg?height=80&amp;width=80",
    role: 'member',
  },
];

const media = [
    { type: "image", url: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/meetings/ChacaraMeets/gallery/anime-style-bbq-party-friends-japanese-illustratio.jpg", h: 2, w: 2 },
    { type: "image", url: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/meetings/ChacaraMeets/gallery/pool-party-clip-1.jpg", h: 1, w: 1 },
    { type: "image", url: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/meetings/ChacaraMeets/gallery/anime-style-bbq-grill-meat-japanese-illustration.jpg", h: 1, w: 1 },
    { type: "image", url: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/meetings/ChacaraMeets/gallery/bbq-party-clip.jpg", h: 1, w: 1 },
    { type: "image", url: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/meetings/ChacaraMeets/gallery/anime-style-friends-talking-sunset-japanese.jpg", h: 1, w: 1 },
    { type: "image", url: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/meetings/ChacaraMeets/gallery/anime-style-cocktails-drinks-bar-japanese.jpg", h: 1, w: 1 },
    { type: "image", url: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/meetings/ChacaraMeets/gallery/dj-party-clip.jpg", h: 1, w: 1 },
    { type: "image", url: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/meetings/ChacaraMeets/gallery/anime-style-night-party-lights-japanese.jpg", h: 2, w: 1 },
]


function randomStatus(): "confirmed" | "pending" {
  return Math.random() < 0.5 ? "confirmed" : "pending"
}

export const populate = async () => {

    const meeting = await getMeetingDao().inserir({
        name: 'ChacaraMeets',
        days: [
            {
                day: new Date(2026, 1, 1),
                start: new Date(2026, 1, 1, 7, 0),
                finish: new Date(2026, 1, 1, 23, 59),
            },
            {
                day: new Date(2026, 2, 1),
                start: new Date(2026, 2, 1, 7, 0),
                finish: new Date(2026, 2, 1, 23, 59),
            },
        ]
    })
    await getMeetingDao().findOneAndUpdate(meeting!._id.toString(), { gallery: media })
    await getUserDao().inserir({
        firstName: "Andrey",
        lastName: "Tsuzuki",
        email: "andreytsuzuki@gmail.com",
        avatar: "https://nanithefuck-32.s3.sa-east-1.amazonaws.com/avatars/young-brazilian-man-smiling.jpg",
        role: 'admin',
    });

    await getUserDao().inserirBatch(members);
    const newMembers = await getUserDao().find({});

    const ids = newMembers.map((m) => m.id)
    const participants = ids.map(id => ({
        meetingId: meeting.id,
        userId: id,
        status: randomStatus()
    }))

    await getParticipantModel().insertMany(participants);
}

;(async () => {
    await mongooseBootstrap();
    await populate();
})();
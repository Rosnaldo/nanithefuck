import { MeetingBuilder } from "#schemas/meeting/utils";
import { IMeeting, IParticipant, IPicture, ParticipantStatus } from "@repo/shared-types"

const gallery: IPicture[] = [
  {
    type: "image",
    url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/chacara-meets/gallery/anime-style-bbq-party-friends-japanese-illustratio.jpg",
    host: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com",
    path: "meetings/chacara-meets/gallery/anime-style-bbq-party-friends-japanese-illustratio.jpg",
    w: 2,
    h: 2,
  },
  {
    type: "image",
    url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/chacara-meets/gallery/pool-party-clip-1.jpg",
    host: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com",
    path: "meetings/chacara-meets/gallery/pool-party-clip-1.jpg",
    w: 1,
    h: 1,
  },
  {
    type: "image",
    url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/chacara-meets/gallery/anime-style-bbq-grill-meat-japanese-illustration.jpg",
    host: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com",
    path: "meetings/chacara-meets/gallery/anime-style-bbq-grill-meat-japanese-illustration.jpg",
    w: 1,
    h: 1,
  },
  {
    type: "image",
    url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/chacara-meets/gallery/bbq-party-clip.jpg",
    host: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com",
    path: "meetings/chacara-meets/gallery/bbq-party-clip.jpg",
    w: 1,
    h: 1,
  },
  {
    type: "image",
    url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/chacara-meets/gallery/anime-style-friends-talking-sunset-japanese.jpg",
    host: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com",
    path: "meetings/chacara-meets/gallery/anime-style-friends-talking-sunset-japanese.jpg",
    w: 1,
    h: 1,
  },
  {
    type: "image",
    url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/chacara-meets/gallery/anime-style-cocktails-drinks-bar-japanese.jpg",
    host: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com",
    path: "meetings/chacara-meets/gallery/anime-style-cocktails-drinks-bar-japanese.jpg",
    w: 1,
    h: 1,
  },
  {
    type: "image",
    url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/chacara-meets/gallery/dj-party-clip.jpg",
    host: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com",
    path: "meetings/chacara-meets/gallery/dj-party-clip.jpg",
    w: 1,
    h: 1,
  },
  {
    type: "image",
    url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/chacara-meets/gallery/anime-style-night-party-lights-japanese.jpg",
    host: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com",
    path: "meetings/chacara-meets/gallery/anime-style-night-party-lights-japanese.jpg",
    w: 2,
    h: 1,
  },
];

export function generateMeeting(userIds: string[]): Partial<IMeeting> {
    const name = 'Chacara Meets';
    const builder = new MeetingBuilder({ name });
    const statuses: Array<keyof typeof ParticipantStatus> = ["pending", "confirmed"]

    const participantCount = 5
    const participants: IParticipant[] = []
    for (let j = 0; j < participantCount; j++) {
        participants.push({
            userId: userIds[j],
            status: statuses[(j) % 2],
        })
    }

    return builder
        .setParticipants(participants)
        .setDays([
            {
                start: "7:00",
                isodate: new Date("2026-03-06"),
                allDayLong: false,
            },
            {
                isodate: new Date("2026-03-07"),
                allDayLong: true,
            },
            {
                finish: "17:00",
                isodate: new Date("2026-03-08"),
                allDayLong: false,
            },
        ])
        .setGallery(gallery)
        .build()
}


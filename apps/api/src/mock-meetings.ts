import { MeetingBuilder } from "#schemas/meeting/utils";
import { IMeeting, IParticipant, IPicture, ParticipantStatus } from "@repo/shared-types"

const gallery: IPicture[] = [
  {
    type: "image",
    url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/local/chacara-meets/gallery/anime-style-pool-party-friends-summer-japanese.jpg",
    s3Host: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com",
    s3Path: "meetings/local/chacara-meets/gallery/anime-style-pool-party-friends-summer-japanese.jpg",
    w: 2,
    h: 2,
  },
  {
    type: "image",
    url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/local/chacara-meets/gallery/pool-party-clip-1.jpg",
    s3Host: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com",
    s3Path: "meetings/local/chacara-meets/gallery/pool-party-clip-1.jpg",
    w: 1,
    h: 1,
  },
  {
    type: "image",
    url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/local/chacara-meets/gallery/anime-style-bbq-grill-meat-japanese-illustration.jpg",
    s3Host: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com",
    s3Path: "meetings/local/chacara-meets/gallery/anime-style-bbq-grill-meat-japanese-illustration.jpg",
    w: 1,
    h: 1,
  },
  {
    type: "image",
    url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/local/chacara-meets/gallery/bbq-party-clip.jpg",
    s3Host: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com",
    s3Path: "meetings/local/chacara-meets/gallery/bbq-party-clip.jpg",
    w: 1,
    h: 1,
  },
  {
    type: "image",
    url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/local/chacara-meets/gallery/anime-style-friends-talking-sunset-japanese.jpg",
    s3Host: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com",
    s3Path: "meetings/local/chacara-meets/gallery/anime-style-friends-talking-sunset-japanese.jpg",
    w: 1,
    h: 1,
  },
  {
    type: "image",
    url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/local/chacara-meets/gallery/anime-style-cocktails-drinks-bar-japanese.jpg",
    s3Host: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com",
    s3Path: "meetings/local/chacara-meets/gallery/anime-style-cocktails-drinks-bar-japanese.jpg",
    w: 1,
    h: 1,
  },
  {
    type: "image",
    url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/local/chacara-meets/gallery/dj-party-clip.jpg",
    s3Host: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com",
    s3Path: "meetings/local/chacara-meets/gallery/dj-party-clip.jpg",
    w: 1,
    h: 1,
  },
  {
    type: "image",
    url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/local/chacara-meets/gallery/anime-style-night-party-lights-japanese.jpg",
    s3Host: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com",
    s3Path: "meetings/local/chacara-meets/gallery/anime-style-night-party-lights-japanese.jpg",
    w: 2,
    h: 1,
  },
];

export async function generateMeeting(userIds: string[]): Promise<IMeeting> {
    const name = 'Chacara Meets';
    const builder = new MeetingBuilder();
    const statuses: Array<keyof typeof ParticipantStatus> = ["pending", "confirmed"]

    const participantCount = 5
    const participants: IParticipant[] = []
    for (let j = 0; j < participantCount; j++) {
        participants.push({
            userId: userIds[j],
            status: statuses[(j) % 2],
        })
    }

    return await builder
        .setInit({ name, isActive: false })
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
        .save()
}


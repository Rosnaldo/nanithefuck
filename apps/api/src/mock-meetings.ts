import { IDay, IMeeting, IParticipant, IPicture, IUser, ParticipantStatus, Weekday } from "@repo/shared-types"

const sampleGalleryItems: IPicture[] = [
    { type: "image", url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/ChacaraMeets/gallery/anime-style-bbq-party-friends-japanese-illustratio.jpg", h: 2, w: 2 },
    { type: "image", url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/ChacaraMeets/gallery/pool-party-clip-1.jpg", h: 1, w: 1 },
    { type: "image", url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/ChacaraMeets/gallery/anime-style-bbq-grill-meat-japanese-illustration.jpg", h: 1, w: 1 },
    { type: "image", url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/ChacaraMeets/gallery/bbq-party-clip.jpg", h: 1, w: 1 },
    { type: "image", url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/ChacaraMeets/gallery/anime-style-friends-talking-sunset-japanese.jpg", h: 1, w: 1 },
    { type: "image", url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/ChacaraMeets/gallery/anime-style-cocktails-drinks-bar-japanese.jpg", h: 1, w: 1 },
    { type: "image", url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/ChacaraMeets/gallery/dj-party-clip.jpg", h: 1, w: 1 },
    { type: "image", url: "https://nanithefuck-34.s3.sa-east-1.amazonaws.com/meetings/ChacaraMeets/gallery/anime-style-night-party-lights-japanese.jpg", h: 2, w: 1 },
]

export function generateMeeting(userIds: string[]): Partial<IMeeting> {
    const statuses: Array<keyof typeof ParticipantStatus> = ["pending", "confirmed"]

    const participantCount = 5
    const participants: IParticipant[] = []
    for (let j = 0; j < participantCount; j++) {
        participants.push({
            userId: userIds[j],
            status: statuses[(j) % 2],
        })
    }

    const gallery: IPicture[] = sampleGalleryItems

    const days: IDay[] = []
    days.push({
        day: 1,
        start: "7:00",
        weekday: Weekday.friday,
        date: new Date("2026-03-06"),
        allDayLong: false,
    });
    days.push({
        day: 1,
        weekday: Weekday.friday,
        date: new Date("2026-03-07"),
        allDayLong: true,
    });
    days.push({
        day: 1,
        finish: "17:00",
        weekday: Weekday.friday,
        date: new Date("2026-03-08"),
        allDayLong: false,
    });

    const name = 'Chacara Meets'
    const slug = name.toLowerCase().replace(/\s+/g, "-")

    return {
        name,
        slug,
        gallery,
        participants,
        days,
    }
}


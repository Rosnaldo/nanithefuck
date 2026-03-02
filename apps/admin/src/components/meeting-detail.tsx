import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MeetingGallery } from "@/components/meeting-gallery"
import { MeetingParticipants } from "@/components/meeting-participants"
import { type IMeeting, type ParticipantStatus } from "@repo/shared-types"
import { apiBack } from "@/api/backend"
import { ApiError } from "@/error/api"

interface MeetingDetailProps {
  meetingId: string
}

export function MeetingDetail({ meetingId }: MeetingDetailProps) {
     const fetchUsersList = async () => {
        const res = await apiBack.get(
            "/users/list"
        )
        
        if (res.data.isError) {
            throw new ApiError(res.data.message);
        }
        return res.data.data;
    };

    const { data: users = [], isLoading } = useQuery<IUser[]>({
        queryKey: ['users/list'],
        queryFn: () => fetchUsersList()
    });
    const router = useRouter()

    const meeting = meetings.find((m) => m.id === meetingId)

    if (!meeting) {
        return (
        <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg font-medium text-foreground">Meeting not found</p>
            <p className="mt-1 text-sm text-muted-foreground">
            This meeting may have been deleted.
            </p>
            <Button variant="outline" className="mt-4" asChild>
            <Link href="/meetings">Back to Meetings</Link>
            </Button>
        </div>
        )
    }

    function updateMeeting(
        updater: (meeting: IMeeting) => typeof meeting
    ) {
        setMeetings((prev: IMeeting[]) =>
            prev.map((m) => (m._id === meetingId ? updater(m)! : m))
        )
    }

    function handleAddPhoto(url: string) {
        updateMeeting((m) => ({
            ...m!,
            gallery: [...m!.gallery, url],
        }))
    }

    function handleRemovePhoto(index: number) {
        updateMeeting((m) => ({
            ...m!,
            gallery: m!.gallery.filter((_, i) => i !== index),
        }))
    }

    function handleAddParticipant(userId: string) {
        updateMeeting((m) => ({
            ...m!,
            participants: [
                ...m!.participants,
                { userId, meetingId: m!.id, status: "pending" },
            ],
        }))
    }

    function handleRemoveParticipant(userId: string) {
        updateMeeting((m) => ({
            ...m!,
            participants: m!.participants.filter((p) => p.userId !== userId),
        }))
    }

    function handleChangeStatus(userId: string, status: keyof typeof ParticipantStatus) {
        updateMeeting((m) => ({
            ...m!,
            participants: m!.participants.map((p) =>
                p.userId === userId ? { ...p, status } : p
            ),
        }))
    }

    return (
        <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
            <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => router.push("/meetings")}
            aria-label="Back to meetings"
            >
            <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {meeting.name}
            </h1>
            <p className="text-sm text-muted-foreground">
                {meeting.participants.length} participants &middot;{" "}
                {meeting.gallery.length} photos
            </p>
            </div>
        </div>

        {/* Gallery Section */}
        <div className="rounded-lg border bg-card p-5">
            <MeetingGallery
            gallery={meeting.gallery}
            onAddPhoto={handleAddPhoto}
            onRemovePhoto={handleRemovePhoto}
            />
        </div>

        <Separator />

        {/* Participants Section */}
        <div className="rounded-lg border bg-card p-5">
            <MeetingParticipants
            meetingId={meetingId}
            participants={meeting.participants}
            users={users}
            onAddParticipant={handleAddParticipant}
            onRemoveParticipant={handleRemoveParticipant}
            onChangeStatus={handleChangeStatus}
            />
        </div>
        </div>
    )
}

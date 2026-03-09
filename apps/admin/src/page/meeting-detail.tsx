import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MeetingGallery } from "@/components/meeting-gallery"
import { MeetingParticipants } from "@/components/meeting-participants"
import type { IMeeting, IParticipant, IUser, Pagination, ParticipantStatus } from "@repo/shared-types"
import { apiBack } from "@/api/backend"
import { ApiError } from "@/error/api"
import { useQueries, type UseQueryOptions } from "@tanstack/react-query"
import { useReset } from "@/hooks/use-reset"
import { toast } from "sonner"
import { checkErrorByField } from "@/utils/check_error_by_field"

const fetchUsersList = async () => {
    const res = await apiBack.get(
        "/users/list", {
            params: {
                isPagination: false
            }
        }
        
    )
    if (res.data.isError) {
        throw new ApiError(res.data.message);
    }
    return res.data;
};

const fetchMeetingById = (meetingId?: string) => async () => {
    const res = await apiBack.get(
        "/meetings/by-id", {
            params: { _id: meetingId }
        }
    )
    if (res.data.isError) {
        throw new ApiError(res.data.message);
    }
    return res.data;
 };

export default function MeetingDetail() {
    const { meetingId } = useParams<{ meetingId: string }>()
    const resetMeeting = useReset<IMeeting>('meetings/by-id', (oldData: IMeeting | undefined) =>
        {
            if (!oldData) return {} as IMeeting;
            return {
                ...oldData
            };
        }
    );
    const results = useQueries<[
        UseQueryOptions<IMeeting>,
        UseQueryOptions<{ data: IUser[], pagination: Pagination }>,
    ]>({
        queries: [
            { queryKey: ['meetings/by-id'], queryFn: fetchMeetingById(meetingId) },
            { queryKey: ['users/list'], queryFn: fetchUsersList },
        ],
    });

    const navigate = useNavigate()

    const isLoading = results.some(q => q.isLoading)
    const isError = results.some(q => q.isError)
    const firstError = results.find(q => q.isError)?.error
    const meeting = results[0].data;
    const data = results[1].data;
    const users = data?.data ?? [];

    if (!meeting) {
        return (
        <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg font-medium text-foreground">
            Meeting nao encontrado
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
            Este meeting pode ter sido removido.
            </p>
            <Button variant="outline" className="mt-4" asChild>
            <a href="/meetings">Voltar para Meetings</a>
            </Button>
        </div>
        )
    }

    async function updateMeeting(data: IMeeting) {
        try {
            await apiBack.put(
                "/meetings/edit", data, {
                    params: { _id: data._id }
                }
            )

            toast.success("Meeting editado com sucesso!");
        } catch (error: unknown) {
            if (checkErrorByField(error, 'message')) {
                toast.error(error.message);
                return;
            }
            throw error;
        }

        resetMeeting();
    }

    function handleRemoveItem(index: number) {
        const data = {
            ...meeting,
            gallery: (meeting?.gallery || []).filter((_, i) => i !== index),
        } as IMeeting
        updateMeeting(data)
    }

    function handleAddParticipants(userIds: string[]) {
        const data = {
            ...meeting,
            participants: [
                ...meeting!.participants || [],
                ...userIds.map((userId) => ({
                    userId,
                    status: "pending" as keyof typeof ParticipantStatus ,
                })) as IParticipant[]
            ]
        } as IMeeting
        updateMeeting(data)
    }

    function handleRemoveParticipant(userId: string) {
        const data = {
            ...meeting,
            participants: [
                ...(meeting!.participants || []).filter((p) => p.userId !== userId),
            ],
        } as IMeeting
        updateMeeting(data)
    }

    function handleChangeStatus(userId: string, status: keyof typeof  ParticipantStatus) {
        const data = {
            ...meeting,
            participants: (meeting!.participants || []).map((p) =>
                p.userId === userId ? { ...p, status } : p
            ),
        } as IMeeting
        updateMeeting(data)
    }

    const photoCount = (meeting.gallery || []).filter((i) => i.type === "image").length
    const videoCount = (meeting.gallery || []).filter((i) => i.type === "video").length

    function Loading() {
        return <div>Loading...</div>;
    }

    function ErrorState({ error }: { error: Error }) {
        return <div style={{ color: "red" }}>{error.message}</div>;
    }

    if (isLoading) return <Loading />;
    if (isError) return <ErrorState error={firstError as Error} />;

    return (
        <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
            <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => navigate("/meetings")}
            aria-label="Voltar para meetings"
            >
            <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {meeting.name}
            </h1>
            <p className="text-sm text-muted-foreground">
                {(meeting.participants || []).length} participantes &middot; {photoCount}{" "}
                {photoCount === 1 ? "foto" : "fotos"}
                {videoCount > 0 &&
                ` e ${videoCount} ${videoCount === 1 ? "video" : "videos"}`}
            </p>
            </div>
        </div>

        {/* Gallery Section */}
        <div className="rounded-lg border bg-card p-5">
            <MeetingGallery
                onRemoveItem={handleRemoveItem}
            />
        </div>

        <Separator />

        {/* Participants Section */}
        <div className="rounded-lg border bg-card p-5">
            <MeetingParticipants
                resetMeeting={resetMeeting}
                participants={meeting.participants || []}
                users={users}
                onAddParticipants={handleAddParticipants}
                onRemoveParticipant={handleRemoveParticipant}
                onChangeStatus={handleChangeStatus}
            />
        </div>
        </div>
    )
}

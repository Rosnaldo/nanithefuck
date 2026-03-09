import { apiBack } from "@/api/backend";
import { ApiError } from "@/error/api";
import type { IMeeting } from "@repo/shared-types";
import { useQuery, useQueryClient } from "@tanstack/react-query"

const fetchMeetingById = async (meetingId?: string) => {
    const res = await apiBack.get(
        "/meetings/by-id", {
            params: { _id: meetingId },
        },
    )
    if (res.data.isError) {
        throw new ApiError(res.data.message);
    }
    return res.data;
};

export const useMeetingGallery = (id: string) =>
    useQuery({
        queryKey: ['meeting-gallery', id],
        queryFn: () => fetchMeetingById(id),
        select: (m: IMeeting) => m.gallery ?? [],
    });

export const useMeetingDays = (id: string) =>
    useQuery({
        queryKey: ['meeting-days', id],
        queryFn: () => fetchMeetingById(id),
        select: (m: IMeeting) => m.days ?? [],
    });

export const useMeetingParticipants = (id: string) =>
    useQuery({
        queryKey: ['meeting-participants', id],
        queryFn: () => fetchMeetingById(id),
        select: (m: IMeeting) => m.participants ?? [],
    });


export const useRefetchMeetingGallery  = (id: string) => {
    const queryClient = useQueryClient();
    return () =>
        queryClient.refetchQueries({
            queryKey: ['meeting-gallery', id],
            exact: true,
        });
};

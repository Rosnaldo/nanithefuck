import { createContext, useContext, useRef } from 'react'
import { createStore } from 'zustand/vanilla'
import type { StoreApi } from 'zustand'
import type { IDay, IMeeting, IParticipant, IPicture } from '@repo/shared-types'

type MeetingState = {
    meeting: Partial<IMeeting>
    storeMeeting: (meeting: IMeeting) => void
}

export const createMeetingStore = () =>
    createStore<MeetingState>((set) => ({
        meeting: {
            name: '',
            slug: '',
            days: [] as IDay[],
            gallery: [] as IPicture[],
            participants: [] as IParticipant[],
        },
        storeMeeting: (meeting: IMeeting) => set({  meeting}),
    }))

const MeetingContext = createContext<StoreApi<MeetingState> | null>(null)

export const MeetingProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const storeRef = useRef<StoreApi<MeetingState> | null>(null)

    if (!storeRef.current) {
        storeRef.current = createMeetingStore()
    }

    return (
        <MeetingContext.Provider value={storeRef.current}>
            {children}
        </MeetingContext.Provider>
    )
}

export const useMeeting = () => useContext(MeetingContext);
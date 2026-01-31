import { create } from 'zustand'

type PageState = {
    page: string
    setPage: (page: string) => void
}

export const usePageStore = create<PageState>((set) => ({
    page: 'users',

    setPage: (page) =>
        set(() => ({
            page,
        })),
}))

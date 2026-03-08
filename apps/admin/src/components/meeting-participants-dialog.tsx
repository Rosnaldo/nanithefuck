import React, { useState, useMemo } from "react"
import {
  Search,
  UserPlus,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import { Checkbox } from "@/components/ui/checkbox"
import type { IParticipant, IUser, Pagination } from "@repo/shared-types"
import { useStateReset } from "@/hooks/use-state-reset"
import _ from "lodash"
import { useQueries, type UseQueryOptions } from "@tanstack/react-query"
import { ApiError } from "@/error/api"
import { apiBack } from "@/api/backend"
import { useDebounce } from "@/hooks/use-debounce"

interface MeetingParticipantsProps {
    resetMeeting: () => void
    participants: IParticipant[]
    onAddParticipants: (userIds: string[]) => void
    addOpen: boolean
    setAddOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const fetchUsersList = ({ currentPage, search }: { currentPage: number, search: string }) => async () => {
    const res = await apiBack.get(
        "/users/list", {
            params: {
                page: currentPage,
                search,
            }
        }
    )
    if (res.data.isError) {
        throw new ApiError(res.data.message);
    }

    return res.data;
};

interface SortedAvailableUsersProps {
    availableUsers: IUser[]
    addSearch: string
    selectedToAdd: Set<string>
    setSelectedToAdd: React.Dispatch<React.SetStateAction<Set<string>>>
    resetMeeting: () => void
}

function SortedAvailableUsers({ availableUsers, addSearch, selectedToAdd, setSelectedToAdd, resetMeeting }: SortedAvailableUsersProps) {
    const sorted = useMemo(() => {
        return availableUsers.sort((a, b) => {
            const aSelected = selectedToAdd.has(a._id)
            const bSelected = selectedToAdd.has(b._id)
            if (aSelected && !bSelected) return -1
            if (!aSelected && bSelected) return 1
            return 0
        })
        }, [availableUsers, selectedToAdd]);

    const [sortedAvailableUsers] = useStateReset<IUser[]>(
        sorted,
        (oldData: IUser[] | undefined) =>
            {
                const hasChanges = oldData?.length !== sorted.length;
                if (hasChanges) {
                    // cria novo array apenas se algum item mudou
                    return [...sorted];
                }

                return oldData;
            },
        [sorted]
    );

    function AvailableUserList(users: IUser[]) {
        return (
            <div className="flex flex-col">
                {users.map((user) => {
                        const isSelected = selectedToAdd.has(user._id)
                        return AvailableUser(user, isSelected)
                    })}
            </div>
        )
    }

    function AvailableUser(user: IUser, isSelected: boolean) {
        return (
            <label
                key={user._id}
                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors border-b last:border-b-0 ${
                isSelected ? "bg-primary/5" : "hover:bg-accent"
                }`}
            >
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                        setSelectedToAdd((prev) => {
                            const next = new Set(prev)
                            if (checked) {
                                next.add(user._id)
                            } else {
                                next.delete(user._id)
                            }
                            return next
                        })
                        resetMeeting()
                    }}
                className="shrink-0"
                />
                <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                    {user.firstName.charAt(0)}
                    {user?.lastName?.charAt(0)}
                </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                    {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                </p>
                </div>
            </label>
        )
    }

    return (
        <>
            {sortedAvailableUsers.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
                {addSearch
                ? "Nenhum usuario encontrado."
                : "Todos os usuarios ja foram adicionados a este meeting."}
            </p>
            ) : (
                AvailableUserList(sortedAvailableUsers)
            )}
        </>
    )
}

export function MeetingParticipantsDialog({
    resetMeeting,
    participants,
    addOpen,
    setAddOpen,
    onAddParticipants,
}: MeetingParticipantsProps) {
    const [addSearch, setAddSearch] = useState("")
    const [selectedToAdd, setSelectedToAdd] = useState<Set<string>>(new Set())

    const participantUserIds = new Set(participants.map((p) => p.userId))
    const debouncedSearch = useDebounce(addSearch, 500);
    const results = useQueries<[
        UseQueryOptions<{ data: IUser[], pagination: Pagination }>,
    ]>({
        queries: [
            {
                queryKey: ['users/list', debouncedSearch],
                queryFn: fetchUsersList({ currentPage: 1, search: debouncedSearch }),
                refetchOnWindowFocus: false,
                placeholderData: { data: [], pagination: {} as Pagination },
            },
        ],
    });

    const isLoading = results.some(q => q.isLoading)
    const isError = results.some(q => q.isError)
    const firstError = results.find(q => q.isError)?.error

    const data = results[0].data;
    const users = data?.data ?? [];
    // const pagination = data?.pagination;

    const availableUsers = useMemo(() => {
        return users.filter(
        (u) =>
            !participantUserIds.has(u._id)
        )
    }, [users, participantUserIds])

    function Loading() {
        return <div>Loading...</div>;
    }

    function ErrorState({ error }: { error: Error }) {
        return <div style={{ color: "red" }}>{error.message}</div>;
    }

    if (isLoading) return <Loading />;
    if (isError) return <ErrorState error={firstError as Error} />;

    return (
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>Adicionar Participantes</DialogTitle>
                <DialogDescription>
                Selecione os usuarios que deseja convidar para este meeting.
                </DialogDescription>
            </DialogHeader>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                placeholder="Buscar usuarios..."
                value={addSearch}
                onChange={(e) => setAddSearch(e.target.value)}
                className="pl-9"
                />
            </div>
            <div className="h-[300px] overflow-y-auto rounded-lg border">
                <SortedAvailableUsers
                    addSearch={addSearch}
                    selectedToAdd={selectedToAdd}
                    setSelectedToAdd={setSelectedToAdd}
                    resetMeeting={resetMeeting}
                    availableUsers={availableUsers}
                />
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                {selectedToAdd.size} selecionado{selectedToAdd.size !== 1 ? "s" : ""}
                </p>
                <Button
                onClick={() => {
                    if (selectedToAdd.size > 0) {
                        onAddParticipants(Array.from(selectedToAdd))
                        setSelectedToAdd(new Set())
                        setAddOpen(false)
                    }
                }}
                disabled={selectedToAdd.size === 0}
                className="gap-1.5"
                >
                <UserPlus className="h-3.5 w-3.5" />
                Convidar
                </Button>
            </div>
            </DialogContent>
        </Dialog>
    )
}

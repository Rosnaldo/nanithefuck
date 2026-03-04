import { useState, useMemo } from "react"
import {
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  UserPlus,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { type IParticipant, type ParticipantStatus, type IUser } from "@repo/shared-types"

interface MeetingParticipantsProps {
    meetingId: string
    participants: IParticipant[]
    users: IUser[]
    onAddParticipant: (userId: string) => void
    onRemoveParticipant: (userId: string) => void
    onChangeStatus: (userId: string, status: keyof typeof ParticipantStatus) => void
}

export function MeetingParticipants({
  participants,
  users,
  onAddParticipant,
  onRemoveParticipant,
  onChangeStatus,
}: MeetingParticipantsProps) {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | keyof typeof ParticipantStatus>("all")
    const [addOpen, setAddOpen] = useState(false)
    const [addSearch, setAddSearch] = useState("")
    const [removingUserId, setRemovingUserId] = useState<string | null>(null)

    // Map users by id for quick lookup
    const usersMap = useMemo(() => {
        const map = new Map<string, IUser>()
        users.forEach((u) => map.set(u._id, u))
        return map
    }, [users])

    // Filter participants
    const filteredParticipants = useMemo(() => {
        return participants.filter((p) => {
        const user = usersMap.get(p.userId)
        if (!user) return false
        const matchesSearch =
            search === "" ||
            `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase()) ||
            user?.email?.toLowerCase().includes(search.toLowerCase())
        const matchesStatus =
            statusFilter === "all" || p.status === statusFilter
        return matchesSearch && matchesStatus
        })
    }, [participants, search, statusFilter, usersMap])

    // Available users (not already participants)
    const participantUserIds = new Set(participants.map((p) => p.userId))
    const availableUsers = useMemo(() => {
        return users.filter(
        (u) =>
            !participantUserIds.has(u._id) &&
            (addSearch === "" ||
            `${u.firstName} ${u.lastName}`
                .toLowerCase()
                .includes(addSearch.toLowerCase()) ||
            u?.email?.toLowerCase().includes(addSearch.toLowerCase()))
        )
    }, [users, participantUserIds, addSearch])

    const confirmedCount = participants.filter(
        (p) => p.status === "confirmed"
    ).length
    const pendingCount = participants.filter(
        (p) => p.status === "pending"
    ).length

    function handleRemove() {
        if (removingUserId) {
        onRemoveParticipant(removingUserId)
        setRemovingUserId(null)
        }
    }

    const removingUser = removingUserId
        ? usersMap.get(removingUserId)
        : null

    return (
        <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <div>
            <h2 className="text-lg font-semibold text-card-foreground">
                Participants
            </h2>
            <p className="text-sm text-muted-foreground">
                {participants.length} total &middot; {confirmedCount} confirmed
                &middot; {pendingCount} pending
            </p>
            </div>
            <Button
            size="sm"
            className="gap-1.5"
            onClick={() => {
                setAddSearch("")
                setAddOpen(true)
            }}
            >
            <UserPlus className="h-3.5 w-3.5" />
            Add Participant
            </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Search participants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
            />
            </div>
            <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as "all" | keyof typeof ParticipantStatus)}
            >
            <SelectTrigger className="w-[150px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
            </Select>
        </div>

        {/* Participants Table */}
        <div className="rounded-lg border bg-card">
            <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                <TableHead className="w-[50px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredParticipants.length === 0 ? (
                <TableRow>
                    <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                    >
                    {participants.length === 0
                        ? "No participants yet. Add someone to this meeting."
                        : "No participants match your filters."}
                    </TableCell>
                </TableRow>
                ) : (
                filteredParticipants.map((participant) => {
                    const user = usersMap.get(participant.userId)
                    if (!user) return null

                    return (
                    <TableRow key={participant.userId}>
                        <TableCell>
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                            src={user.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                            />
                            <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                            {user.firstName.charAt(0)}
                            {user?.lastName?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        </TableCell>
                        <TableCell className="font-medium text-card-foreground">
                        {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                        {user.email}
                        </TableCell>
                        <TableCell>
                        <Select
                            value={participant.status}
                            onValueChange={(v) =>
                            onChangeStatus(
                                participant.userId,
                                v as keyof typeof ParticipantStatus
                            )
                            }
                        >
                            <SelectTrigger className="h-8 w-[130px]">
                            <SelectValue>
                                <span className="flex items-center gap-1.5">
                                {participant.status === "confirmed" ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                                )}
                                <span className="capitalize">
                                    {participant.status}
                                </span>
                                </span>
                            </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="confirmed">
                                <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                Confirmed
                                </span>
                            </SelectItem>
                            <SelectItem value="pending">
                                <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-amber-500" />
                                Pending
                                </span>
                            </SelectItem>
                            </SelectContent>
                        </Select>
                        </TableCell>
                        <TableCell className="text-right">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setRemovingUserId(participant.userId)}
                            aria-label={`Remove ${user.firstName} ${user.lastName}`}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </TableCell>
                    </TableRow>
                    )
                })
                )}
            </TableBody>
            </Table>
        </div>

        {/* Add Participant Dialog */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>Add Participant</DialogTitle>
                <DialogDescription>
                Search and select a user to add to this meeting.
                </DialogDescription>
            </DialogHeader>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                placeholder="Search users..."
                value={addSearch}
                onChange={(e) => setAddSearch(e.target.value)}
                className="pl-9"
                />
            </div>
            <div className="flex-1 overflow-y-auto -mx-6 px-6 max-h-[400px]">
                {availableUsers.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                    {addSearch
                    ? "No users found matching your search."
                    : "All users have been added to this meeting."}
                </p>
                ) : (
                <div className="flex flex-col gap-1">
                    {availableUsers.map((user) => (
                    <button
                        key={user._id}
                        type="button"
                        onClick={() => {
                        onAddParticipant(user._id)
                        }}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-accent transition-colors"
                    >
                        <Avatar className="h-8 w-8">
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
                        <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                    ))}
                </div>
                )}
            </div>
            </DialogContent>
        </Dialog>

        {/* Remove Confirm */}
        <AlertDialog
            open={removingUserId !== null}
            onOpenChange={(open) => {
            if (!open) setRemovingUserId(null)
            }}
        >
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Remove Participant</AlertDialogTitle>
                <AlertDialogDescription>
                {removingUser ? (
                    <>
                    Are you sure you want to remove{" "}
                    <span className="font-semibold text-foreground">
                        {removingUser.firstName} {removingUser.lastName}
                    </span>{" "}
                    from this meeting?
                    </>
                ) : (
                    "Are you sure you want to remove this participant?"
                )}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                onClick={handleRemove}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                Remove
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </div>
    )
}

"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  Search,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CalendarDays,
  ImageIcon,
  Users,
  Eye,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DeleteMeetingDialog } from "@/components/delete-meeting-dialog"
import { apiBack } from "@/api/backend"
import { ApiError } from "@/error/api"
import { useQuery } from "@tanstack/react-query"
import type { IMeeting, IParticipant } from "@repo/shared-types"

const PAGE_SIZE = 30
const fetchMeetingList = async () => {
    const res = await apiBack.get(
    "/meetings/list"
    )
    
    if (res.data.isError) {
        throw new ApiError(res.data.message);
    }
    return res.data.data;
 };

const fetchParticipantList = async (meetingId: string) => {
    const res = await apiBack.get(
        "/participants/list", {
            params: { meetingId }
        }
    )
    
    if (res.data.isError) {
        throw new ApiError(res.data.message);
    }
    return res.data.data;
 };

export function MeetingsTable() {
    const meetingId = ''
    const { data: meetings = [], isLoading } = useQuery<IMeeting[]>({
        queryKey: ['meetings/list'],
        queryFn: () => fetchMeetingList()
    });

    const { data: participants = [], isParticipantsLoading } = useQuery<IParticipant[]>({
        queryKey: ['participants/list'],
        queryFn: () => fetchParticipantList(meetingId)
    });

    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    // Delete dialog state
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deletingMeeting, setDeletingMeeting] = useState<IMeeting | null>(null)

    // Filtered
    const filteredMeetings = useMemo(() => {
        return meetings.filter(
        (m) =>
            search === "" || m.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [meetings, search])

    // Pagination
    const totalPages = Math.max(
        1,
        Math.ceil(filteredMeetings.length / PAGE_SIZE)
    )
    const safeCurrentPage = Math.min(currentPage, totalPages)
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
    const paginatedMeetings = filteredMeetings.slice(
        startIndex,
        startIndex + PAGE_SIZE
    )

    // Stats
    const totalCount = meetings.length
    const totalParticipants = participants.length;
    const totalPhotos = meetings.reduce((sum, m) => sum + m.gallery.length, 0)

    async function handleDelete() {
        if (!deletingMeeting) return
        await apiBack.put(
            "/users/delete", {}, {
                params: { _id: deletingMeeting._id }
            }
        )
        setDeleteOpen(false)
        setDeletingMeeting(null)
    }

    function openDelete(meeting: IMeeting) {
        setDeletingMeeting(meeting)
        setDeleteOpen(true)
    }

    function handleSearchChange(value: string) {
        setSearch(value)
        setCurrentPage(1)
    }

    function getPageNumbers() {
        const pages: (number | "ellipsis")[] = []
        if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
        pages.push(1)
        if (safeCurrentPage > 3) pages.push("ellipsis")
        const start = Math.max(2, safeCurrentPage - 1)
        const end = Math.min(totalPages - 1, safeCurrentPage + 1)
        for (let i = start; i <= end; i++) pages.push(i)
        if (safeCurrentPage < totalPages - 2) pages.push("ellipsis")
        pages.push(totalPages)
        }
        return pages
    }

    return (
        <div className="flex flex-col gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Total Meetings</p>
                <p className="text-2xl font-semibold text-card-foreground">
                {totalCount}
                </p>
            </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Total Participantes</p>
                <p className="text-2xl font-semibold text-card-foreground">
                {totalParticipants}
                </p>
            </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ImageIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Total Fotos</p>
                <p className="text-2xl font-semibold text-card-foreground">
                {totalPhotos}
                </p>
            </div>
            </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Buscar meetings..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
            />
            </div>
            <Button asChild className="gap-1.5 shrink-0">
            <Link href="/meetings/new">
                <Plus className="h-4 w-4" />
                Novo Meeting
            </Link>
            </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
            <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                <TableHead>Nome</TableHead>
                <TableHead className="w-[120px]">Participantes</TableHead>
                <TableHead className="w-[100px]">Fotos</TableHead>
                <TableHead className="w-[130px]">Criado em</TableHead>
                <TableHead className="w-[140px] text-right">Acoes</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {paginatedMeetings.length === 0 ? (
                <TableRow>
                    <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                    >
                    {search
                        ? "Nenhum meeting encontrado."
                        : "Nenhum meeting ainda. Clique em 'Novo Meeting' para criar."}
                    </TableCell>
                </TableRow>
                ) : (
                paginatedMeetings.map((meeting) => {
                    const confirmedCount = participants.filter(
                    (p) => p.status === "confirmed"
                    ).length
                    return (
                    <TableRow key={meeting._id}>
                        <TableCell className="font-medium text-card-foreground">
                        {meeting.name}
                        </TableCell>
                        <TableCell>
                        <div className="flex items-center gap-2">
                            <span className="text-card-foreground">
                            {participants.length}
                            </span>
                            <Badge
                            variant="secondary"
                            className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            >
                            {confirmedCount} conf.
                            </Badge>
                        </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                        {meeting.gallery.length}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(meeting.createdAt), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                            <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            asChild
                            >
                            <Link
                                href={`/meetings/${meeting._id}`}
                                aria-label={`Ver ${meeting.name}`}
                            >
                                <Eye className="h-4 w-4" />
                            </Link>
                            </Button>
                            <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => openDelete(meeting)}
                            aria-label={`Deletar ${meeting.name}`}
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        </TableCell>
                    </TableRow>
                    )
                })
                )}
            </TableBody>
            </Table>

            {/* Pagination Footer */}
            {filteredMeetings.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t px-4 py-3">
                <p className="text-sm text-muted-foreground">
                Mostrando{" "}
                <span className="font-medium text-foreground">
                    {startIndex + 1}
                </span>{" "}
                a{" "}
                <span className="font-medium text-foreground">
                    {Math.min(startIndex + PAGE_SIZE, filteredMeetings.length)}
                </span>{" "}
                de{" "}
                <span className="font-medium text-foreground">
                    {filteredMeetings.length}
                </span>{" "}
                meetings
                </p>
                <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={safeCurrentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    aria-label="Primeira pagina"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={safeCurrentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    aria-label="Pagina anterior"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {getPageNumbers().map((page, idx) =>
                    page === "ellipsis" ? (
                    <span
                        key={`ellipsis-${idx}`}
                        className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
                        aria-hidden
                    >
                        ...
                    </span>
                    ) : (
                    <Button
                        key={page}
                        variant={page === safeCurrentPage ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(page)}
                        aria-label={`Pagina ${page}`}
                        aria-current={
                        page === safeCurrentPage ? "page" : undefined
                        }
                    >
                        {page}
                    </Button>
                    )
                )}
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={safeCurrentPage === totalPages}
                    onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    aria-label="Proxima pagina"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={safeCurrentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    aria-label="Ultima pagina"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
                </div>
            </div>
            )}
        </div>

        {/* Delete Dialog */}
        <DeleteMeetingDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            meeting={deletingMeeting}
            onConfirm={handleDelete}
        />
        </div>
    )
}

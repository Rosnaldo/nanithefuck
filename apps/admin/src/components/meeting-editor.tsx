import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Search,
  UserPlus,
  Upload,
  ImageIcon,
  Film,
  X,
  Pencil,
  Link as LinkIcon,
  CalendarPlus,
  Trash2,
  Clock,
  Sun,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
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
  DialogFooter,
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
import { Weekday, WeekdayAll, type IDay, type IMeeting, type IParticipant, type IPicture, type IUser, type PictureType } from "@repo/shared-types"
import { useQueries, type UseQueryOptions } from "@tanstack/react-query"
import { apiBack } from "@/api/backend"
import { ApiError } from "@/error/api"


interface MeetingEditorProps {
    meetingId: string
}

function isVideoFile(file: File): boolean {
    return file.type.startsWith("video/")
}

function getImageDimensions(
    src: string
): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = src
    })
}

function getVideoDimensions(
    src: string
): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video")
        video.preload = "metadata"
        video.onloadedmetadata = () =>
        resolve({ width: video.videoWidth, height: video.videoHeight })
        video.onerror = () => reject(new Error("Failed to load video"))
        video.src = src
    })
}

function toRatio(width: number, height: number): { w: number; h: number } {
    if (width === 0 || height === 0) return { w: 1, h: 1 }
    const ratio = width / height
    if (ratio >= 1) {
        return { w: Math.round(ratio * 10) / 10, h: 1 }
    }
    return { w: 1, h: Math.round((1 / ratio) * 10) / 10 }
}

function clampDecimal(val: string): string {
    const num = parseFloat(val)
    if (isNaN(num)) return val
    return String(Math.round(num * 10) / 10)
}

function getWeekday(date: Date): keyof typeof Weekday {
    return WeekdayAll[date.getDay()] as keyof typeof Weekday
}

function formatDateInput(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
}

// Pending file waiting for user to fill w/h
interface PendingFile {
    url: string
    type: keyof typeof PictureType
}

const fetchMeetingList = async () => {
    const res = await apiBack.get(
        "/meetings/list"
    )
    
    if (res.data.isError) {
        throw new ApiError(res.data.message);
    }
    return res.data.data;
 };

const fetchUserList = async () => {
    const res = await apiBack.get(
        "/users/list",
    )
    
    if (res.data.isError) {
        throw new ApiError(res.data.message);
    }
    return res.data.data;
};

const fetchParticipantList = (meetingId: string) => async () => {
    const res = await apiBack.get(
        "/users/participants", {
            params: { meetingId }
        }
    )
    
    if (res.data.isError) {
        throw new ApiError(res.data.message);
    }
    return res.data.data;
};

export function MeetingEditor({ meetingId }: MeetingEditorProps) {
    const navigate = useNavigate()

    const results = useQueries<[
        UseQueryOptions<IMeeting[]>,
        UseQueryOptions<IUser[]>,
        UseQueryOptions<IParticipant[]>,
    ]>({
        queries: [
            { queryKey: ['meetings/list'], queryFn: fetchMeetingList },
            { queryKey: ['users/list'], queryFn: fetchUserList },
            { queryKey: ['users/participants'], queryFn: fetchParticipantList(meetingId) },
        ],
    });

    const isLoading = results.some(q => q.isLoading)
    const isError = results.some(q => q.isError)
    const firstError = results.find(q => q.isError)?.error

    function Loading() {
        return <div>Loading...</div>;
    }

    function ErrorState({ error }: { error: Error }) {
        return <div style={{ color: "red" }}>{error.message}</div>;
    }

    if (isLoading) return <Loading />;
    if (isError) return <ErrorState error={firstError as Error} />;

    const meetings = results[0].data || [];
    const users = results[1].data || [];
    const participants = results[2].data || [];

    const existingMeeting = meetingId
        ? meetings.find((m) => m._id === meetingId)
        : null

    const isNew = !meetingId

    const [name, setName] = useState("")
    const [nameError, setNameError] = useState("")
    const [gallery, setGallery] = useState<IPicture[]>([])
    const [days, setDays] = useState<IDay[]>([])
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())
    const [guestSearch, setGuestSearch] = useState("")
    const [isDraggingOver, setIsDraggingOver] = useState(false)
    const [deletePhotoIndex, setDeletePhotoIndex] = useState<number | null>(null)
    const [previewItem, setPreviewItem] = useState<IPicture | null>(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    // URL Dialog state
    const [urlDialogOpen, setUrlDialogOpen] = useState(false)
    const [urlValue, setUrlValue] = useState("")
    const [urlError, setUrlError] = useState("")
    const [urlType, setUrlType] = useState<keyof typeof PictureType>("image")
    const [urlW, setUrlW] = useState("")
    const [urlH, setUrlH] = useState("")

    // Pending file dialog state (for uploads / drops)
    const [pendingFile, setPendingFile] = useState<PendingFile | null>(null)
    const [pendingW, setPendingW] = useState("")
    const [pendingH, setPendingH] = useState("")

    // Edit item dialog state
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [editType, setEditType] = useState<keyof typeof PictureType>("image")
    const [editW, setEditW] = useState("")
    const [editH, setEditH] = useState("")

    const fileInputRef = useRef<HTMLInputElement>(null)
    const dropZoneRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (existingMeeting) {
            setName(existingMeeting.name)
            setGallery([...existingMeeting.gallery])
            setDays([...existingMeeting.days])
            setSelectedUserIds(
                new Set(participants.map((p) => p.userId))
            )
        } else {
            setName("")
            setGallery([])
            setDays([])
            setSelectedUserIds(new Set())
        }
        setHasUnsavedChanges(false)
    }, [existingMeeting])

    if (meetingId && !existingMeeting) {
        return (
        <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg font-medium text-foreground">
            Meeting nao encontrado
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
            Esse meeting pode ter sido removido.
            </p>
            <Button variant="outline" className="mt-4" asChild>
            <a href="/meetings">Voltar para Meetings</a>
            </Button>
        </div>
        )
    }

    const filteredUsers = useMemo(() => {
        const query = guestSearch.toLowerCase().trim()
        const filtered = users.filter((u) => {
            if (!query) return true
            const fullName = `${u.firstName} ${u.lastName}`.toLowerCase()
            return fullName.includes(query) || u?.email?.toLowerCase().includes(query)
        })
        return filtered.sort((a, b) => {
        const aSelected = selectedUserIds.has(a._id)
        const bSelected = selectedUserIds.has(b._id)
        if (aSelected && !bSelected) return -1
        if (!aSelected && bSelected) return 1
        return `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
        )
        })
    }, [users, selectedUserIds, guestSearch])

    function markChanged() {
        setHasUnsavedChanges(true)
    }

    function toggleUser(userId: string) {
        setSelectedUserIds((prev) => {
        const next = new Set(prev)
        if (next.has(userId)) {
            next.delete(userId)
        } else {
            next.add(userId)
        }
        return next
        })
        markChanged()
    }

    // --- Drag & Drop ---
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingOver(false)
    }, [])

    const readFileAsDataUrl = useCallback((file: File): Promise<string> => {
        return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
        })
    }, [])

    const openPendingDialog = useCallback(
        async (file: File) => {
        if (file.size > 50 * 1024 * 1024) return
        const dataUrl = await readFileAsDataUrl(file)
        const fileType: keyof typeof PictureType = isVideoFile(file) ? "video" : "image"
        setPendingFile({ url: dataUrl, type: fileType })

        // Pre-fill w/h from actual media dimensions
        try {
            const dims =
            fileType === "video"
                ? await getVideoDimensions(dataUrl)
                : await getImageDimensions(dataUrl)
            const ratio = toRatio(dims.width, dims.height)
            setPendingW(String(ratio.w))
            setPendingH(String(ratio.h))
        } catch {
            setPendingW("")
            setPendingH("")
        }
        },
        [readFileAsDataUrl]
    )

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingOver(false)

        const files = Array.from(e.dataTransfer.files)
        const mediaFile = files.find(
            (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
        )
        if (mediaFile) openPendingDialog(mediaFile)
        },
        [openPendingDialog]
    )

    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? [])
        const mediaFile = files.find(
            (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
        )
        if (mediaFile) openPendingDialog(mediaFile)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    function handleConfirmPending() {
        if (!pendingFile) return
        const w = Math.round(Number(pendingW) * 10) / 10
        const h = Math.round(Number(pendingH) * 10) / 10
        if (!w || w <= 0 || !h || h <= 0) return

        const item: IPicture = {
            type: pendingFile?.type,
            url: pendingFile?.url,
            w,
            h,
        }
        setGallery((prev) => [...prev, item])
        setPendingFile(null)
        setPendingW("")
        setPendingH("")
        markChanged()
    }

    function handleAddUrl(e: React.FormEvent) {
        e.preventDefault()
        if (!urlValue.trim()) {
            setUrlError("Insira uma URL")
            return
        }
        try {
            new URL(urlValue.trim())
        } catch {
            setUrlError("URL invalida")
            return
        }
        const w = Math.round(Number(urlW) * 10) / 10
        const h = Math.round(Number(urlH) * 10) / 10
        if (!w || w <= 0 || !h || h <= 0) return

        const item: IPicture = {
            type: urlType,
            url: urlValue.trim(),
            w,
            h,
        }
        setGallery((prev) => [...prev, item])
        setUrlValue("")
        setUrlError("")
        setUrlW("")
        setUrlH("")
        setUrlType("image")
        setUrlDialogOpen(false)
        markChanged()
    }

    function openEditDialog(index: number) {
        const item = gallery[index]
        if (!item) return
        setEditIndex(index)
        setEditType(item.type)
        setEditW(String(item.w))
        setEditH(String(item.h))
    }

    function handleSaveEdit() {
        if (editIndex === null) return
        const w = Math.round(Number(editW) * 10) / 10
        const h = Math.round(Number(editH) * 10) / 10
        if (!w || w <= 0 || !h || h <= 0) return

        setGallery((prev) =>
            prev.map((item, i) =>
                i === editIndex ? { ...item, type: editType, w, h } : item
            )
        )
        setEditIndex(null)
        markChanged()
    }

    function confirmDeletePhoto() {
        if (deletePhotoIndex !== null) {
            setGallery((prev) => prev.filter((_, i) => i !== deletePhotoIndex))
            setDeletePhotoIndex(null)
            markChanged()
        }
    }

    // --- Save ---
    async function handleSave() {
        if (!name.trim()) {
            setNameError("Nome do meeting obrigatorio")
            return
        }

        if (existingMeeting) {
            await apiBack.put(
                "/users/edit", existingMeeting, {
                    params: { _id: existingMeeting?._id }
                }
            )
        } else {
            await apiBack.post(
                "/users/create",
                existingMeeting,
            )
        }

        setHasUnsavedChanges(false)
        navigate("/meetings")
    }

    return (
        <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
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
                {isNew ? "Novo Meeting" : "Editar Meeting"}
                </h1>
                <p className="text-sm text-muted-foreground">
                {isNew
                    ? "Preencha os detalhes do novo meeting"
                    : `Editando "${existingMeeting?.name}"`}
                </p>
            </div>
            </div>
            <Button onClick={handleSave} className="gap-1.5">
            <Save className="h-4 w-4" />
            {isNew ? "Criar Meeting" : "Salvar Alteracoes"}
            </Button>
        </div>

        {/* Meeting Name */}
        <div className="rounded-lg border bg-card p-6">
            <Label htmlFor="meeting-name" className="text-base font-semibold">
            Nome do Meeting
            </Label>
            <p className="mt-0.5 text-sm text-muted-foreground">
            Escolha um nome descritivo para o meeting.
            </p>
            <Input
            id="meeting-name"
            value={name}
            onChange={(e) => {
                setName(e.target.value)
                setNameError("")
                markChanged()
            }}
            placeholder="Ex: Sprint Planning Q1"
            className="mt-3 max-w-lg"
            />
            {nameError && (
            <p className="mt-1.5 text-xs text-destructive">{nameError}</p>
            )}
        </div>

        {/* Days Section */}
        <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
            <div>
                <h2 className="text-base font-semibold text-card-foreground flex items-center gap-2">
                <CalendarPlus className="h-4 w-4" />
                Dias do Evento
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                Adicione os dias em que o meeting acontecera.
                </p>
            </div>
            <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                const nextDay = days.length + 1
                const date = new Date()
                if (days.length > 0) {
                    const lastDate = new Date(days[days.length - 1].date)
                    date.setTime(lastDate.getTime())
                    date.setDate(date.getDate() + 1)
                }
                setDays((prev) => [
                    ...prev,
                    {
                        day: nextDay,
                        start: "09:00",
                        finish: "17:00",
                        weekday: getWeekday(date),
                        date,
                        allDayLong: false,
                    },
                ])
                markChanged()
                }}
            >
                <CalendarPlus className="h-3.5 w-3.5" />
                Adicionar Dia
            </Button>
            </div>

            {days.length === 0 ? (
            <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 py-10">
                <CalendarPlus className="h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                Nenhum dia adicionado. Clique em &quot;Adicionar Dia&quot; para comecar.
                </p>
            </div>
            ) : (
            <div className="mt-4 flex flex-col gap-3">
                {days.map((day, index) => (
                <div
                    key={index}
                    className="rounded-lg border bg-background p-4"
                >
                    <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">
                        Dia {day.day}
                        {day.weekday && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                            ({day.weekday})
                        </span>
                        )}
                    </h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                        setDays((prev) =>
                            prev
                            .filter((_, i) => i !== index)
                            .map((d, i) => ({ ...d, day: i + 1 }))
                        )
                        markChanged()
                        }}
                        aria-label={`Remover dia ${day.day}`}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Date */}
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs text-muted-foreground">
                        Data
                        </Label>
                        <Input
                        type="date"
                        value={formatDateInput(new Date(day.date))}
                        onChange={(e) => {
                            const newDate = new Date(e.target.value + "T12:00:00")
                            setDays((prev) =>
                            prev.map((d, i) =>
                                i === index
                                ? {
                                    ...d,
                                    date: newDate,
                                    weekday: getWeekday(newDate),
                                    }
                                : d
                            )
                            )
                            markChanged()
                        }}
                        className="h-9"
                        />
                    </div>

                    {/* Start */}
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Inicio
                        </Label>
                        <Input
                        type="time"
                        value={day.start ?? ""}
                        disabled={day.allDayLong}
                        onChange={(e) => {
                            setDays((prev) =>
                            prev.map((d, i) =>
                                i === index ? { ...d, start: e.target.value } : d
                            )
                            )
                            markChanged()
                        }}
                        className="h-9"
                        />
                    </div>

                    {/* Finish */}
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Termino
                        </Label>
                        <Input
                        type="time"
                        value={day.finish ?? ""}
                        disabled={day.allDayLong}
                        onChange={(e) => {
                            setDays((prev) =>
                            prev.map((d, i) =>
                                i === index ? { ...d, finish: e.target.value } : d
                            )
                            )
                            markChanged()
                        }}
                        className="h-9"
                        />
                    </div>

                    {/* All Day Long */}
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Sun className="h-3 w-3" />
                        Dia inteiro
                        </Label>
                        <label className="flex items-center gap-2 h-9 px-3 rounded-md border bg-background cursor-pointer hover:bg-accent transition-colors">
                        <Checkbox
                            checked={day.allDayLong}
                            onCheckedChange={(checked) => {
                            setDays((prev) =>
                                prev.map((d, i) =>
                                i === index
                                    ? {
                                        ...d,
                                        allDayLong: !!checked,
                                        start: checked ? undefined : "09:00",
                                        finish: checked ? undefined : "17:00",
                                    }
                                    : d
                                )
                            )
                            markChanged()
                            }}
                        />
                        <span className="text-sm">
                            {day.allDayLong ? "Sim" : "Nao"}
                        </span>
                        </label>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>

        {/* Gallery Section */}
        <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
            <div>
                <h2 className="text-base font-semibold text-card-foreground">
                Galeria
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                Arraste e solte imagens e videos, ou use os botoes para adicionar.
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => fileInputRef.current?.click()}
                >
                <Upload className="h-3.5 w-3.5" />
                Upload
                </Button>
                <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                aria-label="Upload de midia para galeria"
                />
                <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                    setUrlValue("")
                    setUrlError("")
                    setUrlW("")
                    setUrlH("")
                    setUrlType("image")
                    setUrlDialogOpen(true)
                }}
                >
                <LinkIcon className="h-3.5 w-3.5" />
                URL
                </Button>
            </div>
            </div>

            {/* Drop Zone */}
            <div
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 transition-colors ${
                isDraggingOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 bg-muted/30 hover:border-muted-foreground/40"
            }`}
            >
            <div className="flex items-center gap-3 text-muted-foreground">
                <ImageIcon className="h-8 w-8" />
                <Film className="h-8 w-8" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">
                Arraste e solte imagens ou videos aqui
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG, GIF, MP4, WEBM ate 50MB
            </p>
            <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => fileInputRef.current?.click()}
            >
                Selecionar Arquivos
            </Button>
            </div>

            {/* Gallery Grid */}
            {gallery.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {gallery.map((item, index) => (
                <div
                    key={`${index}-${item.url.substring(0, 30)}`}
                    className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                >
                    {item.type === "video" ? (
                    <video
                        src={item.url}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                        onMouseEnter={(e) =>
                        (e.target as HTMLVideoElement).play()
                        }
                        onMouseLeave={(e) => {
                        const vid = e.target as HTMLVideoElement
                        vid.pause()
                        vid.currentTime = 0
                        }}
                    />
                    ) : (
                    <button
                        type="button"
                        className="block h-full w-full"
                        onClick={() => setPreviewItem(item)}
                        aria-label={`Preview midia ${index + 1}`}
                    >
                        <img
                        src={item.url}
                        alt={`Galeria item ${index + 1}`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                    </button>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors pointer-events-none" />
                    {/* Action buttons */}
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEditDialog(index)}
                        aria-label={`Editar item ${index + 1}`}
                    >
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="destructive"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setDeletePhotoIndex(index)}
                        aria-label={`Remover item ${index + 1}`}
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                    </div>
                    {/* Type & ratio badge */}
                    <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 pointer-events-none">
                    {item.type === "video" && (
                        <div className="rounded bg-black/60 px-1.5 py-0.5">
                        <Film className="h-3 w-3 text-white" />
                        </div>
                    )}
                    <div className="rounded bg-black/60 px-1.5 py-0.5">
                        <span className="text-[10px] font-medium text-white">
                        {item.w}:{item.h}
                        </span>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>

        {/* Participants Section */}
        <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
            <div>
                <h2 className="text-base font-semibold text-card-foreground flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Convidados
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                Selecione os usuarios que serao convidados para este meeting.
                </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {selectedUserIds.size} selecionado
                {selectedUserIds.size !== 1 ? "s" : ""}
            </span>
            </div>

            <div className="relative mt-4 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Buscar usuarios por nome ou email..."
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
                className="pl-9"
            />
            </div>

            <div className="mt-3 h-[400px] overflow-y-auto rounded-lg border">
            {filteredUsers.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhum usuario encontrado.
                </p>
            ) : (
                filteredUsers.map((user) => {
                const isSelected = selectedUserIds.has(user._id)
                return (
                    <label
                    key={user._id}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b last:border-b-0 ${
                        isSelected ? "bg-primary/5" : "hover:bg-accent"
                    }`}
                    >
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleUser(user._id)}
                        className="shrink-0"
                    />
                    <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
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
                    {isSelected && (
                        <span className="shrink-0 text-xs font-medium text-primary">
                        Convidado
                        </span>
                    )}
                    </label>
                )
                })
            )}
            </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="sticky bottom-0 -mx-4 flex items-center justify-between rounded-lg border bg-card px-6 py-4 shadow-lg sm:-mx-6 lg:-mx-8">
            <p className="text-sm text-muted-foreground">
            {hasUnsavedChanges
                ? "Voce tem alteracoes nao salvas."
                : "Todas as alteracoes estao salvas."}
            </p>
            <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
                <a href="/meetings">Cancelar</a>
            </Button>
            <Button onClick={handleSave} className="gap-1.5">
                <Save className="h-4 w-4" />
                {isNew ? "Criar Meeting" : "Salvar"}
            </Button>
            </div>
        </div>

        {/* Pending File Dialog (upload / drag & drop) */}
        <Dialog
            open={pendingFile !== null}
            onOpenChange={(open) => {
            if (!open) setPendingFile(null)
            }}
        >
            <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
                <DialogTitle>Detalhes da Midia</DialogTitle>
                <DialogDescription>
                Informe a proporcao de largura e altura do conteudo.
                </DialogDescription>
            </DialogHeader>
            {pendingFile && (
                <div className="flex flex-col gap-4">
                {/* Preview */}
                <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                    {pendingFile.type === "video" ? (
                    <video
                        src={pendingFile.url}
                        controls
                        className="h-full w-full object-contain"
                    />
                    ) : (
                    <img
                        src={pendingFile.url}
                        alt="Preview"
                        className="h-full w-full object-contain"
                    />
                    )}
                </div>

                {/* Type display */}
                <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">Tipo:</Label>
                    <span className="text-sm font-medium capitalize text-foreground">
                    {pendingFile.type === "video" ? "Video" : "Foto"}
                    </span>
                </div>

                {/* Width / Height */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                    <Label htmlFor="pending-w">Largura (w)</Label>
                    <Input
                        id="pending-w"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={pendingW}
                        onChange={(e) => setPendingW(e.target.value)}
                        onBlur={() => setPendingW(clampDecimal(pendingW))}
                        placeholder="Ex: 16"
                    />
                    </div>
                    <div className="flex flex-col gap-1.5">
                    <Label htmlFor="pending-h">Altura (h)</Label>
                    <Input
                        id="pending-h"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={pendingH}
                        onChange={(e) => setPendingH(e.target.value)}
                        onBlur={() => setPendingH(clampDecimal(pendingH))}
                        placeholder="Ex: 9"
                    />
                    </div>
                </div>
                {pendingW && pendingH && Number(pendingW) > 0 && Number(pendingH) > 0 && (
                    <p className="text-xs text-muted-foreground">
                    Proporcao: {pendingW}:{pendingH}
                    </p>
                )}
                </div>
            )}
            <DialogFooter>
                <Button
                type="button"
                variant="outline"
                onClick={() => setPendingFile(null)}
                >
                Cancelar
                </Button>
                <Button
                type="button"
                onClick={handleConfirmPending}
                disabled={
                    !pendingW ||
                    !pendingH ||
                    Number(pendingW) <= 0 ||
                    Number(pendingH) <= 0
                }
                >
                Adicionar
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Add URL Dialog */}
        <Dialog open={urlDialogOpen} onOpenChange={setUrlDialogOpen}>
            <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
                <DialogTitle>Adicionar Midia por URL</DialogTitle>
                <DialogDescription>
                Cole a URL e informe a proporcao da midia.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUrl} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                <Label htmlFor="media-url">URL da Midia</Label>
                <Input
                    id="media-url"
                    value={urlValue}
                    onChange={(e) => {
                    setUrlValue(e.target.value)
                    setUrlError("")
                    }}
                    placeholder="https://exemplo.com/foto.jpg"
                />
                {urlError && (
                    <p className="text-xs text-destructive">{urlError}</p>
                )}
                </div>

                {/* Type selector */}
                <div className="flex flex-col gap-1.5">
                <Label>Tipo</Label>
                <Select
                    value={urlType}
                    onValueChange={(v) => setUrlType(v as keyof typeof PictureType)}
                >
                    <SelectTrigger>
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="photo">Foto</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                </Select>
                </div>

                {/* Width / Height */}
                <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="url-w">Largura (w)</Label>
                    <Input
                    id="url-w"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={urlW}
                    onChange={(e) => setUrlW(e.target.value)}
                    onBlur={() => setUrlW(clampDecimal(urlW))}
                    placeholder="Ex: 16"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="url-h">Altura (h)</Label>
                    <Input
                    id="url-h"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={urlH}
                    onChange={(e) => setUrlH(e.target.value)}
                    onBlur={() => setUrlH(clampDecimal(urlH))}
                    placeholder="Ex: 9"
                    />
                </div>
                </div>
                {urlW && urlH && Number(urlW) > 0 && Number(urlH) > 0 && (
                <p className="text-xs text-muted-foreground">
                    Proporcao: {urlW}:{urlH}
                </p>
                )}

                {/* Preview */}
                {urlValue && !urlError && (
                <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                    {urlType === "video" ? (
                    <video
                        src={urlValue}
                        controls
                        className="h-full w-full object-contain"
                    />
                    ) : (
                    <img
                        src={urlValue}
                        alt="Preview"
                        className="h-full w-full object-contain"
                        onError={() =>
                        setUrlError("Nao foi possivel carregar a midia dessa URL")
                        }
                    />
                    )}
                </div>
                )}
                <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setUrlDialogOpen(false)}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    disabled={
                    !urlW ||
                    !urlH ||
                    Number(urlW) <= 0 ||
                    Number(urlH) <= 0
                    }
                >
                    Adicionar
                </Button>
                </DialogFooter>
            </form>
            </DialogContent>
        </Dialog>

        {/* Edit Item Dialog */}
        <Dialog
            open={editIndex !== null}
            onOpenChange={(open) => {
            if (!open) setEditIndex(null)
            }}
        >
            <DialogContent className="sm:max-w-[440px]">
            <DialogHeader>
                <DialogTitle>Editar Midia</DialogTitle>
                <DialogDescription>
                Altere o tipo e a proporcao desta midia.
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
                {editIndex !== null && gallery[editIndex] && (
                <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                    {gallery[editIndex].type === "video" ? (
                    <video
                        src={gallery[editIndex].url}
                        controls
                        className="h-full w-full object-contain"
                    />
                    ) : (
                    <img
                        src={gallery[editIndex].url}
                        alt="Preview"
                        className="h-full w-full object-contain"
                    />
                    )}
                </div>
                )}

                <div className="flex flex-col gap-1.5">
                <Label>Tipo</Label>
                <Select
                    value={editType}
                    onValueChange={(v) => setEditType(v as keyof typeof PictureType)}
                >
                    <SelectTrigger>
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="photo">Foto</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-w">Largura (w)</Label>
                    <Input
                    id="edit-w"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={editW}
                    onChange={(e) => setEditW(e.target.value)}
                    onBlur={() => setEditW(clampDecimal(editW))}
                    placeholder="Ex: 16"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-h">Altura (h)</Label>
                    <Input
                    id="edit-h"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={editH}
                    onChange={(e) => setEditH(e.target.value)}
                    onBlur={() => setEditH(clampDecimal(editH))}
                    placeholder="Ex: 9"
                    />
                </div>
                </div>
                {editW && editH && Number(editW) > 0 && Number(editH) > 0 && (
                <p className="text-xs text-muted-foreground">
                    Proporcao: {editW}:{editH}
                </p>
                )}
            </div>
            <DialogFooter>
                <Button
                type="button"
                variant="outline"
                onClick={() => setEditIndex(null)}
                >
                Cancelar
                </Button>
                <Button
                type="button"
                onClick={handleSaveEdit}
                disabled={
                    !editW ||
                    !editH ||
                    Number(editW) <= 0 ||
                    Number(editH) <= 0
                }
                >
                Salvar
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Delete Photo Confirm */}
        <AlertDialog
            open={deletePhotoIndex !== null}
            onOpenChange={(open) => {
            if (!open) setDeletePhotoIndex(null)
            }}
        >
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Remover Midia</AlertDialogTitle>
                <AlertDialogDescription>
                Tem certeza de que deseja remover este item da galeria?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                onClick={confirmDeletePhoto}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                Remover
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        {/* Preview Dialog */}
        <Dialog
            open={previewItem !== null}
            onOpenChange={(open) => {
            if (!open) setPreviewItem(null)
            }}
        >
            <DialogContent className="max-w-3xl p-2">
            {previewItem &&
                (previewItem.type === "video" ? (
                <video
                    src={previewItem.url}
                    controls
                    className="w-full rounded-lg max-h-[80vh]"
                />
                ) : (
                <img
                    src={previewItem.url}
                    alt="Preview completo"
                    className="w-full rounded-lg object-contain max-h-[80vh]"
                />
                ))}
            </DialogContent>
        </Dialog>
        </div>
    )
}

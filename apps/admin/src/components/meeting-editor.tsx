import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Search,
  UserPlus,
  Upload,
  ImageIcon,
  Film,
  X,
  Trash2,
  GripVertical,
  Link as LinkIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
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
import { useApp } from "@/lib/app-context"
import { type Meeting, type Participant } from "@/lib/types"

interface MeetingEditorProps {
  meetingId: string | null // null = new meeting
}

export function MeetingEditor({ meetingId }: MeetingEditorProps) {
  const router = useRouter()
  const { meetings, setMeetings, users } = useApp()

  const existingMeeting = meetingId
    ? meetings.find((m) => m.id === meetingId)
    : null

  const isNew = !meetingId

  // Form state
  const [name, setName] = useState("")
  const [nameError, setNameError] = useState("")
  const [gallery, setGallery] = useState<string[]>([])
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())
  const [guestSearch, setGuestSearch] = useState("")
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [urlDialogOpen, setUrlDialogOpen] = useState(false)
  const [urlValue, setUrlValue] = useState("")
  const [urlError, setUrlError] = useState("")
  const [deletePhotoIndex, setDeletePhotoIndex] = useState<number | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Initialize state from existing meeting
  useEffect(() => {
    if (existingMeeting) {
      setName(existingMeeting.name)
      setGallery([...existingMeeting.gallery])
      setSelectedUserIds(
        new Set(existingMeeting.participants.map((p) => p.userId))
      )
    } else {
      setName("")
      setGallery([])
      setSelectedUserIds(new Set())
    }
    setHasUnsavedChanges(false)
  }, [existingMeeting])

  // 404
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
          <Link href="/meetings">Voltar para Meetings</Link>
        </Button>
      </div>
    )
  }

  // Filtered & sorted users
  const filteredUsers = useMemo(() => {
    const query = guestSearch.toLowerCase().trim()
    const filtered = users.filter((u) => {
      if (!query) return true
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase()
      return fullName.includes(query) || u.email.toLowerCase().includes(query)
    })
    return filtered.sort((a, b) => {
      const aSelected = selectedUserIds.has(a.id)
      const bSelected = selectedUserIds.has(b.id)
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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDraggingOver(false)

      const files = Array.from(e.dataTransfer.files)
      const mediaFiles = files.filter(
        (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
      )

      mediaFiles.forEach((file) => {
        if (file.size > 50 * 1024 * 1024) return // 50MB max
        const reader = new FileReader()
        reader.onloadend = () => {
          setGallery((prev) => [...prev, reader.result as string])
          markChanged()
        }
        reader.readAsDataURL(file)
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const mediaFiles = files.filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    )
    mediaFiles.forEach((file) => {
      if (file.size > 50 * 1024 * 1024) return
      const reader = new FileReader()
      reader.onloadend = () => {
        setGallery((prev) => [...prev, reader.result as string])
        markChanged()
      }
      reader.readAsDataURL(file)
    })
    if (fileInputRef.current) fileInputRef.current.value = ""
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
    setGallery((prev) => [...prev, urlValue.trim()])
    setUrlValue("")
    setUrlError("")
    setUrlDialogOpen(false)
    markChanged()
  }

  function confirmDeletePhoto() {
    if (deletePhotoIndex !== null) {
      setGallery((prev) => prev.filter((_, i) => i !== deletePhotoIndex))
      setDeletePhotoIndex(null)
      markChanged()
    }
  }

  function isVideo(url: string) {
    const videoExts = [".mp4", ".webm", ".ogg", ".mov", ".avi"]
    const lower = url.toLowerCase()
    if (lower.startsWith("data:video/")) return true
    return videoExts.some((ext) => lower.includes(ext))
  }

  // --- Save ---
  function handleSave() {
    if (!name.trim()) {
      setNameError("Nome do meeting obrigatorio")
      return
    }

    const meetingIdToUse = existingMeeting?.id ?? `meeting-${Date.now()}`

    const existingParticipantMap = new Map(
      existingMeeting?.participants?.map((p) => [p.userId, p]) ?? []
    )

    const participants: Participant[] = Array.from(selectedUserIds).map(
      (userId) => {
        const existing = existingParticipantMap.get(userId)
        return (
          existing ?? {
            userId,
            meetingId: meetingIdToUse,
            status: "pending" as const,
          }
        )
      }
    )

    if (existingMeeting) {
      setMeetings((prev) =>
        prev.map((m) =>
          m.id === existingMeeting.id
            ? { ...m, name: name.trim(), gallery, participants }
            : m
        )
      )
    } else {
      const newMeeting: Meeting = {
        id: meetingIdToUse,
        name: name.trim(),
        gallery,
        participants,
        createdAt: new Date().toISOString(),
      }
      setMeetings((prev) => [newMeeting, ...prev])
    }

    setHasUnsavedChanges(false)
    router.push("/meetings")
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
            onClick={() => router.push("/meetings")}
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

      {/* Gallery Section - Drag & Drop */}
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
              multiple
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
            {gallery.map((url, index) => (
              <div
                key={`${index}-${url.substring(0, 30)}`}
                className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
              >
                {isVideo(url) ? (
                  <video
                    src={url}
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
                    onClick={() => setPreviewUrl(url)}
                    aria-label={`Preview midia ${index + 1}`}
                  >
                    <img
                      src={url}
                      alt={`Galeria item ${index + 1}`}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      crossOrigin="anonymous"
                    />
                  </button>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors pointer-events-none" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1.5 right-1.5 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setDeletePhotoIndex(index)}
                  aria-label={`Remover item ${index + 1}`}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
                {isVideo(url) && (
                  <div className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 pointer-events-none">
                    <Film className="h-3 w-3 text-white" />
                  </div>
                )}
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

        {/* Search */}
        <div className="relative mt-4 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios por nome ou email..."
            value={guestSearch}
            onChange={(e) => setGuestSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* User list with checkboxes */}
        <div className="mt-3 h-[400px] overflow-y-auto rounded-lg border">
          {filteredUsers.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhum usuario encontrado.
            </p>
          ) : (
            filteredUsers.map((user) => {
              const isSelected = selectedUserIds.has(user.id)
              return (
                <label
                  key={user.id}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b last:border-b-0 ${
                    isSelected ? "bg-primary/5" : "hover:bg-accent"
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleUser(user.id)}
                    className="shrink-0"
                  />
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
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
            <Link href="/meetings">Cancelar</Link>
          </Button>
          <Button onClick={handleSave} className="gap-1.5">
            <Save className="h-4 w-4" />
            {isNew ? "Criar Meeting" : "Salvar"}
          </Button>
        </div>
      </div>

      {/* Add URL Dialog */}
      <Dialog open={urlDialogOpen} onOpenChange={setUrlDialogOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Adicionar Midia por URL</DialogTitle>
            <DialogDescription>
              Cole a URL da imagem ou video que deseja adicionar.
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
            {urlValue && !urlError && (
              <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                {isVideo(urlValue) ? (
                  <video
                    src={urlValue}
                    controls
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={urlValue}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
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
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </form>
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
        open={previewUrl !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewUrl(null)
        }}
      >
        <DialogContent className="max-w-3xl p-2">
          {previewUrl &&
            (isVideo(previewUrl) ? (
              <video
                src={previewUrl}
                controls
                className="w-full rounded-lg max-h-[80vh]"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview completo"
                className="w-full rounded-lg object-contain max-h-[80vh]"
                crossOrigin="anonymous"
              />
            ))}
        </DialogContent>
      </Dialog>
    </div>
  )
}

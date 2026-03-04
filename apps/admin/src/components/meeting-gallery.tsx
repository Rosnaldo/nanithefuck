import { useState, useRef } from "react"
import {
  Plus,
  Trash2,
  ImageIcon,
  Link as LinkIcon,
  Upload,
  Film,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import type { IPicture } from "@repo/shared-types"

function getMediaType(url: string): "image" | "video" {
    const videoExts = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"]
    const lower = url.toLowerCase().split("?")[0]
    return videoExts.some((ext) => lower.endsWith(ext)) ? "video" : "image"
}

function loadImageDimensions(
    url: string
): Promise<{ w: number; h: number }> {
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
        const d = gcd(img.naturalWidth, img.naturalHeight)
        resolve({ w: img.naturalWidth / d, h: img.naturalHeight / d })
        }
        img.onerror = () => resolve({ w: 4, h: 3 })
        img.src = url
    })
}

function loadVideoDimensions(
    url: string
): Promise<{ w: number; h: number }> {
    return new Promise((resolve) => {
        const video = document.createElement("video")
        video.preload = "metadata"
        video.onloadedmetadata = () => {
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
        const d = gcd(video.videoWidth, video.videoHeight)
        resolve({
            w: video.videoWidth / d,
            h: video.videoHeight / d,
        })
        }
        video.onerror = () => resolve({ w: 16, h: 9 })
        video.src = url
    })
}

interface MeetingGalleryProps {
    gallery: IPicture[]
    onAddItem: (item: IPicture) => void
    onRemoveItem: (index: number) => void
}

export function MeetingGallery({
    gallery,
    onAddItem,
    onRemoveItem,
}: MeetingGalleryProps) {
    const [addOpen, setAddOpen] = useState(false)
    const [urlValue, setUrlValue] = useState("")
    const [urlError, setUrlError] = useState("")
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
    const [previewItem, setPreviewItem] = useState<IPicture | null>(null)
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    async function handleAddUrl(e: React.FormEvent) {
        e.preventDefault()
        if (!urlValue.trim()) {
            setUrlError("Insira uma URL")
            return
        }
        try {
            new URL(urlValue.trim())
        } catch {
            setUrlError("Insira uma URL valida")
            return
        }
        setLoading(true)
        const url = urlValue.trim()
        const type = getMediaType(url)
        const dims =
        type === "video"
            ? await loadVideoDimensions(url)
            : await loadImageDimensions(url)
        onAddItem({ type, url, ...dims })
        setUrlValue("")
        setUrlError("")
        setAddOpen(false)
        setLoading(false)
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        const isVideo = file.type.startsWith("video/")
        const isImage = file.type.startsWith("image/")
        if (!isImage && !isVideo) return
        if (file.size > 50 * 1024 * 1024) return

        const reader = new FileReader()
        reader.onloadend = async () => {
        const dataUrl = reader.result as string
        const type = isVideo ? "video" : "photo"
        const dims =
            type === "video"
            ? await loadVideoDimensions(dataUrl)
            : await loadImageDimensions(dataUrl)
        onAddItem({ type, url: dataUrl, ...dims } as IPicture)
        }
        reader.readAsDataURL(file)

        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    function confirmDelete() {
        if (deleteIndex !== null) {
            onRemoveItem(deleteIndex)
            setDeleteIndex(null)
        }
    }

    const photoCount = gallery.filter((i) => i.type === "image").length
    const videoCount = gallery.filter((i) => i.type === "video").length

    return (
        <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <div>
            <h2 className="text-lg font-semibold text-card-foreground">
                Galeria
            </h2>
            <p className="text-sm text-muted-foreground">
                {photoCount} {photoCount === 1 ? "foto" : "fotos"}
                {videoCount > 0 &&
                ` e ${videoCount} ${videoCount === 1 ? "video" : "videos"}`}
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
                aria-label="Upload para galeria"
            />
            <Button
                size="sm"
                className="gap-1.5"
                onClick={() => {
                    setUrlValue("")
                    setUrlError("")
                    setAddOpen(true)
                }}
            >
                <LinkIcon className="h-3.5 w-3.5" />
                Adicionar URL
            </Button>
            </div>
        </div>

        {gallery.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 py-12">
            <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
                Nenhum item na galeria. Faca upload ou adicione uma URL.
            </p>
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {gallery.map((item, index) => (
                <div
                    key={`${item.url}-${index}`}
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted"
                >
                <button
                    type="button"
                    className="block h-full w-full"
                    onClick={() => setPreviewItem(item)}
                    aria-label={`Preview ${item.type === "video" ? "video" : "foto"} ${index + 1}`}
                >
                    {item.type === "video" ? (
                    <div className="relative h-full w-full">
                        <video
                        src={item.url}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-black/60 p-2">
                            <Film className="h-5 w-5 text-white" />
                        </div>
                        </div>
                    </div>
                    ) : (
                    <img
                        src={item.url}
                        alt={`Galeria foto ${index + 1}`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    )}
                </button>
                <Badge
                    variant="secondary"
                    className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 opacity-80"
                >
                    {item.w}:{item.h}
                </Badge>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors pointer-events-none" />
                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setDeleteIndex(index)}
                    aria-label={`Remover ${item.type === "video" ? "video" : "foto"} ${index + 1}`}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
                </div>
            ))}

            <button
                type="button"
                onClick={() => {
                    setUrlValue("")
                    setUrlError("")
                    setAddOpen(true)
                }}
                className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Adicionar item"
            >
                <Plus className="h-6 w-6" />
                <span className="text-xs font-medium">Adicionar</span>
            </button>
            </div>
        )}

        {/* Add URL Dialog */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogContent className="sm:max-w-[440px]">
            <DialogHeader>
                <DialogTitle>Adicionar por URL</DialogTitle>
                <DialogDescription>
                Cole a URL da imagem ou video que deseja adicionar a galeria.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUrl} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                <Label htmlFor="media-url">URL</Label>
                <Input
                    id="media-url"
                    value={urlValue}
                    onChange={(e) => {
                    setUrlValue(e.target.value)
                    setUrlError("")
                    }}
                    placeholder="https://example.com/photo.jpg"
                />
                {urlError && (
                    <p className="text-xs text-destructive">{urlError}</p>
                )}
                </div>
                {urlValue && !urlError && (
                <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                    {getMediaType(urlValue) === "video" ? (
                    <video
                        src={urlValue}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                    />
                    ) : (
                    <img
                        src={urlValue}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={() =>
                        setUrlError("Nao foi possivel carregar esta URL")
                        }
                    />
                    )}
                </div>
                )}
                <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddOpen(false)}
                >
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Adicionando..." : "Adicionar"}
                </Button>
                </DialogFooter>
            </form>
            </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog
            open={deleteIndex !== null}
            onOpenChange={(open) => {
            if (!open) setDeleteIndex(null)
            }}
        >
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Remover Item</AlertDialogTitle>
                <AlertDialogDescription>
                Tem certeza que deseja remover este item da galeria?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                onClick={confirmDelete}
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

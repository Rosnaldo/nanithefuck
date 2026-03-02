"use client"

import { useState, useRef } from "react"
import { Plus, Trash2, ImageIcon, Link as LinkIcon, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

interface MeetingGalleryProps {
  gallery: string[]
  onAddPhoto: (url: string) => void
  onRemovePhoto: (index: number) => void
}

export function MeetingGallery({
  gallery,
  onAddPhoto,
  onRemovePhoto,
}: MeetingGalleryProps) {
  const [addOpen, setAddOpen] = useState(false)
  const [urlValue, setUrlValue] = useState("")
  const [urlError, setUrlError] = useState("")
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleAddUrl(e: React.FormEvent) {
    e.preventDefault()
    if (!urlValue.trim()) {
      setUrlError("Please enter a URL")
      return
    }
    try {
      new URL(urlValue.trim())
    } catch {
      setUrlError("Please enter a valid URL")
      return
    }
    onAddPhoto(urlValue.trim())
    setUrlValue("")
    setUrlError("")
    setAddOpen(false)
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) return
    if (file.size > 10 * 1024 * 1024) return

    const reader = new FileReader()
    reader.onloadend = () => {
      onAddPhoto(reader.result as string)
    }
    reader.readAsDataURL(file)

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function confirmDelete() {
    if (deleteIndex !== null) {
      onRemovePhoto(deleteIndex)
      setDeleteIndex(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Gallery</h2>
          <p className="text-sm text-muted-foreground">
            {gallery.length} {gallery.length === 1 ? "photo" : "photos"}
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
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Upload gallery photo"
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
            Add URL
          </Button>
        </div>
      </div>

      {gallery.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 py-12">
          <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            No photos yet. Upload or add a URL to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {gallery.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted"
            >
              <button
                type="button"
                className="block h-full w-full"
                onClick={() => setPreviewUrl(url)}
                aria-label={`Preview photo ${index + 1}`}
              >
                <img
                  src={url}
                  alt={`Gallery photo ${index + 1}`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  crossOrigin="anonymous"
                />
              </button>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setDeleteIndex(index)}
                aria-label={`Remove photo ${index + 1}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}

          {/* Add button tile */}
          <button
            type="button"
            onClick={() => {
              setUrlValue("")
              setUrlError("")
              setAddOpen(true)
            }}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Add photo"
          >
            <Plus className="h-6 w-6" />
            <span className="text-xs font-medium">Add Photo</span>
          </button>
        </div>
      )}

      {/* Add URL Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Add Photo by URL</DialogTitle>
            <DialogDescription>
              Paste the URL of the image you want to add to the gallery.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUrl} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="photo-url">Image URL</Label>
              <Input
                id="photo-url"
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
                <img
                  src={urlValue}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                  onError={() => setUrlError("Could not load image from this URL")}
                />
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Photo</Button>
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
            <AlertDialogTitle>Remove Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this photo from the gallery?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
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
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Full preview"
              className="w-full rounded-lg object-contain max-h-[80vh]"
              crossOrigin="anonymous"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

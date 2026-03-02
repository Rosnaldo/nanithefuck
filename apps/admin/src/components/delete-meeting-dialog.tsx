"use client"

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
import { type Meeting } from "@/lib/types"

interface DeleteMeetingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meeting: Meeting | null
  onConfirm: () => void
}

export function DeleteMeetingDialog({
  open,
  onOpenChange,
  meeting,
  onConfirm,
}: DeleteMeetingDialogProps) {
  if (!meeting) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Meeting</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {meeting.name}
            </span>
            ? This will remove all participants and gallery photos. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

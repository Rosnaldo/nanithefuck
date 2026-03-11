import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { type IMeeting } from "@repo/shared-types"
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { apiBack } from "@/api/backend"
import { checkErrorByField } from "@/utils/check_error_by_field"
import { mytoast } from "./toast"
import { ApiError } from "@/error/api"

interface MeetingCreateFormDialogProps {
    open: boolean
    openChange: (open: boolean) => void
    refetchMeetingsList: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<IMeeting[], Error>>
}

async function handleSaveMeeting(data: Partial<IMeeting>) {
    try {
        const res = await apiBack.post(
            "/meetings/create", data,
        );

        if (res.data.isError) {
            throw new ApiError(res.data.message);
        }

        mytoast.success("Meeting criado com sucesso!");
    } catch (error: unknown) {
        if (checkErrorByField(error, 'message')) {
            mytoast.error(error.message);
            return;
        }
        throw error;
    }
}

export function MeetingCreateFormDialog({
    open,
    openChange,
    refetchMeetingsList
}: MeetingCreateFormDialogProps) {
    const [name, setName] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (open) {
            setErrors({})
        }
    }, [open])

    function validate() {
        const newErrors: Record<string, string> = {}
        if (!name.trim()) newErrors.firstName = "Name is required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!validate()) return

        await handleSaveMeeting({ name })
        refetchMeetingsList()
        openChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={openChange}>
        <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
            <DialogTitle>
                {"Add New Meeting"}
            </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Chacara Meets"
                />
                {errors.firstName && (
                    <p className="text-xs text-destructive">{errors.firstName}</p>
                )}
                </div>
                <div className="flex flex-col gap-1.5">
                {errors.lastName && (
                    <p className="text-xs text-destructive">{errors.lastName}</p>
                )}
                </div>
            </div>

            <DialogFooter className="pt-2">
                <Button
                type="button"
                variant="outline"
                onClick={() => openChange(false)}
                >
                Cancel
                </Button>
                <Button type="submit">
                {"Add Meeting"}
                </Button>
            </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
    )
}

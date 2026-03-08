import { useState, useRef, useEffect } from "react"
import { Camera, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserRole, type IUser } from "@repo/shared-types"

interface UserFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: IUser | null
    onSave: (user: Partial<IUser>) => void
}

export function UserFormDialog({
    open,
    onOpenChange,
    user,
    onSave,
}: UserFormDialogProps) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState<keyof typeof UserRole>("member")
    const [avatar, setAvatar] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (open) {
        if (user) {
            setFirstName(user.firstName)
            setLastName(user?.lastName || '')
            setEmail(user?.email || '')
            setRole(user.role)
            setAvatar(user?.avatar || '')
        } else {
            setFirstName("")
            setLastName("")
            setEmail("")
            setRole("member")
            setAvatar("")
        }
        setErrors({})
        }
    }, [open, user])

    function validate() {
        const newErrors: Record<string, string> = {}
        if (!firstName.trim()) newErrors.firstName = "First name is required"
        if (!lastName.trim()) newErrors.lastName = "Last name is required"
        if (!email.trim()) newErrors.email = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        newErrors.email = "Invalid email format"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!validate()) return

        onSave({
        ...(user ? { _id: user._id } : {}),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        role,
        avatar,
        })
        onOpenChange(false)
    }

    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, avatar: "Please select an image file" }))
        return
        }

        if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
            ...prev,
            avatar: "Image must be under 5MB",
        }))
        return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
        setAvatar(reader.result as string)
        setErrors((prev) => {
            const next = { ...prev }
            delete next.avatar
            return next
        })
        }
        reader.readAsDataURL(file)
    }

    function removeAvatar() {
        setAvatar("")
        if (fileInputRef.current) {
        fileInputRef.current.value = ""
        }
    }

    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
            <DialogTitle>
                {user ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogDescription>
                {user
                ? "Update the user information below."
                : "Fill in the details to create a new user."}
            </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-3">
                <div className="relative group">
                <Avatar className="h-20 w-20 border-2">
                    <AvatarImage src={avatar} alt="User avatar" />
                    <AvatarFallback className="text-lg bg-muted text-muted-foreground">
                    {initials || "?"}
                    </AvatarFallback>
                </Avatar>
                {avatar && (
                    <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove avatar"
                    >
                    <X className="h-3 w-3" />
                    </button>
                )}
                </div>
                <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-1.5"
                >
                    <Camera className="h-3.5 w-3.5" />
                    Upload Photo
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-label="Upload avatar image"
                />
                </div>
                <div className="w-full">
                <Label htmlFor="avatar-url" className="text-xs text-muted-foreground">
                    Or paste image URL
                </Label>
                <Input
                    id="avatar-url"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatar.startsWith("data:") ? "" : avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="mt-1 h-8 text-xs"
                />
                </div>
                {errors.avatar && (
                <p className="text-xs text-destructive">{errors.avatar}</p>
                )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                />
                {errors.firstName && (
                    <p className="text-xs text-destructive">{errors.firstName}</p>
                )}
                </div>
                <div className="flex flex-col gap-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                />
                {errors.lastName && (
                    <p className="text-xs text-destructive">{errors.lastName}</p>
                )}
                </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                />
                {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
                )}
            </div>

            {/* Role */}
            {role !== UserRole.mock && (
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={(v) => setRole(v as keyof typeof UserRole)}>
                    <SelectTrigger id="role">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            )}

            <DialogFooter className="pt-2">
                <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                >
                Cancel
                </Button>
                <Button type="submit">
                {user ? "Save Changes" : "Add User"}
                </Button>
            </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
    )
}

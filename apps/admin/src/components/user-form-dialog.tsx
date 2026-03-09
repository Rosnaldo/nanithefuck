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
import { toast } from "sonner"
import { apiBack } from "@/api/backend"
import { useQuery } from "@tanstack/react-query"
import { ApiError } from "@/error/api"

interface UserFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    userEmail: string | null
    onSave: (user: Partial<IUser>) => void
}

export function UserFormDialog({
    open,
    onOpenChange,
    userEmail,
    onSave,
}: UserFormDialogProps) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [avatarUrl, setAvatarUrl] = useState("")
    const [role, setRole] = useState<keyof typeof UserRole>("member")
    const [errors, setErrors] = useState<Record<string, string>>({})
    const fileInputRef = useRef<HTMLInputElement>(null)

    async function fetchUser() {
        try {
            const res = await apiBack.get(
                "/users/by-email", {
                    params: { email: userEmail }
                }
            )
            
            if (res.data.isError) {
                throw new ApiError(res.data.message);
            }

            const user = res.data as IUser;
            return user;
        } catch (error) {
            if (error instanceof ApiError) {
                toast.error(error.message)
            }
            console.log('ProfileSection fetchUser: error', error);
            throw error;
        }
    }

    const { data: user, isLoading: isLoading, isError, error, refetch } = useQuery<IUser, ApiError>({
        queryKey: ['user-by-email'],
        queryFn: fetchUser
    });

    useEffect(() => {
        if (open) {
        if (user) {
            setFirstName(user.firstName)
            setLastName(user?.lastName || '')
            setEmail(user?.email || '')
            setRole(user.role)
            setAvatarUrl(user.avatar?.url || '')
        } else {
            setFirstName("")
            setLastName("")
            setEmail("")
            setRole("member")
            setAvatarUrl('')
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
        })
        onOpenChange(false)
    }

    const handleFileChange = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Por favor, selecione uma imagem.")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("A imagem deve ter no maximo 5MB.")
            return
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await apiBack.post("/users/upload-avatar", formData);
    
            if (res.data.isError) {
                toast.error(res.data.message)
            } else {
                const updated = res.data as IUser;
                setAvatarUrl(updated?.avatar?.url || '');
                toast.success("Avatar salvo com sucesso.")
            }
        } catch (error) {
            toast.error("Ocorreu um erro inesperado. Tente novamente.")
        } finally {
            await refetch();
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleFileChange(files[0])
        }
    }

    function removeAvatar() {
        setAvatarUrl("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

    function Loading() {
        return <div>Loading...</div>;
    }

    function ErrorState({ error }: { error: Error }) {
        return <div style={{ color: "red" }}>{error.message}</div>;
    }

    if (isLoading) return <Loading />;
    if (isError) return <ErrorState error={error as Error} />;

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
                    <AvatarImage src={avatarUrl} alt="User avatar" />
                    <AvatarFallback className="text-lg bg-muted text-muted-foreground">
                    {initials || "?"}
                    </AvatarFallback>
                </Avatar>
                {avatarUrl && (
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
                    onChange={handleInputChange}
                    className="hidden"
                    aria-label="Upload avatar image"
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

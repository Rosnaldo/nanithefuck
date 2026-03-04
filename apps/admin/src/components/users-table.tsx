import { useState, useMemo } from "react"
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  ShieldCheck,
  ChevronsLeft,
  ChevronsRight,
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserFormDialog } from "@/components/user-form-dialog"
import { DeleteUserDialog } from "@/components/delete-user-dialog"
import type { IUser, UserRole } from "@repo/shared-types"
import { apiBack } from "@/api/backend"
import { useQuery } from "@tanstack/react-query"
import { ApiError } from "@/error/api"

const PAGE_SIZE = 30
const fetchUsersList = async () => {
    const res = await apiBack.get(
        "/users/list"
    )
    if (res.data.isError) {
        throw new ApiError(res.data.message);
    }
    return res.data.data;
};

export function UsersTable() {
    const { data: users = [], isLoading, isError, error } = useQuery<IUser[]>({
        queryKey: ['users/list'],
        queryFn: () => fetchUsersList()
    });
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState<"all" | keyof typeof UserRole>("all")
    const [currentPage, setCurrentPage] = useState(1)

    // Dialog states
    const [formOpen, setFormOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<IUser | null>(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deletingUser, setDeletingUser] = useState<IUser | null>(null)

    // Filtered users
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
        const matchesSearch =
            search === "" ||
            `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase()) ||
            user?.email?.toLowerCase().includes(search.toLowerCase())
        const matchesRole = roleFilter === "all" || user.role === roleFilter
        return matchesSearch && matchesRole
        })
    }, [users, search, roleFilter])

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))
    const safeCurrentPage = Math.min(currentPage, totalPages)
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + PAGE_SIZE)

    // Stats
    const totalCount = users.length
    const adminCount = users.filter((u) => u.role === "admin").length
    const memberCount = users.filter((u) => u.role === "member").length

    async function handleSaveUser(userData: Partial<IUser>) {
        if (userData._id) {
            await apiBack.put(
                "/users/edit", userData, {
                    params: { _id: userData._id }
                }
            )
        } else {
            await apiBack.post(
                "/users/create",
                userData,
            )
        }
    }

    async function handleDeleteUser() {
        if (!deletingUser) return
        await apiBack.put(
            "/users/delete", {}, {
                params: { _id: deletingUser._id }
            }
        )
        setDeleteOpen(false)
        setDeletingUser(null)
    }

    function openEdit(user: IUser) {
        setEditingUser(user)
        setFormOpen(true)
    }

    function openAdd() {
        setEditingUser(null)
        setFormOpen(true)
    }

    function openDelete(user: IUser) {
        setDeletingUser(user)
        setDeleteOpen(true)
    }

    // Reset page on filter change
    function handleSearchChange(value: string) {
        setSearch(value)
        setCurrentPage(1)
    }

    function handleRoleFilterChange(value: string) {
        setRoleFilter(value as "all" | keyof typeof UserRole)
        setCurrentPage(1)
    }

    // Pagination pages to show
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

    function Loading() {
        return <div>Loading...</div>;
    }

    function ErrorState({ error }: { error: Error }) {
        return <div style={{ color: "red" }}>{error.message}</div>;
    }

    if (isLoading) return <Loading />;
    if (isError) return <ErrorState error={error as Error} />;

    return (
        <div className="flex flex-col gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-semibold text-card-foreground">{totalCount}</p>
            </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-semibold text-card-foreground">{adminCount}</p>
            </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="text-2xl font-semibold text-card-foreground">{memberCount}</p>
            </div>
            </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
                />
            </div>
            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
                <SelectTrigger className="w-[130px]">
                <SelectValue />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <Button onClick={openAdd} className="gap-1.5 shrink-0">
            <Plus className="h-4 w-4" />
            Add User
            </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
            <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                <TableHead className="w-[60px]">Avatar</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[100px]">Role</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {paginatedUsers.length === 0 ? (
                <TableRow>
                    <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                    >
                    {search || roleFilter !== "all"
                        ? "No users match your filters."
                        : "No users found. Click 'Add User' to create one."}
                    </TableCell>
                </TableRow>
                ) : (
                paginatedUsers.map((user) => (
                    <TableRow key={user._id}>
                    <TableCell>
                        <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                        <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                            {user.firstName.charAt(0)}
                            {user?.lastName?.charAt(0)}
                        </AvatarFallback>
                        </Avatar>
                    </TableCell>
                    <TableCell className="font-medium text-card-foreground">
                        {user.firstName}
                    </TableCell>
                    <TableCell className="text-card-foreground">{user.lastName}</TableCell>
                    <TableCell className="text-muted-foreground">
                        {user.email}
                    </TableCell>
                    <TableCell>
                        <Badge
                        variant={user.role === "admin" ? "default" : "secondary"}
                        className={
                            user.role === "admin"
                            ? "bg-primary/15 text-primary border-primary/20 hover:bg-primary/20"
                            : ""
                        }
                        >
                        {user.role === "admin" ? "Admin" : "Member"}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => openEdit(user)}
                            aria-label={`Edit ${user.firstName} ${user.lastName}`}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => openDelete(user)}
                            aria-label={`Delete ${user.firstName} ${user.lastName}`}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </div>
                    </TableCell>
                    </TableRow>
                ))
                )}
            </TableBody>
            </Table>

            {/* Pagination Footer */}
            {filteredUsers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t px-4 py-3">
                <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                    {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">
                    {Math.min(startIndex + PAGE_SIZE, filteredUsers.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                    {filteredUsers.length}
                </span>{" "}
                users
                </p>
                <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={safeCurrentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    aria-label="First page"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={safeCurrentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous page"
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
                        aria-label={`Page ${page}`}
                        aria-current={page === safeCurrentPage ? "page" : undefined}
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
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={safeCurrentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    aria-label="Last page"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
                </div>
            </div>
            )}
        </div>

        {/* Dialogs */}
        <UserFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            user={editingUser}
            onSave={handleSaveUser}
        />
        <DeleteUserDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            user={deletingUser}
            onConfirm={handleDeleteUser}
        />
        </div>
    )
}

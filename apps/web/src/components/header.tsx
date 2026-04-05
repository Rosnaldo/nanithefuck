import { Ticket, User, LogOut, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/providers/auth-provider"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import type { IUser } from "@repo/shared-types"
import { ApiError } from "@/error/api"
import { apiBack } from "@/api/backend"
import { mytoast } from "./toast"
import { Avatar } from "./avatar"

export function Header() {
    const { isAuthenticated, loggedUser, logout } = useAuth();
    async function fetchUser() {
        try {
            const res = await apiBack.get(
                "/users/by-email", {
                    params: { email: loggedUser.email }
                }
            )
            
            if (res.data.isError) {
                throw new ApiError(res.data.message);
            }

            const user = res.data as IUser;
            return user;
        } catch (error) {
            if (error instanceof ApiError) {
                mytoast.error(error.message)
            }
            throw error;
        }
    }

    const { data: user, isLoading: isLoading, isError, error } = useQuery<IUser, ApiError>({
        queryKey: ['user-by-email'],
        queryFn: fetchUser
    });

    function Loading() {
        return <div>Loading...</div>;
    }

    function ErrorState({ error }: { error: Error }) {
        return <div style={{ color: "red" }}>{error.message}</div>;
    }

    if (isLoading) return <Loading />;
    if (isError) return <ErrorState error={error as Error} />;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(220,210,195,0.05)] backdrop-blur-sm border border-[rgba(160,136,120,0.25)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="relative">
                    <Ticket className="w-8 h-8 text-primary animate-glow" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        Chácara<span className="text-primary">Meets</span>
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2">
                                <Avatar user={user!} className="w-[35px] h-[35px] mb-0" />
                                <div className="text-sm text-[var(--td)]">
                                    <h3>{user?.firstName} {user?.lastName}</h3>
                                </div>
                            </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56" sideOffset={8} alignOffset={0}>
                            <DropdownMenuItem className="flex items-center gap-2" asChild>
                                <Link to="/meeting/chacara-meets">
                                <Home className="w-4 h-4" />
                                <span>Evento</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center gap-2" asChild>
                                <Link to="/profile">
                                    <User className="w-10 h-10" />
                                    <span>Meu Perfil</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="flex items-center gap-2 text-destructive"
                                onClick={() => logout()}
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sair</span>
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button size="sm" asChild>
                            <Link to="/login">Entrar</Link>
                        </Button>
                    )}
                </div>
                </div>
            </div>
        </header>
    )
}

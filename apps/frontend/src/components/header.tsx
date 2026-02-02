import { Ticket, User, LogOut, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from "@/api/keycloak"
import { useAuth } from "@/providers/auth-provider"
import { Link } from "react-router-dom"

export function Header() {
    const { isAuthenticated } = useAuth();

    return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
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
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <img
                        src="/young-brazilian-man-smiling.jpg"
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover border-2 border-primary/50"
                        />
                        <span className="hidden sm:inline">Lucas Silva</span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="flex items-center gap-2" asChild>
                        <Link to="/main">
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

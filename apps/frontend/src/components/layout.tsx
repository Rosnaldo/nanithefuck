
import { Ticket } from "lucide-react"
import { AnimeBackground } from "@/components/anime-background"

export default function Layout({ children }: React.PropsWithChildren) {
    return (
        <main className="h-screen max-h-screen w-full  overflow-y-auto kc-scrollbar flex items-center justify-center relative">
            <AnimeBackground />

            <div className="justify-start flex flex-col h-screen w-full mx-4 relative z-10  py-4">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <a href="/" className="flex items-center gap-2 mb-4">
                        <Ticket className="w-10 h-10 text-primary animate-glow" />
                        <span className="text-2xl font-bold tracking-tight">
                        Chácara<span className="text-primary">Meets</span>
                        </span>
                    </a>
                </div>

                {/* Card */}
                <div className="flex justify-center w-full">
                    <div className="w-md bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
                        {children}
                    </div>
                </div>
            </div>
        </main>
    )
}

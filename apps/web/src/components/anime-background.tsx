import { useEffect, useState } from "react"

export function AnimeBackground() {
    const [sakuras, setSakuras] = useState<Array<{ id: number; left: number; delay: number; size: number }>>([])

    useEffect(() => {
        const newSakuras = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 10,
            size: Math.random() * 15 + 10,
        }))
        setSakuras(newSakuras)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

        {/* Anime-style decorative elements */}
        <svg className="absolute top-20 right-10 w-64 h-64 opacity-10 animate-float" viewBox="0 0 200 200">
            <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(350, 80%, 70%)" />
                <stop offset="100%" stopColor="hsl(180, 60%, 60%)" />
            </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="none" stroke="url(#grad1)" strokeWidth="2" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="url(#grad1)" strokeWidth="1" />
            <path d="M100 20 L100 180 M20 100 L180 100" stroke="url(#grad1)" strokeWidth="1" opacity="0.5" />
        </svg>

        <svg
            className="absolute bottom-40 left-10 w-48 h-48 opacity-10 animate-float"
            style={{ animationDelay: "2s" }}
            viewBox="0 0 200 200"
        >
            <defs>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(180, 60%, 60%)" />
                <stop offset="100%" stopColor="hsl(350, 80%, 70%)" />
            </linearGradient>
            </defs>
            <polygon points="100,10 190,190 10,190" fill="none" stroke="url(#grad2)" strokeWidth="2" />
            <polygon points="100,50 160,160 40,160" fill="none" stroke="url(#grad2)" strokeWidth="1" />
        </svg>

        {/* Sakura petals */}
        {sakuras.map((sakura) => (
            <svg
            key={sakura.id}
            className="absolute animate-sakura opacity-30"
            style={{
                left: `${sakura.left}%`,
                animationDelay: `${sakura.delay}s`,
                width: sakura.size,
                height: sakura.size,
            }}
            viewBox="0 0 20 20"
            >
            <path d="M10 0 C12 4 16 6 20 10 C16 12 12 16 10 20 C8 16 4 12 0 10 C4 8 8 4 10 0" fill="hsl(350, 80%, 75%)" />
            </svg>
        ))}

        {/* Japanese-style pattern */}
        <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
        />
        </div>
    )
}

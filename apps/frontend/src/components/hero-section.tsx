import { useEffect, useRef } from "react"
import { Users, MapPin, Calendar, Utensils, Waves, Beer } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (videoRef.current) {
        videoRef.current.play()
        }
    }, [])

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            loop
            muted
            playsInline
            autoPlay
            poster="/pool-party-churrasco-summer-friends-anime-style.jpg"
        >
            <source
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            type="video/mp4"
            />
        </video>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24">
            <div className="text-center space-y-8">
            {/* Event badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-sm text-primary font-medium">Evento Exclusivo - Vagas Limitadas</span>
            </div>

            {/* Main title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                Chácara Weekend
                <span className="text-primary block mt-2">Edition Summer</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Um fim de semana inesquecível na chácara com piscina, churrasco premium e open bar. Conheça pessoas
                incríveis, amigos de amigos, em um ambiente exclusivo e descontraído.
            </p>

            {/* Event info */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 bg-background/30 backdrop-blur-sm px-4 py-2 rounded-full">
                <Calendar className="w-5 h-5 text-primary" />
                <span>18-19 Janeiro 2026</span>
                </div>
                <div className="flex items-center gap-2 bg-background/30 backdrop-blur-sm px-4 py-2 rounded-full">
                <MapPin className="w-5 h-5 text-accent" />
                <span>Chácara Vista Verde, SP</span>
                </div>
                <div className="flex items-center gap-2 bg-background/30 backdrop-blur-sm px-4 py-2 rounded-full">
                <Users className="w-5 h-5 text-primary" />
                <span>50-80 pessoas</span>
                </div>
            </div>

            {/* What's included */}
            <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 text-foreground">
                <Waves className="w-5 h-5 text-accent" />
                <span>Piscina</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                <Utensils className="w-5 h-5 text-primary" />
                <span>Churrasco Premium</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                <Beer className="w-5 h-5 text-accent" />
                <span>Open Bar</span>
                </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
                <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg px-12 py-6 text-primary-foreground"
                onClick={() => document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth" })}
                >
                Garantir meu Ticket
                </Button>
            </div>
            </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>
    )
}

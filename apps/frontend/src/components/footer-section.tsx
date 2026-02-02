import { Ticket, Instagram, MessageCircle } from "lucide-react"

export function FooterSection() {
    return (
        <footer className="py-16 border-t border-border/50 relative z-10 w-full">
            <div className="mx-auto space-y-4 flex flex-col items-center">
                <div className="flex justify-center gap-2">
                <Ticket className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold">
                    Chácara<span className="text-primary">Meets</span>
                </span>
                </div>
                <p className="text-muted-foreground max-w-sm text-center">
                Criando conexões autênticas através de experiências únicas. Cada encontro é uma oportunidade de fazer
                novos amigos.
                </p>
                <div className="flex gap-4">
                <a href="#" className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                    <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                </a>
            </div>

            </div>

            {/* Copyright */}
            <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>© 2026 ChácaraMeets. Todos os direitos reservados.</p>
            </div>
        </footer>
    )
}

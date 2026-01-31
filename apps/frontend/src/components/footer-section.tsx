import { Ticket, Instagram, MessageCircle } from "lucide-react"

export function FooterSection() {
    return (
        <footer className="py-16 border-t border-border/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Footer content */}
            <div className="grid md:grid-cols-4 gap-8">
            {/* Logo and description */}
            <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                <Ticket className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold">
                    Chácara<span className="text-primary">Meets</span>
                </span>
                </div>
                <p className="text-muted-foreground max-w-sm">
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

            {/* Links */}
            <div className="space-y-4">
                <h3 className="font-semibold">Links</h3>
                <ul className="space-y-2 text-muted-foreground">
                <li>
                    <a href="#tickets" className="hover:text-foreground transition-colors">
                    Ingressos
                    </a>
                </li>
                <li>
                    <a href="#convidados" className="hover:text-foreground transition-colors">
                    Convidados
                    </a>
                </li>
                <li>
                    <a href="#galeria" className="hover:text-foreground transition-colors">
                    Galeria
                    </a>
                </li>
                <li>
                    <a href="#depoimentos" className="hover:text-foreground transition-colors">
                    Depoimentos
                    </a>
                </li>
                </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
                <h3 className="font-semibold">Legal</h3>
                <ul className="space-y-2 text-muted-foreground">
                <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                    Termos de Uso
                    </a>
                </li>
                <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                    Privacidade
                    </a>
                </li>
                <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                    Política de Reembolso
                    </a>
                </li>
                </ul>
            </div>
            </div>

            {/* Copyright */}
            <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>© 2026 ChácaraMeets. Todos os direitos reservados.</p>
            </div>
        </div>
        </footer>
    )
}

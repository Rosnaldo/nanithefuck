import { Ticket } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="py-8 border-t border-border/50 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">
              Chacara<span className="text-primary">Meets</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 ChacaraMeets. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

import { Clock, Users } from "lucide-react"

const saturdaySchedule = [
    { time: "7:00", title: "Abertura dos portões", description: "Chegada e boas-vindas", icon: Users },
    { time: "23:00", title: "Encerramento", description: "Despedida e fotos finais", icon: Users },
]

const sundaySchedule = [
    { time: "7:00", title: "Abertura dos portões", description: "Chegada e boas-vindas", icon: Users },
    { time: "17:00", title: "Encerramento", description: "Despedida do fim de semana", icon: Users },
]

export function ScheduleSection() {
    return (
        <section id="cronograma" className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm mb-4">
                <Clock className="w-4 h-4" />
                <span>Cronograma</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Programação do Evento</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
                Confira tudo que preparamos para você aproveitar ao máximo o fim de semana.
            </p>
            </div>

            {/* Schedule Grid */}
            <div className="grid md:grid-cols-2 gap-8">
            {/* Saturday */}
            <div className="bg-card/50 border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">SAB</span>
                </div>
                <div>
                    <h3 className="text-xl font-bold">Sábado</h3>
                    <p className="text-sm text-muted-foreground">18 de Janeiro</p>
                </div>
                </div>

                <div className="space-y-4">
                {saturdaySchedule.map((item, index) => (
                    <div key={index} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-4 h-4 text-primary" />
                        </div>
                        {index < saturdaySchedule.length - 1 && <div className="w-0.5 h-full bg-border mt-2"></div>}
                    </div>
                    <div className="pb-6">
                        <span className="text-xs text-primary font-medium">{item.time}</span>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Sunday */}
            <div className="bg-card/50 border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <span className="text-accent font-bold">DOM</span>
                </div>
                <div>
                    <h3 className="text-xl font-bold">Domingo</h3>
                    <p className="text-sm text-muted-foreground">19 de Janeiro</p>
                </div>
                </div>

                <div className="space-y-4">
                {sundaySchedule.map((item, index) => (
                    <div key={index} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <item.icon className="w-4 h-4 text-accent" />
                        </div>
                        {index < sundaySchedule.length - 1 && <div className="w-0.5 h-full bg-border mt-2"></div>}
                    </div>
                    <div className="pb-6">
                        <span className="text-xs text-accent font-medium">{item.time}</span>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </div>
        </section>
    )
}

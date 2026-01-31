import { Flame, ShowerHead, Waves, UtensilsCrossed, Camera, BedDouble, Wine, Music } from "lucide-react"

const features = [
    { icon: Flame, title: "Churrasco premium" },
    { icon: Waves, title: "Piscina privativa" },
    { icon: ShowerHead, title: "Chuveiros disponíveis" },
    { icon: UtensilsCrossed, title: "Comida liberada o dia inteiro" },
    { icon: Wine, title: "Open bar completo" },
    { icon: Music, title: "DJ e som profissional" },
    { icon: Camera, title: "Câmeras de segurança" },
    { icon: BedDouble, title: "Quartos separados (homens/mulheres)" },
]

export function FeaturesSection() {
    return (
        <section id="incluso" className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                O que está
                <span className="text-primary"> incluso</span>
            </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
                <div
                key={index}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 text-center"
                >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium">{feature.title}</span>
                </div>
            ))}
            </div>
        </div>
        </section>
    )
}

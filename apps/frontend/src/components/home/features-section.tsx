import { Waves, BedDouble, ShowerHead, Camera, UtensilsCrossed, Check, Sparkles } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface FeatureCategory {
  title: string
  icon: LucideIcon
  items: string[]
}

const featureCategories: FeatureCategory[] = [
  {
    title: "Piscina e lazer",
    icon: Waves,
    items: ["1 piscina", "Area de descanso", "Churrasqueira"],
  },
  {
    title: "Quartos",
    icon: BedDouble,
    items: ["2 quartos separados", "Masculino e feminino", "Camas disponiveis"],
  },
  {
    title: "Banheiros",
    icon: ShowerHead,
    items: ["3 banheiros", "2 chuveiros", "Toalhas inclusas"],
  },
  {
    title: "Seguranca",
    icon: Camera,
    items: ["Cameras 24 horas", "Portao eletronico", "Equipe no local"],
  },
  {
    title: "Alimentacao",
    icon: UtensilsCrossed,
    items: ["Churrasco incluso", "Bebidas a vontade", "Petiscos variados"],
  },
]

export function FeaturesSection() {
  return (
    <section id="incluso" className="py-20 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Incluso no ingresso</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">O que está incluso</h2>
        </div>

        <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCategories.map((category, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <category.icon className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{category.title}</h3>
                </div>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-accent flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

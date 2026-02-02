import { Waves, BedDouble, ShowerHead, UtensilsCrossed } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Feature {
  icon: LucideIcon
  text: string
}

const features: Feature[] = [
  { icon: Waves, text: "1 piscina" },
  { icon: BedDouble, text: "2 quartos separados entre homens e mulheres" },
  { icon: ShowerHead, text: "3 banheiros, 2 chuveiros" },
  { icon: UtensilsCrossed, text: "Comida e bebida a vontade (churrasco)" },
]

export function FeaturesSection() {
  return (
    <section id="incluso" className="py-20 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            O que esta
            <span className="text-primary"> incluso</span>
          </h2>
        </div>

        <div className="max-w-xl mx-auto">
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

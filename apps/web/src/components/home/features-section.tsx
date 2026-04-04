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
    items: ["1 piscina", "Área de descanso", "Churrasqueira"],
  },
  {
    title: "Quartos",
    icon: BedDouble,
    items: ["2 quartos separados", "Masculino e feminino", "Camas disponíveis"],
  },
  {
    title: "Banheiros",
    icon: ShowerHead,
    items: ["3 banheiros", "2 chuveiros", "Toalhas inclusas"],
  },
  {
    title: "Segurança",
    icon: Camera,
    items: ["Câmeras 24 horas", "Portão eletrônico", "Equipe no local"],
  },
  {
    title: "Alimentação",
    icon: UtensilsCrossed,
    items: ["Churrasco incluso", "Bebidas à vontade", "Petiscos variados"],
  },
]

export function FeaturesSection() {
  return (
    <section id="incluso" className="py-12 px-8 max-w-[1000px] mx-auto relative z-10">
      <div className="text-[11px] font-bold tracking-[0.1em] text-[#7a70b0] uppercase mb-1.5">
        <h3>Estrutura</h3>
      </div>
      <div className="text-2xl font-bold text-[var(--td)] mb-1.5">
        <h2>O que está incluso</h2>
      </div>
      <div className="text-[14px] text-[var(--tl)] mb-8">
        Tudo que você precisa pra curtir sem preocupação.
      </div>

      {/* badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-6 border border-[rgba(122,112,176,0.3)] bg-[rgba(122,112,176,0.08)] text-[#7a70b0] text-[11px] font-bold tracking-wide uppercase">
        <Sparkles size={11} />
        <span>Incluso no ingresso</span>
      </div>

      {/* grid card */}
      <div className="bg-[rgba(220,210,195,0.05)] backdrop-blur-[8px] border border-[rgba(160,136,120,0.25)] rounded-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureCategories.map((category, index) => (
            <div key={index}>
              <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[rgba(160,136,120,0.18)]">
                <category.icon size={15} className="text-[#7a9acc] shrink-0" />
                <h3 className="text-[13px] font-bold text-[var(--td)]">{category.title}</h3>
              </div>
              <ul className="flex flex-col gap-2">
                {category.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[12px] text-[var(--tl)]">
                    <Check size={12} className="text-[#9a8acc] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
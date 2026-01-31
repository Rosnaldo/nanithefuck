import { useState } from "react"
import { Users, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type GuestStatus = "confirmed" | "pending"

interface Guest {
  id: string
  name: string
  avatar: string
  status: GuestStatus
  instagram: string
}

const guests: Guest[] = [
  {
    id: "1",
    name: "Lucas Silva",
    avatar: "/assets/young-brazilian-man-smiling.jpg",
    status: "confirmed",
    instagram: "@lucas.silva",
  },
  {
    id: "2",
    name: "Mariana Costa",
    avatar: "/assets/young-brazilian-woman-curly-hair.jpg",
    status: "confirmed",
    instagram: "@mari.costa",
  },
  {
    id: "3",
    name: "Pedro Henrique",
    avatar: "/assets/brazilian-man-beard-casual.jpg",
    status: "confirmed",
    instagram: "@pedrohenrique_",
  },
  {
    id: "4",
    name: "Juliana Alves",
    avatar: "/assets/brazilian-woman-sunglasses-summer.jpg",
    status: "pending",
    instagram: "@ju.alves",
  },
  {
    id: "5",
    name: "Rafael Santos",
    avatar: "/assets/young-man-athletic-brazilian.jpg",
    status: "confirmed",
    instagram: "@rafaelsantos",
  },
  {
    id: "6",
    name: "Camila Oliveira",
    avatar: "/assets/brazilian-woman-long-hair-smiling.jpg",
    status: "confirmed",
    instagram: "@camila.oli",
  },
  {
    id: "7",
    name: "Bruno Ferreira",
    avatar: "/assets/brazilian-man-casual-style.jpg",
    status: "pending",
    instagram: "@brunoferreira",
  },
  {
    id: "8",
    name: "Amanda Ribeiro",
    avatar: "/assets/brazilian-woman-short-hair-modern.jpg",
    status: "confirmed",
    instagram: "@amandarib",
  },
  {
    id: "9",
    name: "Thiago Mendes",
    avatar: "/assets/brazilian-man-glasses-friendly.jpg",
    status: "confirmed",
    instagram: "@thiago.mendes",
  },
  {
    id: "10",
    name: "Fernanda Lima",
    avatar: "/assets/brazilian-woman-blonde-beach-style.jpg",
    status: "pending",
    instagram: "@fernanda.lima",
  },
  {
    id: "11",
    name: "Gabriel Souza",
    avatar: "/assets/brazilian-man-tattoo-arm.jpg",
    status: "confirmed",
    instagram: "@gabrielsouza",
  },
  {
    id: "12",
    name: "Beatriz Rocha",
    avatar: "/assets/brazilian-woman-fitness-style.jpg",
    status: "confirmed",
    instagram: "@bia.rocha",
  },
  {
    id: "13",
    name: "Diego Martins",
    avatar: "/assets/brazilian-man-surfer-look.jpg",
    status: "pending",
    instagram: "@diegomartins",
  },
  {
    id: "14",
    name: "Isabela Santos",
    avatar: "/assets/brazilian-woman-elegant-style.jpg",
    status: "confirmed",
    instagram: "@isabelasantos",
  },
  {
    id: "15",
    name: "Matheus Lima",
    avatar: "/assets/placeholder.svg?height=80&width=80",
    status: "confirmed",
    instagram: "@matheuslima",
  },
]

export function GuestListSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | GuestStatus>("all")

  const filteredGuests = guests
    .filter((guest) => {
      const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filter === "all" || guest.status === filter
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (a.status === "confirmed" && b.status === "pending") return -1
      if (a.status === "pending" && b.status === "confirmed") return 1
      return 0
    })

  return (
    <section id="convidados" className="py-20 relative z-10 bg-secondary/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <Users className="w-4 h-4" />
            <span>Lista de Convidados</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Quem vai estar lá</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Conheça quem já confirmou presença. Todos os participantes são amigos ou amigos de amigos.
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar convidado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                filter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter("confirmed")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                filter === "confirmed"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              Confirmados
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                filter === "pending"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              Pendentes
            </button>
          </div>
        </div>

        {/* Guest grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredGuests.map((guest) => (
            <div
              key={guest.id}
              className="group flex flex-col items-center p-4 rounded-xl bg-card/50 border border-border hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="relative mb-3">
                <img
                  src={guest.avatar || "/assets/placeholder.svg"}
                  alt={guest.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-border/50"
                />
              </div>

              {/* Name */}
              <p className="text-sm font-medium text-center line-clamp-1">{guest.name}</p>

              <span
                className={cn(
                  "text-xs font-medium mt-2 px-2 py-0.5 rounded-full",
                  guest.status === "confirmed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400",
                )}
              >
                {guest.status === "confirmed" ? "Confirmado" : "Pendente"}
              </span>

              <a
                href={`https://instagram.com/${guest.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground mt-1 hover:text-primary transition-colors"
              >
                {guest.instagram}
              </a>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredGuests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum convidado encontrado.</p>
          </div>
        )}
      </div>
    </section>
  )
}

import type React from "react"

import { useState } from "react"
import { Calendar, Check, Ticket, Flame, Clock, Zap, Bed, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface Lote {
    id: number
    name: string
    price: number
    originalPrice?: number
    spotsTotal: number
    spotsSold: number
    isActive: boolean
    icon: React.ReactNode
    description: string
}

const lotes: Lote[] = [
    {
        id: 1,
        name: "1º Lote",
        price: 100,
        spotsTotal: 50,
        spotsSold: 50,
        isActive: false,
        icon: <Zap className="w-5 h-5" />,
        description: "Esgotado",
    },
    {
        id: 2,
        name: "2º Lote",
        price: 150,
        originalPrice: 100,
        spotsTotal: 50,
        spotsSold: 38,
        isActive: true,
        icon: <Flame className="w-5 h-5" />,
        description: "Vendendo agora",
    },
    {
        id: 3,
        name: "3º Lote",
        price: 200,
        originalPrice: 150,
        spotsTotal: 50,
        spotsSold: 0,
        isActive: false,
        icon: <Clock className="w-5 h-5" />,
        description: "Em breve",
    },
]

const eventDays = [
    {
        id: "saturday",
        day: "Sábado",
        date: "18 de Janeiro",
        includes: ["Acesso das 12h às 22h", "Churrasco completo", "Open bar", "Piscina", "Música ao vivo"],
    },
    {
        id: "sunday",
        day: "Domingo",
        date: "19 de Janeiro",
        includes: ["Acesso das 11h às 20h", "Brunch especial", "Open bar", "Piscina", "DJ Set"],
    },
]

const extras = [
    {
        id: "bed",
        label: "Reservar cama para dormir",
        price: 50,
        icon: <Bed className="w-4 h-4" />,
        spotsLeft: 12,
    },
    {
        id: "parking",
        label: "Reservar vaga no estacionamento",
        price: 30,
        icon: <Car className="w-4 h-4" />,
        spotsLeft: 8,
    },
]

export function TicketSection() {
    const [selectedDays, setSelectedDays] = useState<string[]>([])
    const [selectedExtras, setSelectedExtras] = useState<string[]>([])

    const activeLote = lotes.find((l) => l.isActive)
    const spotsLeft = activeLote ? activeLote.spotsTotal - activeLote.spotsSold : 0

    const toggleDay = (dayId: string) => {
        setSelectedDays((prev) => (prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]))
    }

    const toggleExtra = (extraId: string) => {
        setSelectedExtras((prev) => (prev.includes(extraId) ? prev.filter((e) => e !== extraId) : [...prev, extraId]))
    }

    const calculateExtrasTotal = () => {
        return selectedExtras.reduce((total, extraId) => {
        const extra = extras.find((e) => e.id === extraId)
        return total + (extra?.price || 0)
        }, 0)
    }

    const calculateTotal = () => {
        if (!activeLote) return 0
        let total = 0
        if (selectedDays.length === 2) {
        total = activeLote.price * 2 - 50 // Desconto combo
        } else {
        total = activeLote.price * selectedDays.length
        }
        return total + calculateExtrasTotal()
    }

    const getDiscount = () => {
        if (selectedDays.length === 2) return 50
        return 0
    }

    return (
        <section id="tickets" className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm mb-4">
                <Ticket className="w-4 h-4" />
                <span>Ingressos</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Garanta sua vaga</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
                Os ingressos são vendidos por lotes. Quanto antes você comprar, mais barato!
            </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {lotes.map((lote) => {
                const progress = (lote.spotsSold / lote.spotsTotal) * 100
                return (
                <Card
                    key={lote.id}
                    className={cn(
                    "relative overflow-hidden transition-all",
                    lote.isActive
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border bg-card/30 opacity-60",
                    )}
                >
                    {lote.isActive && <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />}
                    <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                        <div
                            className={cn(
                            "p-2 rounded-lg",
                            lote.isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
                            )}
                        >
                            {lote.icon}
                        </div>
                        <div>
                            <CardTitle className="text-lg">{lote.name}</CardTitle>
                            <CardDescription>{lote.description}</CardDescription>
                        </div>
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-3xl font-bold">R$ {lote.price}</span>
                        {lote.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">R$ {lote.originalPrice}</span>
                        )}
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                            {lote.spotsSold}/{lote.spotsTotal} vendidos
                        </span>
                        <span>{lote.spotsTotal - lote.spotsSold} restantes</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                            className={cn(
                            "h-full rounded-full transition-all",
                            lote.isActive ? "bg-primary" : "bg-muted-foreground",
                            )}
                            style={{ width: `${progress}%` }}
                        />
                        </div>
                    </div>
                    </CardContent>
                </Card>
                )
            })}
            </div>

            {/* Day selection */}
            <div className="mb-8">
            <h3 className="text-xl font-semibold text-center mb-6">Selecione os dias</h3>
            <div className="grid md:grid-cols-2 gap-6">
                {eventDays.map((day) => {
                const isSelected = selectedDays.includes(day.id)
                return (
                    <Card
                    key={day.id}
                    className={cn(
                        "relative cursor-pointer transition-all duration-300 overflow-hidden",
                        isSelected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border hover:border-primary/50 bg-card/50",
                    )}
                    onClick={() => toggleDay(day.id)}
                    >
                    {/* Selection indicator */}
                    <div
                        className={cn(
                        "absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        isSelected ? "bg-primary border-primary" : "border-muted-foreground",
                        )}
                    >
                        {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                    </div>

                    <CardHeader>
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{day.date}</span>
                        </div>
                        <CardTitle className="text-2xl">{day.day}</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <ul className="space-y-2">
                        {day.includes.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-primary" />
                            <span>{item}</span>
                            </li>
                        ))}
                        </ul>
                    </CardContent>
                    </Card>
                )
                })}
            </div>
            </div>

            {/* Combo banner */}
            {selectedDays.length === 2 && (
            <div className="mb-8 p-4 rounded-lg bg-accent/10 border border-accent/30 text-center">
                <span className="text-accent font-medium">Combo Weekend! Você está economizando R$ {getDiscount()}</span>
            </div>
            )}

            <Card className="mb-8 bg-card/50 border-border">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg">Opcionais</CardTitle>
                <CardDescription>Adicione extras à sua experiência</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {extras.map((extra) => {
                const isSelected = selectedExtras.includes(extra.id)
                return (
                    <div
                    key={extra.id}
                    className={cn(
                        "flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all",
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-card/30",
                    )}
                    onClick={() => toggleExtra(extra.id)}
                    >
                    <div className="flex items-center gap-3">
                        <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleExtra(extra.id)}
                        className="pointer-events-none"
                        />
                        <div className="flex items-center gap-2">
                        <div
                            className={cn(
                            "p-2 rounded-lg",
                            isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
                            )}
                        >
                            {extra.icon}
                        </div>
                        <div>
                            <p className="font-medium">{extra.label}</p>
                            <p className="text-xs text-muted-foreground">{extra.spotsLeft} vagas disponíveis</p>
                        </div>
                        </div>
                    </div>
                    <span className="font-semibold text-primary">+ R$ {extra.price}</span>
                    </div>
                )
                })}
            </CardContent>
            </Card>

            {/* Summary */}
            <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground mb-1">
                    {selectedDays.length === 0
                        ? "Selecione pelo menos um dia"
                        : selectedDays.length === 2
                        ? "Combo Weekend selecionado"
                        : `${selectedDays.length} dia selecionado`}
                    </p>
                    <p className="text-3xl font-bold">{selectedDays.length > 0 ? `R$ ${calculateTotal()}` : "R$ 0"}</p>
                    {selectedExtras.length > 0 && (
                    <p className="text-xs text-muted-foreground">Inclui R$ {calculateExtrasTotal()} em opcionais</p>
                    )}
                    {getDiscount() > 0 && <p className="text-sm text-accent">Economia de R$ {getDiscount()}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                    {spotsLeft} vagas restantes no {activeLote?.name}
                    </p>
                </div>

                <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-lg px-12"
                    disabled={selectedDays.length === 0}
                >
                    Finalizar Compra
                </Button>
                </div>
            </CardContent>
            </Card>
        </div>
        </section>
    )
}

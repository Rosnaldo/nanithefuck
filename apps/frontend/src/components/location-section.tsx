import { MapPin, Navigation, Car, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LocationSection() {
    const locationAddress = "Estrada da Chácara, 1234 - Zona Rural, Campinas - SP"
    const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Chácara+Campinas+SP"

    return (
        <section id="localizacao" className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
                <MapPin className="w-4 h-4" />
                <span>Localização</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Chegar</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
                A chácara fica em uma região tranquila e de fácil acesso. Confira o mapa e as instruções abaixo.
            </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
            {/* Map embed */}
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card/50 aspect-video lg:aspect-auto lg:h-full min-h-[300px]">
                <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117663.95315846744!2d-47.13489485!3d-22.9098755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8c8f6a2552649%3A0x7475001c58043536!2sCampinas%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1704067200000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0, position: "absolute", inset: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização do evento"
                />
            </div>

            {/* Location details */}
            <div className="flex flex-col gap-6">
                {/* Address card */}
                <div className="p-6 rounded-xl bg-card/50 border border-border">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                    <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Endereço</h3>
                    <p className="text-muted-foreground mb-4">{locationAddress}</p>
                    <Button asChild variant="outline" size="sm">
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        <Navigation className="w-4 h-4 mr-2" />
                        Abrir no Google Maps
                        </a>
                    </Button>
                    </div>
                </div>
                </div>

                {/* Travel info */}
                <div className="p-6 rounded-xl bg-card/50 border border-border">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-accent/10">
                    <Car className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Como Chegar</h3>
                    <ul className="text-muted-foreground space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        De carro: Acesso pela Rodovia Dom Pedro I, saída KM 132
                        </li>
                        <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Estacionamento gratuito no local
                        </li>
                        <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Uber/99: Informe o endereço completo ao motorista
                        </li>
                    </ul>
                    </div>
                </div>
                </div>

                {/* Time info */}
                <div className="p-6 rounded-xl bg-card/50 border border-border">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-green-500/10">
                    <Clock className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Tempo Estimado</h3>
                    <ul className="text-muted-foreground space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        De São Paulo (Centro): ~1h30 de carro
                        </li>
                        <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        De Campinas (Centro): ~25 min de carro
                        </li>
                    </ul>
                    </div>
                </div>
                </div>
            </div>
            </div>

            {/* Note */}
            <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
            <p className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">Dica:</span> O endereço exato será enviado por WhatsApp para os
                participantes confirmados 24h antes do evento.
            </p>
            </div>
        </div>
        </section>
    )
}

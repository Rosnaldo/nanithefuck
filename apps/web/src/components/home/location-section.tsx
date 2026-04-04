export function LocationSection() {
    const locationAddress = "Estrada da Chácara, 1234 - Zona Rural, Campinas - SP"
    const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Chácara+Campinas+SP"

    return (
        <section id="localizacao" className="py-12 max-w-[1000px] mx-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-2xl font-bold text-[var(--td)] mb-1.5">
                <h2>Localização</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
            {/* Map embed */}
            <div className="relative overflow-hidden aspect-video lg:aspect-auto lg:h-full min-h-[300px] bg-[rgba(220,210,195,0.05)] backdrop-blur-sm border border-[rgba(160,136,120,0.25)] rounded-2xl rounded-[20px]">
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
                <div className="p-6 bg-[rgba(220,210,195,0.05)] backdrop-blur-sm border border-[rgba(160,136,120,0.25)] rounded-2xl rounded-[20px]">
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                    <div className="text-[var(--td)] mb-1">
                        <p className="font-['Caveat',cursive] text-[1.5rem] font-bold text-[var(--td)]">Endereço</p>
                    </div>
                    <p className="text-[12px] text-[var(--tl)] leading-relaxed mb-4">{locationAddress}</p>

                    <button className="bg-[#2a4a70] text-white px-4 py-2 rounded-full text-[12px] font-bold hover:bg-[#1e3858] transition-colors cursor-pointer">
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        Abrir no Google Maps
                        </a>
                    </button>
                    </div>
                </div>
                </div>

            </div>
            </div>
        </div>
        </section>
    )
}

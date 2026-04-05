export function LocationSection() {
    const locationAddress = "Estrada da Chácara, 1234 - Zona Rural, Campinas - SP"
    const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Chácara+Campinas+SP"

    return (
        <section id="localizacao" className="py-12 px-8 max-w-[1000px] mx-auto">
            <div className="text-[11px] font-bold tracking-[0.1em] text-[#7a70b0] uppercase mb-1.5">
                <h3>Localização</h3>
            </div>
            <div className="text-2xl font-bold text-[var(--td)] mb-1.5">
                <h2>Como chegar</h2>
            </div>
            <div className="text-[14px] text-[var(--tl)] mb-8">
                Fácil de encontrar, difícil de sair.
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
                {/* Map */}
                <div className="relative w-full min-h-[260px] lg:min-h-[360px] bg-[rgba(220,210,195,0.05)] backdrop-blur-[8px] border border-[rgba(160,136,120,0.25)] rounded-2xl overflow-hidden">
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

                {/* Details */}
                <div className="flex flex-col gap-4">
                    {/* Address */}
                    <div className="p-6 bg-[rgba(220,210,195,0.05)] backdrop-blur-[8px] border border-[rgba(160,136,120,0.25)] rounded-2xl">
                        <p className="font-['Caveat',cursive] text-[1.4rem] font-bold text-[var(--td)] mb-1">
                            Endereço
                        </p>
                        <p className="text-[12px] text-[var(--tl)] leading-relaxed mb-5">
                            {locationAddress}
                        </p>
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-[#2a4a70] text-white px-4 py-2 rounded-full text-[12px] font-bold hover:bg-[#1e3858] transition-colors"
                        >
                            Abrir no Google Maps
                        </a>
                    </div>

                    {/* Tips */}
                    <div className="p-6 bg-[rgba(220,210,195,0.05)] backdrop-blur-[8px] border border-[rgba(160,136,120,0.25)] rounded-2xl">
                        <p className="font-['Caveat',cursive] text-[1.4rem] font-bold text-[var(--td)] mb-3">
                            Dicas de acesso
                        </p>
                        {[
                            { label: "Estacionamento", desc: "Gratuito no local" },
                            { label: "Transporte", desc: "Combinar carona no grupo" },
                            { label: "Referência", desc: "Portão verde na entrada" },
                        ].map(({ label, desc }) => (
                            <div key={label} className="flex items-start gap-3 mb-3 last:mb-0">
                                <span className="w-[5px] h-[5px] rounded-full bg-[#7a9acc] shrink-0 mt-[6px]" />
                                <div>
                                    <span className="text-[12px] font-bold text-[var(--td)]">{label} </span>
                                    <span className="text-[12px] text-[var(--tl)]">— {desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

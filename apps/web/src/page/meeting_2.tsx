import './style.css';
import { ParticipantListSection } from '@/components/home/participant-list-section';
import { BottomBgSvg } from '@/components/bottom-bg-svg';
import { GallerySection } from '@/components/home/gallery-section';
import { LocationSection } from '@/components/home/location-section';
import { ScheduleSection } from '@/components/home/schedule-section';
import { FeaturesSection } from '@/components/home/features-section';

export default function HomePage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#f0ede6]">

            <section id="picnique" className="relative w-full h-[50vh]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <img
                        src="https://nanithefuck-34.s3.sa-east-1.amazonaws.com/testes/picnique_transparent.png"
                        alt=""
                        style={{ height: "320px", width: "auto", display: "block" }}
                    />
                </div>
            </section>

            <FeaturesSection />
            <GallerySection />
            <ScheduleSection />
            <BottomBgSvg />
            <ParticipantListSection />
            
            <hr className="border-none border-t border-[rgba(160,136,120,0.15)] mx-8" />

            <section id="tickets" className="py-12 px-8 max-w-[1000px] mx-auto">
                <div className="text-[11px] font-bold tracking-[0.1em] text-[#7a70b0] uppercase mb-1.5">
                    <h3>Ingressos</h3>
                </div>
                <div className="text-2xl font-bold text-[var(--td)] mb-1.5">
                    <h2>Garanta sua vaga</h2>
                </div>
                <div className="text-[14px] text-[var(--tl)] mb-10">
                    Escolha o tipo de ingresso que combina com você.
                </div>

                {/* Counter Bar */}
                <div className="bg-[rgba(220,210,195,0.05)] backdrop-blur-sm border border-[rgba(160,136,120,0.25)] rounded-2xl rounded-2xl px-[1.4rem] py-[1.1rem] flex items-center justify-between flex-wrap gap-4 mb-[1.4rem]">
                    <div>
                    <div className="text-[13px] text-[var(--tm)]">Vagas preenchidas</div>
                    <div className="text-[1.3rem] font-bold text-[#2a4a70]">19 / 30</div>
                    </div>
                    <div className="flex-1 min-w-[140px] h-1.5 bg-[rgba(180,160,220,0.2)] rounded-full overflow-hidden">
                    <div className="h-full bg-[#7a9acc] rounded-full w-[63%]" />
                    </div>
                    <div className="text-[12px] text-[var(--tl)]">11 vagas restantes</div>
                </div>

                {/* Ticket Grid */}
                <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>

                {/* Básico */}
                <div className="bg-[rgba(220,210,195,0.05)] backdrop-blur-sm border border-[rgba(160,136,120,0.25)] rounded-2xl rounded-[20px] overflow-hidden">
                    <div className="p-[1.3rem] border-b border-dashed border-[rgba(160,136,120,0.25)]">
                        <span className="inline-block text-[10px] font-bold tracking-[0.06em] uppercase px-2.5 py-[3px] rounded-xl mb-[0.7rem] bg-[#e0eaf8] text-[#1e3858]">Básico</span>
                        <div className="text-[1.05rem] font-bold text-[var(--td)] mb-1"><h3>Visitante</h3></div>
                        <div className="text-[12px] text-[var(--tl)] leading-relaxed">Só sábado, sem pernoite. Perfeito pra dar uma chegada!</div>
                        {["Acesso sábado", "Almoço & churrasco", "Todas as atividades"].map(f => (
                        <div key={f} className="flex items-center gap-1.5 text-[11px] text-[var(--tm)] mt-[0.35rem]">
                            <span className="w-[5px] h-[5px] rounded-full bg-[#7a9acc] shrink-0" />
                            {f}
                        </div>
                        ))}
                    </div>
                    <div className="px-[1.3rem] py-4 flex items-center justify-between">
                        <div className="text-[1.4rem] font-bold text-[#2a4a70]"><sup className="text-[0.8rem] font-normal">R$</sup>45</div>
                        <button className="bg-[#2a4a70] text-white px-4 py-2 rounded-full text-[12px] font-bold hover:bg-[#1e3858] transition-colors cursor-pointer">Comprar</button>
                    </div>
                    </div>

                    {/* Popular */}
                    <div className="bg-[rgba(220,210,195,0.05)] backdrop-blur-sm border border-[rgba(160,136,120,0.25)] rounded-2xl rounded-[20px] overflow-hidden">
                    <div className="p-[1.3rem] border-b border-dashed border-[rgba(160,136,120,0.25)]">
                        <span className="inline-block text-[10px] font-bold tracking-[0.06em] uppercase px-2.5 py-[3px] rounded-xl mb-[0.7rem] bg-[#ece8f5] text-[#5a3a90]">Popular</span>
                        <div className="text-[1.05rem] font-bold text-[var(--td)] mb-1"><h3>Full Weekend</h3></div>
                        <div className="text-[12px] text-[var(--tl)] leading-relaxed">Sábado e domingo com direito a camping na chácara.</div>
                        {["Acesso 2 dias", "Café, almoço & churrasco", "Área de camping", "Kit boas-vindas"].map(f => (
                        <div key={f} className="flex items-center gap-1.5 text-[11px] text-[var(--tm)] mt-[0.35rem]">
                            <span className="w-[5px] h-[5px] rounded-full bg-[#7a9acc] shrink-0" />
                            {f}
                        </div>
                        ))}
                    </div>
                    <div className="px-[1.3rem] py-4 flex items-center justify-between">
                        <div className="text-[1.4rem] font-bold text-[#2a4a70]"><sup className="text-[0.8rem] font-normal">R$</sup>90</div>
                        <button className="bg-[#2a4a70] text-white px-4 py-2 rounded-full text-[12px] font-bold hover:bg-[#1e3858] transition-colors cursor-pointer">Comprar</button>
                    </div>
                    </div>

                    {/* VIP */}
                    <div className="bg-[rgba(220,210,195,0.05)] backdrop-blur-sm border border-[rgba(160,136,120,0.25)] rounded-2xl rounded-[20px] overflow-hidden">
                    <div className="p-[1.3rem] border-b border-dashed border-[rgba(160,136,120,0.25)]">
                        <span className="inline-block text-[10px] font-bold tracking-[0.06em] uppercase px-2.5 py-[3px] rounded-xl mb-[0.7rem] bg-[#e8f0e0] text-[#3a5232]">VIP</span>
                        <div className="text-[1.05rem] font-bold text-[var(--td)] mb-1"><h3>Quarto na Casa</h3></div>
                        <div className="text-[12px] text-[var(--tl)] leading-relaxed">Todo conforto: quarto compartilhado na casa da chácara.</div>
                        {["Acesso 2 dias", "Quarto compartilhado", "Café da manhã especial", "Kit premium"].map(f => (
                        <div key={f} className="flex items-center gap-1.5 text-[11px] text-[var(--tm)] mt-[0.35rem]">
                            <span className="w-[5px] h-[5px] rounded-full bg-[#7a9acc] shrink-0" />
                            {f}
                        </div>
                        ))}
                    </div>
                    <div className="px-[1.3rem] py-4 flex items-center justify-between">
                        <div className="text-[1.4rem] font-bold text-[#2a4a70]"><sup className="text-[0.8rem] font-normal">R$</sup>140</div>
                        <button className="bg-[#2a4a70] text-white px-4 py-2 rounded-full text-[12px] font-bold hover:bg-[#1e3858] transition-colors cursor-pointer">Comprar</button>
                    </div>
                </div>

                </div>
            </section>

            <LocationSection />

            <section id="bottom" className="py-12 px-8 max-w-[900px] mx-auto">
                
            </section>
        </main>
    )
}

import { Users } from "lucide-react"

const saturdaySchedule = [
    { time: "7:00", title: "Abertura dos portões", description: "Chegada e boas-vindas", icon: Users },
    { time: "23:00", title: "Encerramento", description: "Despedida e fotos finais", icon: Users },
]

const sundaySchedule = [
    { time: "7:00", title: "Abertura dos portões", description: "Chegada e boas-vindas", icon: Users },
    { time: "17:00", title: "Encerramento", description: "Despedida do fim de semana", icon: Users },
]

function DayCard({
    label,
    dayName,
    date,
    schedule,
    accent,
}: {
    label: string
    dayName: string
    date: string
    schedule: typeof saturdaySchedule
    accent: string
}) {
    return (
        <div className="bg-[rgba(220,210,195,0.05)] backdrop-blur-[8px] border border-[rgba(160,136,120,0.25)] rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[rgba(160,136,120,0.15)]">
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-[11px] font-bold tracking-widest"
                    style={{ background: accent + "22", color: accent }}
                >
                    {label}
                </div>
                <div>
                    <h3 className="text-[1rem] font-bold text-[var(--td)]">{dayName}</h3>
                    <p className="text-[12px] text-[var(--tl)]">{date}</p>
                </div>
            </div>

            {/* Timeline */}
            <div className="flex flex-col gap-0">
                {schedule.map((item, index) => (
                    <div key={index} className="flex gap-4">
                        {/* Line + dot */}
                        <div className="flex flex-col items-center">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border"
                                style={{
                                    background: accent + "18",
                                    borderColor: accent + "44",
                                }}
                            >
                                <item.icon size={13} style={{ color: accent }} />
                            </div>
                            {index < schedule.length - 1 && (
                                <div className="w-px flex-1 my-1 bg-[rgba(160,136,120,0.2)]" />
                            )}
                        </div>

                        {/* Content */}
                        <div className={`pb-5 ${index === schedule.length - 1 ? "pb-0" : ""}`}>
                            <span
                                className="text-[11px] font-bold tracking-wide"
                                style={{ color: accent }}
                            >
                                {item.time}
                            </span>
                            <h4 className="text-[13px] font-bold text-[var(--td)] leading-tight">{item.title}</h4>
                            <p className="text-[12px] text-[var(--tl)]">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function ScheduleSection() {
    return (
        <section id="cronograma" className="py-12 px-8 max-w-[1000px] mx-auto">
            <div className="text-[11px] font-bold tracking-[0.1em] text-[#7a70b0] uppercase mb-1.5">
                <h3>Cronograma</h3>
            </div>
            <div className="text-2xl font-bold text-[var(--td)] mb-1.5">
                <h2>Programação do Evento</h2>
            </div>
            <div className="text-[14px] text-[var(--tl)] mb-8">
                Veja o que vai rolar em cada dia.
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <DayCard
                    label="SAB"
                    dayName="Sábado"
                    date="18 de Janeiro"
                    schedule={saturdaySchedule}
                    accent="#7a9acc"
                />
                <DayCard
                    label="DOM"
                    dayName="Domingo"
                    date="19 de Janeiro"
                    schedule={sundaySchedule}
                    accent="#9a8acc"
                />
            </div>
        </section>
    )
}
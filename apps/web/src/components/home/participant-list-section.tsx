import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { Users, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ParticipantStatus, type IMeeting, type IParticipant } from "@repo/shared-types"
import { ApiError } from "@/error/api"
import { apiBack } from "@/api/backend"
import { toast } from "sonner"

export function ParticipantListSection() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filter, setFilter] = useState<"all" | keyof typeof ParticipantStatus>("all")

    async function fetchParticipants() {
        try {
            const res = await apiBack.get(
                "/api/meetings/by-name", {
                    params: { name: 'ChacaraMeets' }
                }
            )
            
            if (res.data.isError) {
                throw new ApiError(res.data.message || "/api/meetings/by-name request failed");
            }

            const meeting = res.data as IMeeting;
            const res2 = await apiBack.get(
                "/api/participants/pagination", {
                    params: { meetingId: meeting?._id }
                }
            )

            if (res2.data.isError) {
                throw new ApiError(res.data.message || "/api/participants/by-meeting request failed");
            }

            return res2.data.data as IParticipant[];
        } catch (error) {
            if (error instanceof ApiError) {
                toast.error(error.message)
            }
            console.log('fetchParticipants fetchUser: error', error);
            throw error;
        }
    }

    const { data: participants = [], isLoading: isLoading, isError, error } = useQuery<IParticipant[], ApiError>({
        queryKey: ['participants'],
        queryFn: fetchParticipants
    });

    function Loading() {
        return <div>Loading...</div>;
    }

    function ErrorState({ error }: { error: Error }) {
        return <div style={{ color: "red" }}>{error.message}</div>;
    }

    if (isLoading) return <Loading />;
    if (isError) return <ErrorState error={error as Error} />;

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
                onClick={() => setFilter(ParticipantStatus.confirmed)}
                className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    filter === ParticipantStatus.confirmed
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
                >
                Confirmados
                </button>
                <button
                onClick={() => setFilter(ParticipantStatus.pending)}
                className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    filter === ParticipantStatus.pending
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
            {participants.map((participant) => (
                <div
                key={participant._id}
                className="group flex flex-col items-center p-4 rounded-xl bg-card/50 border border-border hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
                >
                <div className="relative mb-3">
                    <img
                    src={participant?.user?.avatar || "/assets/placeholder.svg"}
                    alt={participant?.user?.firstName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-border/50"
                    />
                </div>

                {/* Name */}
                <p className="text-sm font-medium text-center line-clamp-1">{participant.user?.firstName}</p>

                <span
                    className={cn(
                    "text-xs font-medium mt-2 px-2 py-0.5 rounded-full",
                    participant.status === "confirmed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400",
                    )}
                >
                    {participant.status === ParticipantStatus.confirmed ? "Confirmado" : "Pendente"}
                </span>

                </div>
            ))}
            </div>

            {/* Empty state */}
            {participants.length === 0 && (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum convidado encontrado.</p>
            </div>
            )}
        </div>
        </section>
    )
}

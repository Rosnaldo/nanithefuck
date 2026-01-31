import { CheckCircle2, Clock, Users, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserUtils, type IParticipant } from '@repo/shared-types';

export default function GuestList() {
    const userUtils = new UserUtils();
    const [filter, setFilter] = useState('all');

    const { data: participants = [], isLoading } = useQuery<IParticipant[]>({
        queryKey: ['participants'],
        queryFn: () => fetch('/api/todos').then(r => r.json()),
        initialData: [],
    });

    const confirmedCount = participants.filter(g => g.status === 'confirmed').length;
    const invitedCount = participants.filter(g => g.status === 'pending').length;

    const filteredParticipants = filter === 'all' 
        ? participants 
        : participants.filter(g => g.status === filter);

    return (
        <section className="py-24 px-6 bg-zinc-900">
        <div className="max-w-6xl mx-auto">
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
            >
            <span className="text-orange-400 font-medium mb-4 block">Quem vai?</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Lista de Convidados
            </h2>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mb-8">
                <div className="flex items-center gap-2 px-5 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-semibold">{confirmedCount}</span>
                <span className="text-zinc-400">confirmados</span>
                </div>
                <div className="flex items-center gap-2 px-5 py-3 bg-orange-500/20 border border-orange-500/30 rounded-2xl">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="text-white font-semibold">{invitedCount}</span>
                <span className="text-zinc-400">pendentes</span>
                </div>
            </div>

            {/* Filters */}
            <Tabs value={filter} onValueChange={setFilter} className="mx-auto w-fit">
                <TabsList className="bg-zinc-800 border border-zinc-700">
                <TabsTrigger value="all" className="data-[state=active]:bg-zinc-700">
                    Todos ({participants.length})
                </TabsTrigger>
                <TabsTrigger value="confirmed" className="data-[state=active]:bg-emerald-600">
                    Confirmados ({confirmedCount})
                </TabsTrigger>
                <TabsTrigger value="invited" className="data-[state=active]:bg-orange-600">
                    Pendentes ({invitedCount})
                </TabsTrigger>
                </TabsList>
            </Tabs>
            </motion.div>

            {isLoading ? (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
            </div>
            ) : filteredParticipants.length === 0 ? (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
            >
                <Users className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">Nenhum convidado encontrado</p>
            </motion.div>
            ) : (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
            >
                <AnimatePresence mode="popLayout">
                {filteredParticipants.map((participant, index) => (
                    <motion.div
                    key={participant._id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="group relative"
                    >
                    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6 hover:border-zinc-600 transition-all duration-300 text-center">
                        {/* Avatar with Status Ring */}
                        <div className="relative inline-block mb-4">
                        <div className={`absolute -inset-1 rounded-full ${
                            participant.status === 'confirmed' 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                            : 'bg-gradient-to-r from-orange-500 to-amber-500'
                        } opacity-75 blur-sm`} />
                        <Avatar className="relative w-20 h-20 border-2 border-zinc-900">
                            <AvatarImage 
                            src={participant?.user?.avatar} 
                            alt={userUtils.getInitials(participant?.user)}
                            className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-zinc-700 to-zinc-800 text-white font-semibold text-lg">
                                {userUtils.getInitials(participant?.user)}
                            </AvatarFallback>
                        </Avatar>
                        
                        {/* Status Badge */}
                        <div className="absolute -bottom-1 -right-1">
                            {participant.status === 'confirmed' ? (
                            <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-zinc-900">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                            ) : (
                            <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center border-2 border-zinc-900">
                                <Clock className="w-4 h-4 text-white" />
                            </div>
                            )}
                        </div>
                        </div>

                        {/* Name */}
                        <h3 className="text-white font-semibold mb-2 line-clamp-1">
                            {userUtils.getFullname(participant?.user)}
                        </h3>

                        {/* Status Badge */}
                        <Badge
                        variant="secondary"
                        className={`text-xs ${
                            participant.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                        } border`}
                        >
                        {participant.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                        </Badge>
                    </div>
                    </motion.div>
                ))}
                </AnimatePresence>
            </motion.div>
            )}
        </div>
        </section>
    );
}
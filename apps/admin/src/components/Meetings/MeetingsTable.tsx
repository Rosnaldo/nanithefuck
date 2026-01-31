import { motion } from 'framer-motion';
import { format, isPast, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pencil, Trash2, MoreHorizontal, Calendar, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { UserUtils, type IMeeting, type IUser } from '@repo/shared-types';
import { Avatar } from '../Avatar';

interface Props {
    onDelete: (meeting: IMeeting) => void;
    onEdit: (meeting: IMeeting) => void;
    users: IUser[];
    meetings: IMeeting[];
    isLoading: boolean;
}

export default function MeetingsTable({ meetings, users, isLoading, onEdit, onDelete }: Props) {
    const userUtils = new UserUtils();
    const getUserById = (userId: string = '') => {
        return users?.find(u => u._id === userId);
    };

    const getStatusBadge = (start: Date, finish: Date) => {
        const now = new Date();

        if (now >= start && now <= finish) {
        return (
            <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
            Em andamento
            </Badge>
        );
        } else if (isPast(finish)) {
        return (
            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
            Finalizada
            </Badge>
        );
        } else if (isToday(start)) {
        return (
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
            Hoje
            </Badge>
        );
        } else {
        return (
            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100">
            Agendada
            </Badge>
        );
        }
    };

    if (isLoading) {
        return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
                </div>
            ))}
            </div>
        </div>
        );
    }

    if (!meetings || meetings.length === 0) {
        return (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhuma reunião encontrada</h3>
            <p className="text-slate-500">Comece criando sua primeira reunião</p>
        </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <Table>
            <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-semibold text-slate-700">Reunião</TableHead>
                <TableHead className="font-semibold text-slate-700 hidden md:table-cell">Horário</TableHead>
                <TableHead className="font-semibold text-slate-700">Participantes</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Ações</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {meetings.map((meeting, index) => {
                const participants = (meeting.participants.map(p => p.user) || [])
                .map(user => getUserById(user?._id))
                .filter(Boolean);

                return (
                <motion.tr
                    key={meeting._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                >
                    <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                        <p className="font-medium text-slate-900">{meeting.name}</p>
                        {meeting.description && (
                            <p className="text-xs text-slate-500 line-clamp-1">{meeting.description}</p>
                        )}
                        </div>
                    </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="w-3 h-3" />
                        {format(new Date(meeting.start), "dd/MM 'às' HH:mm", { locale: ptBR })}
                        </div>
                        <div className="text-xs text-slate-500">
                        até {format(new Date(meeting.finish), "HH:mm", { locale: ptBR })}
                        </div>
                    </div>
                    </TableCell>
                    <TableCell>
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                        {participants.slice(0, 3).map((participant, index) => (
                            <Avatar key={index} user={participant} />
                        ))}
                        </div>
                        {participants.length > 3 && (
                        <span className="text-xs text-slate-500">+{participants.length - 3}</span>
                        )}
                        {participants.length === 0 && (
                        <span className="text-xs text-slate-400">Sem participantes</span>
                        )}
                    </div>
                    </TableCell>
                    <TableCell>
                        {getStatusBadge(meeting?.start, meeting?.finish)}
                    </TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                        >
                            <MoreHorizontal className="w-4 h-4 text-slate-500" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onEdit(meeting)} className="cursor-pointer">
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(meeting)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </motion.tr>
                );
            })}
            </TableBody>
        </Table>
        </div>
    );
}

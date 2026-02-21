import { useState } from 'react';
import { isPast, isToday } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, Search, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import MeetingFormModal from '@/components/Meetings/MeetingFormModal';
import MeetingsTable from '@/components/Meetings/MeetingsTable';
import DeleteMeetingModal from '@/components/Meetings/DeleteMeetingModal';
import type { IMeeting } from '@repo/shared-types';
import { apiBack } from "@/api/backend"

export default function Meetings() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState<IMeeting | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    
    const queryClient = useQueryClient();

    const { data: meetings = [], isLoading: loadingMeetings } = useQuery<IMeeting[]>({
        queryKey: ['meetings'],
        queryFn: () => fetch('/meetings/list').then(r => r.json()),
    });

    const { data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: () => fetch('/api/users/list').then(r => r.json()),
    });

    const createMutation = useMutation({
        mutationFn: async (body: Partial<IMeeting>) => {
            await apiBack.post('/meetings/create', body);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meetings'] });
            setIsFormOpen(false);
            setSelectedMeeting(undefined);
            toast.success('Reunião criada com sucesso!');
        },
        onError: (error) => {
            toast.error('Erro ao criar reunião: ' + error.message);
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ _id, body }: { _id: string; body: Partial<IMeeting> }) => {
            await apiBack.put('/meetings/edit', body, {
                params: { _id }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meetings'] });
            setIsFormOpen(false);
            setSelectedMeeting(undefined);
            toast.success('Reunião atualizada com sucesso!');
        },
        onError: (error) => {
            toast.error('Erro ao atualizar reunião: ' + error.message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (_id?: string) => {
            await apiBack.delete(`/meetings/delete`, {
                params: { _id }                
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meetings'] });
            setIsDeleteOpen(false);
            setSelectedMeeting(undefined);
            toast.success('Reunião excluída com sucesso!');
        },
        onError: (error) => {
            toast.error('Erro ao excluir reunião: ' + error.message);
        }
    });

    const handleSubmit = (formData: Partial<IMeeting>) => {
        if (selectedMeeting) {
            updateMutation.mutate({
                _id: selectedMeeting._id,
                body: formData
            });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleEdit = (meeting: IMeeting) => {
        setSelectedMeeting(meeting);
        setIsFormOpen(true);
    };

    const handleDelete = (meeting: IMeeting) => {
        setSelectedMeeting(meeting);
        setIsDeleteOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedMeeting(undefined);
    };

    const getMeetingStatus = (meeting: IMeeting) => {
        const now = new Date();
        const start = new Date(meeting.start);
        const end = new Date(meeting.finish);

        if (now >= start && now <= end) return 'ongoing';
        if (isPast(end)) return 'past';
        if (isToday(start)) return 'today';
        return 'upcoming';
    };

    const filteredMeetings = meetings.filter(meeting => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = meeting?.name?.toLowerCase().includes(query);
        const status = getMeetingStatus(meeting);
        const matchesStatus = statusFilter === 'all' || status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: meetings.length,
        upcoming: meetings.filter(m => getMeetingStatus(m) === 'upcoming' || getMeetingStatus(m) === 'today').length,
        ongoing: meetings.filter(m => getMeetingStatus(m) === 'ongoing').length,
        past: meetings.filter(m => getMeetingStatus(m) === 'past').length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
            >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Reuniões
                </h1>
                <p className="text-slate-500 mt-1">
                    Gerencie e acompanhe suas reuniões
                </p>
                </div>
                <Button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-5 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-200 cursor-pointer"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nova Reunião
                </Button>
            </div>
            </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                    <p className="text-sm text-slate-500">Total</p>
                </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.upcoming}</p>
                    <p className="text-sm text-slate-500">Agendadas</p>
                </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.ongoing}</p>
                    <p className="text-sm text-slate-500">Em andamento</p>
                </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.past}</p>
                    <p className="text-sm text-slate-500">Finalizadas</p>
                </div>
                </div>
            </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 mb-6"
            >
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                placeholder="Buscar reunião..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-11 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>
            <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 h-11 rounded-xl border-slate-200">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-100">
                    <SelectItem value="all">Todos Status</SelectItem>
                    <SelectItem value="ongoing">Em andamento</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="upcoming">Agendadas</SelectItem>
                    <SelectItem value="past">Finalizadas</SelectItem>
                </SelectContent>
                </Select>
            </div>
            </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            >
            <MeetingsTable
                meetings={filteredMeetings}
                users={users}
                isLoading={loadingMeetings}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            </motion.div>

            <MeetingFormModal
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleSubmit}
                meeting={selectedMeeting}
                users={users}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />

            <DeleteMeetingModal
                isOpen={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedMeeting(undefined);
                }}
                onConfirm={() => deleteMutation.mutate(selectedMeeting?._id)}
                meeting={selectedMeeting}
                isLoading={deleteMutation.isPending}
            />
        </div>
        </div>
    );
}

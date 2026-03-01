import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import MeetingFormModal from '@/components/Meetings/MeetingFormModal';
import MeetingsTable from '@/components/Meetings/MeetingsTable';
import DeleteMeetingModal from '@/components/Meetings/DeleteMeetingModal';
import type { IMeeting } from '@repo/shared-types';
import { apiBack } from "@/api/backend"
import { ApiError } from '@/error/api';

export default function Meetings() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState<IMeeting | undefined>(undefined);
    
    const queryClient = useQueryClient();
    
    const fetchMeetingsList = async () => {
        const res = await apiBack.get(
            "/meetings/list"
        )
        
        if (res.data.isError) {
            throw new ApiError(res.data.message);
        }
        return res.data.data;
    };

    const { data: meetings = [], isLoading: loadingMeetings } = useQuery<IMeeting[]>({
        queryKey: ['meetings/list'],
        queryFn: () => fetchMeetingsList(),
    });
    
    const fetchUsersList = async () => {
        const res = await apiBack.get(
            "/users/list"
        )
        
        if (res.data.isError) {
            throw new ApiError(res.data.message);
        }
        return res.data;
    };

    const { data: users = [] } = useQuery({
        queryKey: ['users/list'],
        queryFn: () => fetchUsersList(),
    });

    const createMutation = useMutation({
        mutationFn: async (body: Partial<IMeeting>) => {
            await apiBack.post('/meetings/create', body);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meetings/list'] });
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
            queryClient.invalidateQueries({ queryKey: ['meetings/list'] });
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
            queryClient.invalidateQueries({ queryKey: ['meetings/list'] });
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
            transition={{ delay: 0.3 }}
            >
            <MeetingsTable
                meetings={meetings}
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

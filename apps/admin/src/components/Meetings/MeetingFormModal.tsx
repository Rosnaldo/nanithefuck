import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users as UsersIcon, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserUtils, type IMeeting, type IUser } from '@repo/shared-types';
import { Avatar } from '../Avatar';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (form: Partial<IMeeting>) => void;
    users: IUser[];
    meeting?: IMeeting;
    isLoading: boolean;
}

export default function MeetingFormModal({ isOpen, onClose, onSubmit, meeting, users, isLoading }: Props) {
    const userUtils = new UserUtils();

    const [formData, setFormData] = useState<Partial<IMeeting>>({
        name: '',
        participants: [],
    });

    const isEditing = !!meeting;

    useEffect(() => {
        if (meeting) {
            setFormData({
                name: meeting.name || '',
                participants: meeting.participants || [],
            });
        } else {
            setFormData({
                name: '',
                participants: [],
            });
        }
    }, [meeting, isOpen]);

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({
            ...formData,
        });
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleParticipant = (_userId: string) => {
        // setFormData(prev => ({
        //     ...prev,
        //     participants: prev?.participants?.includes(userId)
        //         ? prev.participants.filter(_id => _id !== userId)
        //         : [...prev.participants, userId]
        // }));
    };

    return (
        <AnimatePresence>
        {isOpen && (
            <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="px-8 pt-8 pb-6 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                        {isEditing ? 'Editar Reunião' : 'Nova Reunião'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                        {isEditing ? 'Atualize as informações da reunião' : 'Preencha os dados para criar'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                        Nome da Reunião
                        </Label>
                        <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="Reunião de planejamento"
                            className="pl-11 h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <UsersIcon className="w-4 h-4" />
                            Participantes ({formData?.participants?.map((p) => p._id).length} selecionados)
                        </Label>
                        <div className="border border-slate-200 rounded-xl p-4 max-h-64 overflow-y-auto space-y-2">
                        {users && users.length > 0 ? (
                            users.map((user) => (
                            <div
                                key={user._id}
                                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                onClick={() => toggleParticipant(user._id)}
                            >
                                <Checkbox
                                    checked={formData.participants?.map((p) => p._id).includes(user._id)}
                                    onCheckedChange={() => toggleParticipant(user._id)}
                                />
                                <Avatar user={user} />
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900 text-sm">{userUtils.getFullname(user) || 'Sem nome'}</p>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                            </div>
                            ))
                        ) : (
                            <p className="text-center text-slate-400 py-4">Nenhum usuário disponível</p>
                        )}
                        </div>
                    </div>
                    </div>

                    <div className="px-8 pb-8 pt-4 border-t border-slate-100 flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 h-12 rounded-xl border-slate-200 hover:bg-slate-50 cursor-pointer"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                    >
                        {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isEditing ? (
                        'Salvar Alterações'
                        ) : (
                        'Criar Reunião'
                        )}
                    </Button>
                    </div>
                </form>
                </div>
            </motion.div>
            </>
        )}
        </AnimatePresence>
    );
}
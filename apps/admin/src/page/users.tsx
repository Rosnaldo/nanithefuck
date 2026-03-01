import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { Plus, Users, Search, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserFormModal from '@/components/Users/UserFormModal';
import UsersTable from '@/components/Users/UsersTable';
import DeleteConfirmModal from '@/components/Users/UserDeleteModal';
import type { IUser } from '@repo/shared-types';
import { apiBack } from '@/api/backend';
import { ApiError } from '@/error/api';
import { useAuth } from '@/providers/auth-provider';

export default function AdminUsers() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
    const { loggedUser } = useAuth();
    
    const queryClient = useQueryClient();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const res = await apiBack.get(
                "/users/by-email", {
                    params: { email: loggedUser.email }
                }
            )
            
            if (res.data.isError) {
                throw new ApiError(res.data.message);
            }
            const user = res.data;
            setCurrentUser(user);
        };
        fetchCurrentUser();
    }, []);

    const fetchUsersList = async () => {
        const res = await apiBack.get(
            "/users/list"
        )
        
        if (res.data.isError) {
            throw new ApiError(res.data.message);
        }
        return res.data.data;
    };

    const { data: users = [], isLoading } = useQuery<IUser[]>({
        queryKey: ['users/list'],
        queryFn: () => fetchUsersList()
    });

    const inviteMutation = useMutation({
        mutationFn: async (body: Partial<IUser>) => {
            await apiBack.post(
                "/users/create",
                body,
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users/list'] });
            setIsFormOpen(false);
            setSelectedUser(undefined);
            toast.success('Convite enviado com sucesso!');
        },
        onError: (error) => {
            toast.error('Erro ao convidar usuário: ' + error.message);
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ _id, body }: { _id: string; body: Partial<IUser> }) => {
            await apiBack.put(
                "/users/edit", body, {
                    params: { _id }
                }
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users/list'] });
            setIsFormOpen(false);
            setSelectedUser(undefined);
            toast.success('Usuário atualizado com sucesso!');
        },
        onError: (error) => {
            toast.error('Erro ao atualizar usuário: ' + error.message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (_id?: string) => {
            await apiBack.put(
                "/users/delete", {}, {
                    params: { _id }
                }
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users/list'] });
            setIsDeleteOpen(false);
            setSelectedUser(undefined);
            toast.success('Usuário excluído com sucesso!');
        },
        onError: (error) => {
            toast.error('Erro ao excluir usuário: ' + error.message);
        }
    });

    const handleSubmit = (formData: Partial<IUser>) => {
        if (selectedUser) {
            updateMutation.mutate({
                _id: selectedUser._id,
                body: { firstName: formData.firstName, lastName: formData.lastName, email: formData.email, role: formData.role }
            });
        } else {
            inviteMutation.mutate(formData);
        }
    };

    const handleEdit = (user: IUser) => {
        setSelectedUser(user);
        setIsFormOpen(true);
    };

    const handleDelete = (user: IUser) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedUser(undefined);
    };

    const filteredUsers = users.filter(user => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = (
            user.firstName?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query)
        );
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        users: users.filter(u => u.role === 'member').length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Gerenciar Usuários
                </h1>
                <p className="text-slate-500 mt-1">
                    Adicione, edite e gerencie os usuários da plataforma
                </p>
                </div>
                <Button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-5 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-200 cursor-pointer"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Usuário
                </Button>
            </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-4 mb-8"
            >
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-slate-600" />
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
                    <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.admins}</p>
                    <p className="text-sm text-slate-500">Admins</p>
                </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.users}</p>
                    <p className="text-sm text-slate-500">Usuários</p>
                </div>
                </div>
            </div>
            </motion.div>

            {/* Search and Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 mb-6"
            >
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-11 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>
            <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-40 h-11 rounded-xl border-slate-200">
                        <SelectValue placeholder="Função" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-100">
                        <SelectItem value="all">Todas Funções</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            </motion.div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
            <UsersTable
                users={filteredUsers}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentUserEmail={currentUser?.email || ''}
            />
            </motion.div>

            {/* Modals */}
            <UserFormModal
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleSubmit}
                user={selectedUser}
                isLoading={inviteMutation.isPending || updateMutation.isPending}
            />

            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedUser(undefined);
                }}
                onConfirm={() => deleteMutation.mutate(selectedUser?._id)}
                user={selectedUser}
                isLoading={deleteMutation.isPending}
            />
        </div>
        </div>
    );
}
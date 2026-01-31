import { motion } from 'framer-motion';
import { Pencil, Trash2, MoreHorizontal, Shield, User as UserIcon } from 'lucide-react';
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
import { UserUtils, type IUser } from '@repo/shared-types';
import { avatarColors } from '@/lib/avatar_colors';
import { cn } from '@/lib/utils';
import { Avatar } from '../Avatar';

interface Props {
    currentUserEmail: string;
    onDelete: (user: IUser) => void;
    onEdit: (user: IUser) => void;
    users: IUser[];
    isLoading: boolean;
}

export default function UsersTable({ users, isLoading, onEdit, onDelete, currentUserEmail }: Props) {
    const userUtils = new UserUtils();


    const getRoleBadge = (role: string) => {
        if (role === 'admin') {
        return (
            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100">
                <Shield className="w-3 h-3 mr-1" />
                Admin
            </Badge>
        );
        }
        return (
            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                <UserIcon className="w-3 h-3 mr-1" />
                Member
            </Badge>
        );
    };

    if (isLoading) {
        return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            
            <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            ))}
            </div>
        </div>
        );
    }

    if (!users || users.length === 0) {
        return (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-slate-500">Comece adicionando o primeiro usuário</p>
        </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <Table>
            <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-semibold text-slate-700">Usuário</TableHead>
                <TableHead className="font-semibold text-slate-700">Função</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Ações</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {users.map((user, index) => (
                <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                >
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar user={user} />
                        <div>
                            <p className="font-medium text-slate-900">{userUtils.getFullname(user) || 'Sem nome'}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                        {user.email === currentUserEmail && (
                            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                            Você
                            </Badge>
                        )}
                    </div>
                </TableCell>
                <TableCell>
                    {getRoleBadge(user.role)}
                </TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                        >
                        <MoreHorizontal className="w-4 h-4 text-slate-500" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40 bg-white" align="end">
                        <DropdownMenuItem onClick={() => onEdit(user)} className="cursor-pointer">
                        <Pencil className="w-4 h-4 mr-2" />
                        Editar
                        </DropdownMenuItem>
                        {user.email !== currentUserEmail && (
                        <DropdownMenuItem
                            onClick={() => onDelete(user)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                        </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
                </motion.tr>
            ))}
            </TableBody>
        </Table>
        </div>
    );
}
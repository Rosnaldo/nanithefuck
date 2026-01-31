import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CircleUser, Mail, Shield, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { IUser } from '@repo/shared-types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (form: Partial<IUser>) => void;
    user?: IUser;
    isLoading: boolean;
}

export default function UserFormModal({ isOpen, onClose, onSubmit, user, isLoading }: Props) {
    const [formData, setFormData] = useState<Partial<IUser>>({
        firstName: '',
        lastName: '',
        email: '',
        role: 'member'
    });

    const isEditing = !!user;

    useEffect(() => {
        console.log('useEffect', user)
        if (user) {
            setFormData({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                role: user?.role || 'member'
            });
        } else {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            role: 'member'
        });
        }
    }, [user, isOpen]);

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <AnimatePresence>
        {isOpen && (
            <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="px-8 pt-8 pb-6 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                        {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="flex gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                                First name
                            </Label>
                            <div className="relative">
                                <CircleUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleChange('firstName', e.target.value)}
                                placeholder="João"
                                className="pl-11 h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                                Last name
                            </Label>
                            <div className="relative">
                                <CircleUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                                placeholder="Paulo"
                                className="pl-11 h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                            Email
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="joao@empresa.com"
                                className="pl-11 h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium text-slate-700">
                        Role
                    </Label>
                    <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                        <Select
                        value={formData.role}
                        onValueChange={(value) => handleChange('role', value)}
                        >
                        <SelectTrigger className="pl-11 h-12 rounded-xl border-slate-200">
                            <SelectValue placeholder="Selecione a função" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
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
                            'Convidar Usuário'
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

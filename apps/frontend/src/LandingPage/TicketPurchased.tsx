import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Ticket, Check, Loader2, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

const TICKET_PRICE = 150;
const MAX_TICKETS = 5;

export default function TicketPurchase() {
    const [quantity, setQuantity] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [formData, setFormData] = useState({
        buyer_name: '',
        buyer_email: '',
        buyer_phone: '',
        notes: ''
    });

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, Math.min(MAX_TICKETS, prev + delta)));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!formData.buyer_name || !formData.buyer_email) {
        toast.error('Preencha nome e email');
        return;
        }

        setIsSubmitting(true);
        
        setIsSubmitting(false);
        setOrderComplete(true);
        toast.success('Pedido realizado com sucesso!');
    };

    if (orderComplete) {
        return (
        <section id="tickets" className="py-24 px-6 bg-gradient-to-b from-zinc-950 to-zinc-900">
            <div className="max-w-xl mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-3xl p-12 text-center"
            >
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Pedido Confirmado!</h3>
                <p className="text-zinc-300 text-lg mb-6">
                Enviamos os detalhes para <span className="text-emerald-400">{formData.buyer_email}</span>
                </p>
                <div className="bg-zinc-800/50 rounded-2xl p-6 mb-6">
                <p className="text-zinc-400 mb-2">Total a pagar:</p>
                <p className="text-4xl font-bold text-white">R$ {(quantity * TICKET_PRICE).toFixed(2)}</p>
                <p className="text-zinc-500 text-sm mt-2">{quantity} ingresso(s)</p>
                </div>
                <p className="text-zinc-400 text-sm">
                Em breve entraremos em contato com as instruções de pagamento via PIX.
                </p>
            </motion.div>
            </div>
        </section>
        );
    }

    return (
        <section id="tickets" className="py-24 px-6 bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="max-w-4xl mx-auto">
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
            >
            <span className="text-orange-400 font-medium mb-4 block">Garanta sua vaga</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ingressos
            </h2>
            </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-br from-zinc-800/80 to-zinc-800/40 backdrop-blur-xl border border-zinc-700/50 rounded-3xl overflow-hidden"
            >
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-b border-zinc-700/50 p-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl">
                    <Ticket className="w-8 h-8 text-white" />
                    </div>
                    <div>
                    <h3 className="text-2xl font-bold text-white">Ingresso Weekend</h3>
                    <p className="text-zinc-400">Acesso completo ao evento</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-zinc-400 text-sm">Por pessoa</p>
                    <p className="text-3xl font-bold text-white">R$ {TICKET_PRICE}</p>
                </div>
                </div>
            </div>

            {/* Ticket Body */}
            <div className="p-8">
                <AnimatePresence mode="wait">
                {!showForm ? (
                    <motion.div
                    key="quantity"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                    >
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between">
                        <p className="text-white font-medium">Quantidade</p>
                        <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            className="w-12 h-12 rounded-xl bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
                        >
                            <Minus className="w-5 h-5" />
                        </button>
                        <span className="text-3xl font-bold text-white w-12 text-center">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= MAX_TICKETS}
                            className="w-12 h-12 rounded-xl bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                        </div>
                    </div>

                    {/* What's Included */}
                    <div className="space-y-3">
                        <p className="text-zinc-400 text-sm">Incluso:</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                        {['Churras completo', 'Piscina liberada', 'Open bar', 'Pernoite na chácara', 'Café da manhã', 'Jogos e música'].map((item) => (
                            <div key={item} className="flex items-center gap-2 text-zinc-300">
                            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            {item}
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Total & CTA */}
                    <div className="pt-6 border-t border-zinc-700/50">
                        <div className="flex items-center justify-between mb-6">
                        <p className="text-zinc-400">Total</p>
                        <p className="text-4xl font-bold text-white">R$ {(quantity * TICKET_PRICE).toFixed(2)}</p>
                        </div>
                        <Button
                        onClick={() => setShowForm(true)}
                        className="w-full h-14 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-lg font-semibold rounded-2xl shadow-xl shadow-orange-500/20 transition-all duration-300"
                        >
                        Continuar
                        </Button>
                    </div>
                    </motion.div>
                ) : (
                    <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    >
                    <div className="space-y-4">
                        <div className="space-y-2">
                        <Label className="text-zinc-300 flex items-center gap-2">
                            <User className="w-4 h-4" /> Seu Nome
                        </Label>
                        <Input
                            name="buyer_name"
                            value={formData.buyer_name}
                            onChange={handleInputChange}
                            placeholder="Como devemos te chamar?"
                            className="h-12 bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-500 rounded-xl"
                            required
                        />
                        </div>

                        <div className="space-y-2">
                        <Label className="text-zinc-300 flex items-center gap-2">
                            <Mail className="w-4 h-4" /> E-mail
                        </Label>
                        <Input
                            name="buyer_email"
                            type="email"
                            value={formData.buyer_email}
                            onChange={handleInputChange}
                            placeholder="seu@email.com"
                            className="h-12 bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-500 rounded-xl"
                            required
                        />
                        </div>

                        <div className="space-y-2">
                        <Label className="text-zinc-300 flex items-center gap-2">
                            <Phone className="w-4 h-4" /> WhatsApp
                        </Label>
                        <Input
                            name="buyer_phone"
                            value={formData.buyer_phone}
                            onChange={handleInputChange}
                            placeholder="(11) 99999-9999"
                            className="h-12 bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-500 rounded-xl"
                        />
                        </div>

                        <div className="space-y-2">
                        <Label className="text-zinc-300 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Alguma observação?
                        </Label>
                        <Textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleTextareaChange}
                            placeholder="Restrições alimentares, precisa de carona, etc."
                            className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-500 rounded-xl min-h-[100px]"
                        />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-700/50">
                        <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-zinc-400">Total ({quantity} ingresso{quantity > 1 ? 's' : ''})</p>
                        </div>
                        <p className="text-3xl font-bold text-white">R$ {(quantity * TICKET_PRICE).toFixed(2)}</p>
                        </div>

                        <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowForm(false)}
                            className="flex-1 h-14 border-zinc-600 text-zinc-300 hover:bg-zinc-700 rounded-2xl"
                        >
                            Voltar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] h-14 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-lg font-semibold rounded-2xl shadow-xl shadow-orange-500/20 transition-all duration-300"
                        >
                            {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                            'Confirmar Pedido'
                            )}
                        </Button>
                        </div>
                    </div>
                    </motion.form>
                )}
                </AnimatePresence>
            </div>
            </motion.div>
        </div>
        </section>
    );
}
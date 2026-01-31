import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { IMeeting } from '@repo/shared-types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    meeting?: IMeeting;
    isLoading: boolean;
}

export default function DeleteMeetingModal({ isOpen, onClose, onConfirm, meeting, isLoading }: Props) {
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Excluir Reunião
                </h3>
                <p className="text-slate-500 mb-6">
                  Tem certeza que deseja excluir <span className="font-medium text-slate-700">{meeting?.name}</span>? Esta ação não pode ser desfeita.
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 h-11 rounded-xl cursor-pointer"
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={onConfirm}
                    className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Excluir'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

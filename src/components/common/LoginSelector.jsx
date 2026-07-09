import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Shield } from 'lucide-react';

function LoginSelector({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('client');

  const handleContinue = () => {
    onClose();
    navigate(selected === 'admin' ? '/admin/login' : '/cliente/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-[28px] bg-[#111418] p-6 text-primary-foreground shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Iniciar sesión</h2>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/10" aria-label="Cerrar">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-primary-foreground/50">Selecciona tu tipo de acceso</p>

            <div className="mt-6 grid gap-3">
              <button
                onClick={() => setSelected('client')}
                className={`flex items-center gap-4 rounded-[18px] border-2 p-4 text-left transition ${
                  selected === 'client'
                    ? 'border-[#3b82f6] bg-[#3b82f6]/10'
                    : 'border-primary-foreground/10 bg-primary-foreground/5'
                }`}
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-[14px] ${selected === 'client' ? 'bg-[#3b82f6] text-white' : 'bg-primary-foreground/10 text-primary-foreground/60'}`}>
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">Cliente</p>
                  <p className="text-xs text-primary-foreground/50">Reservar y gestionar clases</p>
                </div>
              </button>

              <button
                onClick={() => setSelected('admin')}
                className={`flex items-center gap-4 rounded-[18px] border-2 p-4 text-left transition ${
                  selected === 'admin'
                    ? 'border-[#3b82f6] bg-[#3b82f6]/10'
                    : 'border-primary-foreground/10 bg-primary-foreground/5'
                }`}
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-[14px] ${selected === 'admin' ? 'bg-[#3b82f6] text-white' : 'bg-primary-foreground/10 text-primary-foreground/60'}`}>
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">Administrador</p>
                  <p className="text-xs text-primary-foreground/50">Gestión del sistema</p>
                </div>
              </button>
            </div>

            <button
              onClick={handleContinue}
              className="mt-6 flex h-[52px] w-full items-center justify-center rounded-xl bg-[#3b82f6] text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#3b82f6]/80"
            >
              Continuar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoginSelector;

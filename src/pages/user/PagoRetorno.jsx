import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function PagoRetorno() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const token = searchParams.get('token');
    const flowStatus = searchParams.get('status');

    if (flowStatus === 'success' || token) {
      setStatus('success');
    } else if (flowStatus === 'failure' || flowStatus === 'rejected') {
      setStatus('failure');
    } else {
      setStatus('success');
    }

    const timer = setTimeout(() => {
      navigate('/cliente/reservas', { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-3xl bg-card p-8 text-center shadow-lg"
      >
        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 size={48} className="mx-auto animate-spin text-blue-600" />
            <p className="text-lg font-bold text-foreground">Verificando pago...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10">
              <CheckCircle2 size={36} className="text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-xl font-black text-foreground">Pago exitoso</h1>
            <p className="text-sm text-muted">Tu reserva ha sido confirmada. Te redirigiremos a tus reservas.</p>
          </div>
        )}

        {status === 'failure' && (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
              <XCircle size={36} className="text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-xl font-black text-foreground">Pago no completado</h1>
            <p className="text-sm text-muted">El pago no pudo completarse. Puedes intentar nuevamente desde tus reservas.</p>
          </div>
        )}

        <button
          onClick={() => navigate('/cliente/reservas', { replace: true })}
          className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-blue-700"
        >
          Ir a mis reservas
        </button>
      </motion.div>
    </main>
  );
}

export default PagoRetorno;

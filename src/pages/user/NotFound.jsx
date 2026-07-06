import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex justify-center">
          <img
            className="h-28 w-28 rounded-3xl bg-card object-contain shadow-[0_12px_28px_rgba(0,0,0,.12)] sm:h-32 sm:w-32"
            src={logoJmGym}
            alt="Logo de JMGym"
          />
        </div>

        <h1 className="font-display text-7xl font-black text-foreground sm:text-8xl">404</h1>
        <p className="mt-2 text-xl font-bold text-foreground">Página no encontrada</p>
        <p className="mt-2 text-secondary">
          La página que buscas no existe o fue movida.
        </p>

        <button
          className="mt-8 inline-flex min-h-14 items-center gap-3 rounded-2xl bg-brand-600 px-8 font-bold text-primary-foreground shadow-soft transition hover:bg-brand-700"
          type="button"
          onClick={() => navigate('/cliente/home')}
        >
          <Home size={20} />
          Volver al inicio
        </button>
      </div>
    </main>
  );
}

export default NotFound;

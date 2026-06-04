import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ClassCard from '../../components/user/ClassCard.jsx';
import { classService } from '../../services/classService.js';

function ListaClases() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    classService
      .getAllClasses()
      .then(setClasses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-brand-50 px-5 py-6 pb-24 sm:px-6 sm:py-8 md:pb-10">
      <button
        onClick={() => navigate('/cliente/home')}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        aria-label="Volver al menu principal"
      >
        <ArrowLeft size={18} />
        <span>Volver al menu</span>
      </button>

      <section className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-extrabold text-slate-800 sm:text-3xl md:text-4xl">Clases disponibles</h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base">Encuentra tu proxima clase y reserva tu lugar</p>
        <div className="mt-6 grid gap-4 sm:gap-5">
          {loading ? (
            <p className="text-slate-400">Cargando clases...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : classes.length === 0 ? (
            <p className="text-slate-400">No hay clases disponibles</p>
          ) : (
            classes.map((classItem) => <ClassCard classItem={classItem} key={classItem.id} />)
          )}
        </div>
      </section>
    </main>
  );
}

export default ListaClases;

import { useEffect, useState } from 'react';
import ClassCard from '../../components/user/ClassCard.jsx';
import { classService } from '../../services/classService.js';

function ListaClases() {
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
    <main className="min-h-screen bg-brand-50 px-6 py-8">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-extrabold text-slate-800">Clases disponibles</h1>
        <div className="mt-6 grid gap-5">
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

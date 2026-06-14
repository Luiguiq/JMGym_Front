import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Mail } from 'lucide-react';
import ClassCard from '../../components/user/ClassCard.jsx';
import { classService } from '../../services/classService.js';

function Home() {
  const { user } = useAuth();
  const [todayClasses, setTodayClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    classService
      .getAllClasses()
      .then(setTodayClasses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const nextClass = todayClasses[0];
  const totalAvailableSpots = todayClasses.reduce(
    (acc, classItem) => acc + Number(classItem.availableSpots ?? 0),
    0
  );

  return (
    <main className="min-h-screen bg-[#f7fbff] pb-28">
      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="overflow-hidden rounded-[24px] bg-gradient-to-br from-[#004aab] via-[#0a58ca] to-[#1576ff] p-5 text-white shadow-[0_20px_60px_rgba(0,74,171,.18)] sm:rounded-[34px] sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white/85">
                Bienvenida, {user?.name ?? 'usuaria'}
              </p>
              <Link
                to="/cliente/clases"
                className="shrink-0 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-white/25 sm:text-sm"
              >
                Ver clases
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-3">
              <div className="rounded-2xl bg-white/10 p-3 text-center ring-1 ring-white/10 sm:p-4">
                <p className="text-lg font-black leading-none text-white sm:text-2xl">{todayClasses.length}</p>
                <p className="mt-1 text-[10px] text-white/70 sm:text-xs">Disponibles</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 text-center ring-1 ring-white/10 sm:p-4">
                <p className="text-lg font-black leading-none text-white sm:text-2xl">{totalAvailableSpots}</p>
                <p className="mt-1 text-[10px] text-white/70 sm:text-xs">Cupos libres</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 text-center ring-1 ring-white/10 sm:p-4">
                <p className="text-lg font-black leading-none text-white sm:text-2xl">{nextClass?.time ?? '--:--'}</p>
                <p className="mt-1 text-[10px] text-white/70 sm:text-xs">Próxima</p>
              </div>
            </div>

            {nextClass && (
              <Link
                to={`/cliente/clases/${nextClass.id}`}
                className="mt-4 flex items-center justify-between rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 transition hover:bg-white/15 sm:mt-5 sm:p-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">Próxima clase</p>
                  <h2 className="mt-0.5 truncate text-lg font-black text-white sm:text-xl">{nextClass.name}</h2>
                  <p className="mt-0.5 text-xs text-white/75">
                    {nextClass.time} · {nextClass.availableSpots} cupos
                  </p>
                </div>
                <span className="ml-3 shrink-0 text-xl sm:text-2xl">→</span>
              </Link>
            )}
          </article>

          <article className="rounded-[24px] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,.08)] ring-1 ring-slate-100 sm:rounded-[34px] sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black text-black sm:text-2xl">Clases</h2>
                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">Revisa y reserva tu lugar</p>
              </div>
              {todayClasses.length > 0 && (
                <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600">
                  {todayClasses.length}
                </span>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:mt-5">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
                </div>
              ) : error ? (
                <div className="rounded-2xl bg-red-50 p-4 text-center text-sm text-red-600">{error}</div>
              ) : todayClasses.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-8 text-center">
                  <Mail size={40} className="mx-auto text-slate-300" />
                  <p className="mt-2 font-bold text-slate-600">No hay clases disponibles</p>
                  <p className="mt-1 text-xs text-slate-400">Vuelve pronto para ver nuevas opciones.</p>
                </div>
              ) : (
                todayClasses.slice(0, 3).map((classItem) => (
                  <ClassCard classItem={classItem} key={classItem.id} />
                ))
              )}
            </div>

            {todayClasses.length > 3 && (
              <Link
                to="/cliente/clases"
                className="mt-4 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-3 text-sm font-bold text-slate-500 transition hover:border-brand-200 hover:text-brand-600"
              >
                Ver todas las clases ({todayClasses.length}) →
              </Link>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}

export default Home;

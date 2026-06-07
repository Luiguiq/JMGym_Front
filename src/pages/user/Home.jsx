import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import ClassCard from '../../components/user/ClassCard.jsx';
import Navbar from '../../components/user/Navbar.jsx';
import { classService } from '../../services/classService.js';

function StatCard({ value, label }) {
  return (
    <div className="rounded-[24px] bg-white/12 p-4 ring-1 ring-white/10">
      <p className="text-2xl font-black leading-none text-white">{value}</p>
      <p className="mt-2 text-sm text-white/80">{label}</p>
    </div>
  );
}

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
      <section className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <Navbar />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="overflow-hidden rounded-[34px] bg-[#004aab] p-6 text-white shadow-[0_20px_60px_rgba(0,74,171,.18)] sm:p-8">
            <p className="text-sm font-semibold text-white/85 sm:text-base">
              Bienvenida, {user?.name ?? 'usuaria'}
            </p>

            <h1 className="mt-2 max-w-xl font-display text-4xl font-bold leading-tight sm:text-5xl">
              Reserva tu próxima clase de baile en pocos pasos
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              Elige tu clase, selecciona un espacio y finaliza tu reserva con una experiencia simple, clara y responsiva.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/cliente/clases"
                className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#004aab] transition hover:bg-slate-100"
              >
                Ver clases
              </Link>
              <Link
                to="/cliente/reservas"
                className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
              >
                Mis reservas
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <StatCard value={todayClasses.length} label="Clases disponibles" />
              <StatCard value={totalAvailableSpots} label="Cupos libres" />
              <StatCard value={nextClass?.time ?? '--:--'} label="Próxima hora" />
            </div>

            {nextClass && (
              <div className="mt-6 rounded-[28px] bg-white/10 p-5 ring-1 ring-white/10">
                <p className="text-sm font-semibold text-white/80">Clase destacada</p>
                <h2 className="mt-1 font-display text-3xl font-bold">{nextClass.name}</h2>
                <p className="mt-2 text-sm text-white/85">
                  Hoy · {nextClass.time} · {nextClass.availableSpots} espacios disponibles
                </p>
              </div>
            )}
          </article>

          <article className="rounded-[34px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,.08)] ring-1 ring-slate-100 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-bold text-black sm:text-4xl">
                  Clases de hoy
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Las opciones que puedes revisar y reservar.
                </p>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600">
                {todayClasses.length} clases
              </span>
            </div>

            <div className="mt-5 grid gap-4">
              {loading ? (
                <p className="text-slate-400">Cargando clases...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : todayClasses.length === 0 ? (
                <p className="text-slate-400">No hay clases disponibles hoy</p>
              ) : (
                todayClasses.map((classItem) => (
                  <ClassCard classItem={classItem} key={classItem.id} />
                ))
              )}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Home;
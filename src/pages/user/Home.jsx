import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import ClassCard from '../../components/user/ClassCard.jsx';
import Navbar from '../../components/user/Navbar.jsx';
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

  return (
    <main className="min-h-screen bg-brand-50">
      <section className="relative min-h-screen bg-[linear-gradient(180deg,#fbfdff_0%,#edf8ff_100%)] px-7 py-6 pb-28 md:grid md:grid-cols-[minmax(360px,0.72fr)_minmax(520px,0.9fr)] md:grid-rows-[auto_auto_auto] md:content-center md:gap-x-28 md:gap-y-7 md:bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.95),transparent_28rem),linear-gradient(180deg,#f7fcff_0%,#e8f7ff_100%)] md:px-[8vw] md:py-12 md:pb-28 max-w-full overflow-x-hidden">
        <div className="md:col-span-2"><Navbar /></div>

        <section className="mt-9 md:mt-0 md:self-end" aria-labelledby="client-home-title">
          <h1 id="client-home-title" className="text-3xl font-extrabold leading-tight tracking-tight text-slate-800 md:text-7xl">Bienvenida, {user?.name ?? 'usuaria'} 👋</h1>
          <p className="mt-2 text-slate-500 md:text-xl">Reserva tu proxima clase de baile</p>
        </section>

        <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-sky-400 p-6 text-white shadow-soft md:col-start-1 md:mt-0 md:self-start md:p-9" aria-label="Proxima clase">
          {loading ? (
            <p className="text-white/80">Cargando...</p>
          ) : error ? (
            <p className="text-white/80">No se pudo cargar la proxima clase</p>
          ) : nextClass ? (
            <>
              <span className="text-white/90 md:text-lg">Proxima clase</span>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">{nextClass.name}</h2>
              <p className="mt-2 md:text-lg">Hoy · {nextClass.time} · Espacios disponibles: {nextClass.availableSpots}</p>
            </>
          ) : (
            <p className="text-white/80">No hay clases programadas para hoy</p>
          )}
          <span className="absolute right-5 top-2 rotate-[-10deg] text-7xl text-white/20 md:text-8xl" aria-hidden="true">♪</span>
        </section>

        <section className="mt-7 md:col-start-2 md:row-span-2 md:row-start-2 md:mt-0" aria-labelledby="today-classes-title">
          <h2 id="today-classes-title" className="mb-4 text-sm font-extrabold uppercase tracking-wide text-slate-500 md:text-base">Clases de hoy</h2>
          <div className="grid gap-4 md:gap-5">
            {loading ? (
              <p className="text-slate-400">Cargando clases...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : todayClasses.length === 0 ? (
              <p className="text-slate-400">No hay clases disponibles hoy</p>
            ) : (
              todayClasses.map((classItem) => <ClassCard classItem={classItem} key={classItem.id} />)
            )}
          </div>
        </section>

      </section>
    </main>
  );
}

export default Home;

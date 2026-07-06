import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import { Calendar, Clock, Users, ChevronRight, Zap, Sparkles } from 'lucide-react';
import ClassCard from '../../components/user/ClassCard.jsx';
import { classService } from '../../services/classService.js';
import { getFriendlyErrorMessage } from '../../utils/userMessages.js';

function getNowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function isClassActive(classItem) {
  if (!classItem.hora_inicio || !classItem.hora_fin) return false;
  const now = getNowHHMM();
  return now >= classItem.hora_inicio && now <= classItem.hora_fin;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl bg-card p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 rounded-xl bg-border-light" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-border-light" />
          <div className="h-3 w-1/3 rounded bg-border-light" />
        </div>
        <div className="h-8 w-16 rounded-lg bg-border-light" />
      </div>
    </div>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

function Home() {
  const { user } = useAuth();
  const [todayClasses, setTodayClasses] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    classService
      .getTodayClasses()
      .then((data) => {
        setTodayClasses(data);
        if (data.length === 0) {
          return classService.getAllClasses().then(setAllClasses);
        }
        setAllClasses([]);
      })
      .catch((err) => setError(getFriendlyErrorMessage(err, 'No pudimos cargar las clases. Comprueba tu conexión e intenta nuevamente.')))
      .finally(() => setLoading(false));
  }, []);

  const displayClasses = todayClasses.length > 0 ? todayClasses : allClasses;

  const activeClasses = useMemo(() => displayClasses.filter(isClassActive), [displayClasses]);
  const nextClass = displayClasses[0];
  const totalAvailableSpots = displayClasses.reduce(
    (acc, classItem) => acc + Number(classItem.availableSpots ?? 0),
    0
  );

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
  })();

  return (
    <motion.main
      className="min-h-screen bg-surface pb-28"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <section className="mx-auto max-w-lg px-5 py-5 sm:px-6 sm:py-6 lg:px-8">

        <motion.div variants={itemAnim} className="mb-6">
          <p className="text-lg font-semibold text-foreground">
            {user?.name ? `${greeting}, ${user.name.split(' ')[0]}` : greeting}
          </p>
        </motion.div>

        <motion.div
          variants={itemAnim}
          className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 p-6 text-primary-foreground shadow-[0_16px_36px_rgba(37,99,235,0.22)]"
        >
          <div className="mb-5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-[11px] font-semibold tracking-wide">
              <Sparkles size={13} />
              Hoy
            </span>
            <Link
              to="/cliente/clases"
              className="rounded-full bg-primary-foreground/15 px-3.5 py-1.5 text-[12px] font-bold transition hover:bg-primary-foreground/25"
            >
              Ver todas las clases
            </Link>
          </div>

          <div className="mb-5 flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/60">Clases de hoy</p>
              <p className="mt-0.5 text-2xl font-black">{displayClasses.length}</p>
            </div>
            <div className="h-8 w-px bg-primary-foreground/15" />
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/60">Cupos libres</p>
              <p className="mt-0.5 text-2xl font-black">{totalAvailableSpots}</p>
            </div>
            <div className="h-8 w-px bg-primary-foreground/15" />
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/60">Próxima</p>
              <p className="mt-0.5 text-2xl font-black">{nextClass?.time ?? '--:--'}</p>
            </div>
          </div>

          {nextClass && (
            <Link
              to={`/cliente/clases/${nextClass.id}`}
              className="flex items-center justify-between rounded-2xl bg-primary-foreground/10 p-4 transition hover:bg-primary-foreground/15"
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/60">Próxima clase</p>
                <p className="mt-0.5 text-lg font-bold text-primary-foreground">{nextClass.name}</p>
                <p className="mt-0.5 text-[13px] text-primary-foreground/70">
                  {nextClass.time} &middot; {nextClass.availableSpots} cupos libres
                </p>
              </div>
              <ChevronRight size={22} className="text-primary-foreground/60" />
            </Link>
          )}
        </motion.div>

        {!loading && activeClasses.length > 0 && (
          <motion.div variants={itemAnim} className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary/100 animate-pulse" />
              <h2 className="text-[15px] font-bold text-foreground">Clases activas ahora</h2>
            </div>
            <div className="space-y-3">
              {activeClasses.map((classItem) => (
                <ClassCard classItem={{ ...classItem, _isActive: true }} key={classItem.id} />
              ))}
            </div>
          </motion.div>
        )}

        <motion.div variants={itemAnim} className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-foreground">Clases disponibles</h2>
            {displayClasses.length > 0 && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[12px] font-semibold text-blue-600">
                {displayClasses.length}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : error ? (
              <div className="rounded-2xl bg-red-50 p-4 text-center text-sm font-medium text-red-600 dark:bg-red-500/10 dark:text-red-300">{error}</div>
            ) : displayClasses.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-border-light">
                  <Calendar size={28} className="text-muted-foreground" />
                </div>
                <p className="text-base font-bold text-secondary">No hay clases disponibles</p>
                <p className="text-sm text-muted-foreground">Consulta otros horarios para encontrar una clase.</p>
              </div>
            ) : (
              displayClasses.slice(0, 3).map((classItem) => (
                <ClassCard classItem={classItem} key={classItem.id} />
              ))
            )}
          </div>

          {!loading && displayClasses.length > 3 && (
            <Link
              to="/cliente/clases"
              className="mt-4 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-3 text-sm font-bold text-muted transition hover:border-blue-200 hover:text-blue-600"
            >
              Ver todas las clases ({displayClasses.length})
            </Link>
          )}
        </motion.div>
      </section>
    </motion.main>
  );
}

export default Home;

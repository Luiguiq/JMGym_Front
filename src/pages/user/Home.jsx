import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import { Calendar, Clock, Users, ChevronRight, Zap, Sparkles, Smartphone } from 'lucide-react';
import ClassCard from '../../components/user/ClassCard.jsx';
import FidelityCard from '../../components/user/FidelityCard.jsx';
import { classService } from '../../services/classService.js';
import { reservationService } from '../../services/reservationService.js';
import { fidelizacionService } from '../../services/fidelizacionService.js';
import { getFriendlyErrorMessage } from '../../utils/userMessages.js';
import YapeVinculacionModal from '../../components/user/YapeVinculacionModal.jsx';

function getNowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
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
  const [fidelityHoras, setFidelityHoras] = useState(0);
  const [fidelityLoading, setFidelityLoading] = useState(true);
  const [horasBono, setHorasBono] = useState(0);
  const [clasesGratisRestantes, setClasesGratisRestantes] = useState(0);
  const [showYapeModal, setShowYapeModal] = useState(false);

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

  useEffect(() => {
    fidelizacionService
      .getMiFidelizacion()
      .then((data) => {
        setFidelityHoras(data.horas_mes);
        setHorasBono(data.horas_bono || 0);
        setClasesGratisRestantes(data.clases_gratis_restantes || 0);
      })
      .catch(() => {})
      .finally(() => setFidelityLoading(false));
  }, []);

  const todayStr = useMemo(() => toDateStr(new Date()), []);

  const displayClasses = (todayClasses.length > 0 ? todayClasses : allClasses).filter((c) => c.date >= todayStr);
  const todayCount = todayClasses.length;

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
      className="min-h-screen bg-surface pb-28 lg:pb-12"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <section className="mx-auto max-w-lg px-5 py-5 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">

        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
          <div className="lg:min-w-0">

            <motion.div variants={itemAnim} className="mb-6">
              <p className="text-lg font-semibold text-foreground lg:text-xl">
                {user?.name ? `${greeting}, ${user.name.split(' ')[0]}` : greeting}
              </p>
            </motion.div>

            {user && !user.yapeVinculado && (
              <motion.div variants={itemAnim} className="mb-6">
                <button
                  onClick={() => setShowYapeModal(true)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left transition hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 lg:rounded-2xl lg:p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-200 dark:bg-amber-500/20">
                    <Smartphone size={20} className="text-amber-700 dark:text-amber-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-200">Vincula tu cuenta Yape</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">Paga tus clases al instante desde el app</p>
                  </div>
                  <ChevronRight size={18} className="shrink-0 text-amber-400" />
                </button>
              </motion.div>
            )}

            {showYapeModal && (
              <YapeVinculacionModal onClose={() => setShowYapeModal(false)} />
            )}

            <motion.div
              variants={itemAnim}
              className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 p-6 text-primary-foreground shadow-[0_16px_36px_rgba(37,99,235,0.22)] lg:p-8 lg:rounded-3xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-[11px] font-semibold tracking-wide lg:text-xs lg:px-4 lg:py-1.5">
                  <Sparkles size={13} />
                  Hoy
                </span>
                <Link
                  to="/cliente/clases"
                  className="rounded-full bg-primary-foreground/15 px-3.5 py-1.5 text-[12px] font-bold transition hover:bg-primary-foreground/25 lg:text-sm lg:px-5 lg:py-2"
                >
                  Ver todas las clases
                </Link>
              </div>

              <div className="mb-5 flex items-center gap-6 lg:gap-10">
                <div className="text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/60 lg:text-xs">Clases de hoy</p>
                  <p className="mt-0.5 text-2xl font-black lg:text-3xl">{todayCount}</p>
                </div>
                <div className="h-8 w-px bg-primary-foreground/15 lg:h-12" />
                <div className="text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/60 lg:text-xs">Cupos libres</p>
                  <p className="mt-0.5 text-2xl font-black lg:text-3xl">{totalAvailableSpots}</p>
                </div>
                <div className="h-8 w-px bg-primary-foreground/15 lg:h-12" />
                <div className="text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/60 lg:text-xs">Próxima</p>
                  <p className="mt-0.5 text-2xl font-black lg:text-3xl">{nextClass?.time ?? '--:--'}</p>
                </div>
              </div>

              {nextClass && (
                <Link
                  to={`/cliente/clases/${nextClass.id}`}
                  className="flex items-center justify-between rounded-2xl bg-primary-foreground/10 p-4 transition hover:bg-primary-foreground/15 lg:p-5 lg:rounded-2xl"
                >
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/60 lg:text-xs">Próxima clase</p>
                    <p className="mt-0.5 text-lg font-bold text-primary-foreground lg:text-xl">{nextClass.name}</p>
                    <p className="mt-0.5 text-[13px] text-primary-foreground/70 lg:text-sm">
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
                  <h2 className="text-[15px] font-bold text-foreground lg:text-base">Clases activas ahora</h2>
                </div>
                <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
                  {activeClasses.map((classItem) => (
                    <ClassCard classItem={{ ...classItem, _isActive: true }} key={classItem.id} />
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div variants={itemAnim} className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-foreground lg:text-base">Clases disponibles</h2>
                {displayClasses.length > 0 && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[12px] font-semibold text-blue-600">
                    {displayClasses.length}
                  </span>
                )}
              </div>

              <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
                {loading ? (
                  <>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                  </>
                ) : error ? (
                  <div className="rounded-2xl bg-red-50 p-4 text-center text-sm font-medium text-red-600 dark:bg-red-500/10 dark:text-red-300 lg:col-span-2">{error}</div>
                ) : displayClasses.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-12 text-center lg:col-span-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-border-light">
                      <Calendar size={28} className="text-muted-foreground" />
                    </div>
                    <p className="text-base font-bold text-secondary">No hay clases disponibles</p>
                    <p className="text-sm text-muted-foreground">Consulta otros horarios para encontrar una clase.</p>
                  </div>
                ) : (
                  displayClasses.slice(0, 4).map((classItem) => (
                    <ClassCard classItem={classItem} key={classItem.id} />
                  ))
                )}
              </div>

              {!loading && displayClasses.length > 4 && (
                <Link
                  to="/cliente/clases"
                  className="mt-4 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-3 text-sm font-bold text-muted transition hover:border-blue-200 hover:text-blue-600 lg:mt-6 lg:py-4"
                >
                  Ver todas las clases ({displayClasses.length})
                </Link>
              )}
            </motion.div>

          </div>

          <div className="hidden lg:block lg:space-y-6">
            <div className="lg:sticky lg:top-6 lg:space-y-6">
              <motion.div variants={itemAnim}>
                <FidelityCard horas={fidelityHoras} loading={fidelityLoading} horasBono={horasBono} clasesGratisRestantes={clasesGratisRestantes} />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <motion.div variants={itemAnim} className="mb-6">
            <FidelityCard horas={fidelityHoras} loading={fidelityLoading} horasBono={horasBono} clasesGratisRestantes={clasesGratisRestantes} />
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}

export default Home;

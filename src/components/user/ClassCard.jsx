import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Timer, Flame, Users, Dumbbell, Music, Zap, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const genreIcons = {
  cardio: <Zap className="w-6 h-6 sm:w-7 sm:h-7" />,
  baile: <Music className="w-6 h-6 sm:w-7 sm:h-7" />,
  fuerza: <Dumbbell className="w-6 h-6 sm:w-7 sm:h-7" />,
};
import cardioImage from '../../assets/images/cardio.jpg';
import trenSuperiorImage from '../../assets/images/trensuperior.jpg';
import zumbaImage from '../../assets/images/zumba.jpg';

const classImages = [
  { match: 'zumba', image: zumbaImage },
  { match: 'cardio', image: cardioImage },
  { match: 'tren superior', image: trenSuperiorImage },
  { match: 'trensuperior', image: trenSuperiorImage },
];

function getClassImage(className = '') {
  const n = className.toLowerCase().replace(/\s+/g, ' ').trim();
  return classImages.find(({ match }) => n.includes(match))?.image;
}

function getAvailabilityMeta(availableSpots = 0) {
  if (availableSpots === 0) return { label: 'Completo', bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-700 dark:text-red-300' };
  if (availableSpots <= 5) return { label: 'Pocos cupos', bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-300' };
  return { label: 'Disponible', bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300' };
}

function getIntensityMeta(level = '') {
  const v = level.toUpperCase();
  if (v === 'ALTA') return { label: 'Alta', text: 'text-red-600' };
  if (v === 'BAJA') return { label: 'Baja', text: 'text-emerald-600' };
  return { label: 'Media', text: 'text-amber-600' };
}

function ClassCard({ classItem }) {
  const navigate = useNavigate();
  const image = classItem.imagen_clase || getClassImage(classItem.name);
  const availability = getAvailabilityMeta(Number(classItem.availableSpots || 0));
  const intensity = getIntensityMeta(classItem.level);
  const formattedDate = classItem.date
    ? new Date(classItem.date + 'T00:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
    : 'Próximamente';
  const isActive = classItem._isActive;

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/cliente/clases/${classItem.id}`)}
      className="w-full rounded-2xl bg-card p-4 text-left shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl sm:h-[72px] sm:w-[72px]">
          {image ? (
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-2xl text-primary-foreground">
              {genreIcons[classItem.icon] || <Dumbbell className="w-6 h-6" />}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-bold text-foreground">{classItem.name}</h3>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${availability.bg} ${availability.text}`}>
              {availability.label}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] text-muted">
            <span className="flex items-center gap-1"><Calendar size={13} />{formattedDate}</span>
            <span className="flex items-center gap-1"><Clock size={13} />{classItem.time}</span>
            <span className="flex items-center gap-1"><Timer size={13} />{classItem.duration}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xl font-black text-blue-600">S/ {Number(classItem.price || 0).toFixed(2)}</p>
            <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
              <span className="flex items-center gap-1"><Users size={14} />{classItem.availableSpots} cupos</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default ClassCard;

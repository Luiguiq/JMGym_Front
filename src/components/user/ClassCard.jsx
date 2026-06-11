import { useNavigate } from 'react-router-dom';
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
  if (availableSpots === 0) return { label: 'Completo', dot: 'bg-red-500', text: 'text-red-600' };
  if (availableSpots <= 5) return { label: 'Pocos cupos', dot: 'bg-amber-500', text: 'text-amber-600' };
  return { label: 'Disponible', dot: 'bg-emerald-500', text: 'text-emerald-600' };
}

function getIntensityMeta(level = '') {
  const v = level.toUpperCase();
  if (v === 'ALTA') return { label: 'Alta', text: 'text-red-600' };
  if (v === 'BAJA') return { label: 'Baja', text: 'text-emerald-600' };
  return { label: 'Media', text: 'text-amber-600' };
}

function ClassCard({ classItem }) {
  const navigate = useNavigate();
  const image = getClassImage(classItem.name);
  const availability = getAvailabilityMeta(Number(classItem.availableSpots || 0));
  const intensity = getIntensityMeta(classItem.level);
  const formattedDate = classItem.date
    ? new Date(classItem.date + 'T00:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
    : 'Próximamente';

  return (
    <button
      onClick={() => navigate(`/cliente/clases/${classItem.id}`)}
      className="w-full rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-slate-100 transition hover:ring-2 hover:ring-brand-200 sm:p-4"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20">
          {image ? (
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-400 to-brand-600 text-2xl text-white sm:text-3xl">
              {classItem.icon || '💪'}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-black text-slate-800 sm:text-lg">{classItem.name}</h3>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${availability.text} bg-slate-50`}>
              <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${availability.dot}`} />
              {availability.label}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
            <span>📅 {formattedDate}</span>
            <span>🕗 {classItem.time}</span>
            <span>⏱ {classItem.duration}</span>
            <span className={`font-bold ${intensity.text}`}>🔥 {intensity.label}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <p className="text-lg font-black text-[#004aab] sm:text-xl">S/ {Number(classItem.price || 0).toFixed(2)}</p>
            <p className="text-xs text-slate-400">👥 {classItem.availableSpots} cupos</p>
          </div>
        </div>
      </div>
    </button>
  );
}

export default ClassCard;
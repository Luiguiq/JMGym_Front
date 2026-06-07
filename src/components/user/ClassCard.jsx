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
  const normalizedName = className.toLowerCase().replace(/\s+/g, ' ').trim();
  return classImages.find(({ match }) => normalizedName.includes(match))?.image;
}

function getAvailabilityMeta(availableSpots = 0) {
  if (availableSpots === 0) {
    return {
      label: 'Completo',
      bg: 'bg-red-50',
      text: 'text-red-600',
      dot: 'bg-red-500',
    };
  }

  if (availableSpots <= 5) {
    return {
      label: 'Pocos cupos',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      dot: 'bg-amber-500',
    };
  }

  return {
    label: 'Disponible',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    dot: 'bg-emerald-500',
  };
}

function getIntensityMeta(level = '') {
  const value = level.toUpperCase();

  if (value === 'ALTA') {
    return {
      label: 'Alta',
      bg: 'bg-red-50',
      text: 'text-red-600',
    };
  }

  if (value === 'BAJA') {
    return {
      label: 'Baja',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
    };
  }

  return {
    label: 'Media',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
  };
}

function ClassCard({ classItem }) {
  const navigate = useNavigate();

  const image = getClassImage(classItem.name);

  const availability = getAvailabilityMeta(
    Number(classItem.availableSpots || 0)
  );

  const intensity = getIntensityMeta(classItem.level);

  const formattedDate = classItem.date
    ? new Date(classItem.date + 'T00:00:00').toLocaleDateString(
        'es-PE',
        {
          day: '2-digit',
          month: 'short',
        }
      )
    : 'Próximamente';

  return (
    <article className="overflow-hidden rounded-[32px] bg-white shadow-[0_16px_40px_rgba(15,23,42,.08)] ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,23,42,.12)]">
      
      <div className="relative h-52 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={classItem.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-500 to-brand-700" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute left-4 top-4 flex gap-2">

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${intensity.bg} ${intensity.text}`}
          >
            🔥 {intensity.label}
          </span>

          <span
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${availability.bg} ${availability.text}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${availability.dot}`}
            />
            {availability.label}
          </span>

        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-3xl font-black">
            {classItem.name}
          </h3>

          <p className="text-sm text-white/90">
            Instructor: {classItem.trainer}
          </p>
        </div>
      </div>

      <div className="p-5">

        <div className="grid grid-cols-2 gap-3">

          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs text-slate-400">Fecha</p>
            <p className="font-bold text-slate-700">
              📅 {formattedDate}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs text-slate-400">Hora</p>
            <p className="font-bold text-slate-700">
              🕗 {classItem.time}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs text-slate-400">Duración</p>
            <p className="font-bold text-slate-700">
              ⏱ {classItem.duration}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs text-slate-400">Cupos</p>
            <p className="font-bold text-slate-700">
              👥 {classItem.availableSpots}
            </p>
          </div>

        </div>

        <div className="mt-4 flex items-center justify-between">

          <div>
            <p className="text-xs text-slate-400">
              Precio
            </p>

            <p className="text-2xl font-black text-[#004aab]">
              S/ {Number(classItem.price || 0).toFixed(2)}
            </p>
          </div>

          <button
            onClick={() =>
              navigate(`/cliente/clases/${classItem.id}`)
            }
            className="rounded-2xl bg-[#004aab] px-5 py-3 font-bold text-white transition hover:bg-[#00398a]"
          >
            Ver detalles →
          </button>

        </div>
      </div>
    </article>
  );
}

export default ClassCard;
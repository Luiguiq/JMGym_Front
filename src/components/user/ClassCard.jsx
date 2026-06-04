import { useNavigate } from 'react-router-dom';
import cardioImage from '../../assets/images/cardio.jpg';
import trenSuperiorImage from '../../assets/images/trensuperior.jpg';
import zumbaImage from '../../assets/images/zumba.jpg';

const visualStyles = {
  orange: 'from-orange-400 to-orange-600',
  blue: 'from-sky-400 to-blue-600',
};

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

function ClassCard({ classItem }) {
  const navigate = useNavigate();
  const gradient = visualStyles[classItem.color] ?? visualStyles.blue;
  const classImage = getClassImage(classItem.name);

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_32px_rgba(33,45,58,0.11)] md:grid md:min-h-56 md:grid-cols-[0.78fr_1fr]">
      <div className={`relative grid min-h-36 place-items-center overflow-hidden bg-gradient-to-br ${gradient} md:min-h-full`}>
        {classImage ? (
          <img
            src={classImage}
            alt={`Persona realizando ${classItem.name}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <span className="text-6xl drop-shadow-xl md:text-7xl" aria-hidden="true">{classItem.icon}</span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent" aria-hidden="true" />
        <span className="absolute left-3 top-3 rounded-full bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-700 md:left-5 md:top-5 md:text-sm">
          {classItem.availableSpots} cupos
        </span>
      </div>

      <div className="grid content-center p-4 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-2xl font-bold text-stone-700 md:text-3xl">{classItem.name}</h3>
          <span aria-hidden="true">🌶️</span>
        </div>
        <p className="mt-2 leading-relaxed text-slate-500 md:text-base">
          👩‍🏫 Prof. {classItem.trainer} · ⏰ {classItem.time} · ⏱️ {classItem.duration}
        </p>
        <div className="mb-4 mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-extrabold text-slate-500">🔥 {classItem.level}</span>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-extrabold text-slate-500">👥 {classItem.reserved}/{classItem.capacity}</span>
        </div>
        <button className="min-h-12 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 font-extrabold text-white md:min-h-14 md:text-lg" type="button" onClick={() => navigate(`/cliente/clases/${classItem.id}`)}>
          Ver detalles
        </button>
      </div>
    </article>
  );
}

export default ClassCard;

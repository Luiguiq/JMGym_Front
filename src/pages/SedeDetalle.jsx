import { CalendarDays, Clock, Mail, MapPin, MessageCircle } from 'lucide-react';
import PublicFooter from '../components/common/PublicFooter.jsx';
import PublicHeader from '../components/common/PublicHeader.jsx';
import cardioImage from '../assets/images/cardio.jpg';

const gymAddress = 'Av. Conde de Lemos 420, Callao 07006';
const gymWhatsapp = '999 999 999';
const gymEmail = 'contacto@jmgym.com';
const gymMapUrl = 'https://www.google.com/maps?q=Av.%20Conde%20de%20Lemos%20420%2C%20Callao%2007006&output=embed';
const gymMapExternalUrl = 'https://www.google.com/maps/search/?api=1&query=Av.%20Conde%20de%20Lemos%20420%2C%20Callao%2007006';

const schedules = [
  {
    label: 'Lunes a Viernes',
    time: '6:00 AM - 11:00 PM',
  },
  {
    label: 'Sabado',
    time: '8:00 AM - 6:00 PM',
  },
  {
    label: 'Domingo',
    time: '9:00 AM - 3:00 PM',
  },
];

function SedeDetalle() {
  return (
    <main className="min-h-screen bg-surface text-foreground">
      <PublicHeader subtitle="Sede Callao" />

      <div className="animate-page-enter">

      <section
        className="relative grid min-h-44 place-items-center overflow-hidden bg-[#07111f] bg-cover bg-center px-5 py-16 text-center text-primary-foreground lg:min-h-56"
        style={{ backgroundImage: `linear-gradient(110deg, rgba(7, 17, 31, .92), rgba(8, 47, 73, .72), rgba(7, 17, 31, .86)), url(${cardioImage})` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,.2),transparent_30%)]" />
        <h1 className="relative z-10 text-4xl font-black uppercase tracking-[0.14em] drop-shadow-[0_8px_24px_rgba(0,0,0,.45)] md:text-5xl">
          Sede Central
        </h1>
      </section>

      <section className="px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
          <div className="overflow-hidden rounded-[34px] border border-primary-foreground bg-border-light shadow-[0_24px_70px_rgba(7,17,31,.16)]">
            <img
              src={cardioImage}
              alt="Entrenamiento en JMGym Callao"
              className="h-[360px] w-full object-cover md:h-[520px]"
            />
          </div>

          <div className="rounded-[34px] bg-card p-7 text-lg leading-8 shadow-[0_24px_70px_rgba(7,17,31,.08)] lg:p-8">
            <div className="space-y-5 text-foreground">
              <p className="flex items-start gap-3">
                <MapPin className="mt-1 h-6 w-6 shrink-0 text-cyan-500" aria-hidden="true" />
                <span>
                {gymAddress}, Callao
                </span>
              </p>
              <p className="flex items-start gap-3">
                <MessageCircle className="mt-1 h-6 w-6 shrink-0 text-cyan-500" aria-hidden="true" />
                <span>
                {gymWhatsapp}
                </span>
              </p>
              <p className="flex items-start gap-3">
                <Mail className="mt-1 h-6 w-6 shrink-0 text-cyan-500" aria-hidden="true" />
                <span>
                {gymEmail}
                </span>
              </p>
            </div>

            <p className="mt-7 max-w-2xl leading-8 text-secondary">
              En Callao, esta sede te espera con espacios comodos y funcionales, pensados para que disfrutes el entrenamiento y avances acompanado. Porque aqui, entrenamos juntos.
            </p>

            <h2 className="mt-9 text-2xl font-black uppercase tracking-[0.08em] text-foreground">
              Horarios
            </h2>

            <div className="mt-6 grid gap-8 md:grid-cols-3">
              {schedules.map((schedule) => (
                <div key={schedule.label}>
                  <p className="flex items-center gap-2 font-bold text-foreground">
                    <CalendarDays className="h-5 w-5 shrink-0 text-cyan-500" aria-hidden="true" />
                    {schedule.label}
                  </p>
                  <p className="mt-3 flex items-center gap-2 text-base text-secondary">
                    <Clock className="h-5 w-5 shrink-0 text-cyan-500" aria-hidden="true" />
                    {schedule.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-black uppercase tracking-[0.08em] text-foreground md:text-5xl">
              Ubicanos
            </h2>
            <a
              href={gymMapExternalUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full bg-[#07111f] px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-primary-foreground transition hover:bg-brand-700"
            >
              Abrir en Google Maps
            </a>
          </div>

          <div className="overflow-hidden rounded-[30px] border border-border bg-border-light shadow-[0_24px_70px_rgba(7,17,31,.14)]">
            <iframe
              title="Mapa de JMGym Callao"
              src={gymMapUrl}
              className="h-[360px] w-full border-0 md:h-[520px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
      </div>
      <PublicFooter />
    </main>
  );
}

export default SedeDetalle;

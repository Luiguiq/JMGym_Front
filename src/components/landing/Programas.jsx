import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User, MapPin, X } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { Drawer } from 'vaul';
import trenSuperiorImage from '../../assets/images/trensuperior.jpg';
import cardioImage from '../../assets/images/cardio.jpg';
import zumbaImage from '../../assets/images/zumba.jpg';

const programs = [
  {
    title: 'Strength',
    text: 'Entrenamientos de fuerza para construir masa muscular, técnica y confianza en cada sesión.',
    image: trenSuperiorImage,
    color: 'from-blue-500 to-blue-700',
  },
  {
    title: 'Cardio Burn',
    text: 'Sesiones dinámicas para elevar tu resistencia, acelerar tu energía y mejorar tu condición física.',
    image: cardioImage,
    color: 'from-red-500 to-red-700',
  },
  {
    title: 'Dance Fit',
    text: 'Ritmo, coordinación y movimiento para entrenar con intensidad sin perder la diversión.',
    image: zumbaImage,
    color: 'from-pink-500 to-purple-600',
  },
  {
    title: 'Yoga & Flexibilidad',
    text: 'Estira, respira y conecta con tu cuerpo. Ideal para complementar tu rutina de fuerza.',
    image: trenSuperiorImage,
    color: 'from-green-500 to-emerald-700',
  },
];

const schedules = {
  Strength: [
    { day: 'Lunes', time: '09:00 - 10:00', instructor: 'Luis Martinez', space: 'Sala Pesas', spots: 5 },
    { day: 'Miercoles', time: '09:00 - 10:00', instructor: 'Luis Martinez', space: 'Sala Pesas', spots: 3 },
    { day: 'Viernes', time: '09:00 - 10:00', instructor: 'Luis Martinez', space: 'Sala Pesas', spots: 7 },
    { day: 'Martes', time: '18:00 - 19:00', instructor: 'Carlos Perez', space: 'Sala Principal', spots: 2 },
    { day: 'Jueves', time: '18:00 - 19:00', instructor: 'Carlos Perez', space: 'Sala Principal', spots: 4 },
  ],
  'Cardio Burn': [
    { day: 'Martes', time: '07:00 - 07:45', instructor: 'Maria Lopez', space: 'Sala B', spots: 8 },
    { day: 'Jueves', time: '07:00 - 07:45', instructor: 'Maria Lopez', space: 'Sala B', spots: 6 },
    { day: 'Lunes', time: '11:00 - 11:45', instructor: 'Maria Lopez', space: 'Sala B', spots: 2 },
    { day: 'Miercoles', time: '11:00 - 11:45', instructor: 'Maria Lopez', space: 'Sala B', spots: 4 },
    { day: 'Viernes', time: '11:00 - 11:45', instructor: 'Maria Lopez', space: 'Sala B', spots: 5 },
  ],
  'Dance Fit': [
    { day: 'Lunes', time: '17:00 - 17:50', instructor: 'Ana Torres', space: 'Sala C', spots: 12 },
    { day: 'Miercoles', time: '17:00 - 17:50', instructor: 'Ana Torres', space: 'Sala C', spots: 10 },
    { day: 'Viernes', time: '17:00 - 17:50', instructor: 'Ana Torres', space: 'Sala C', spots: 15 },
    { day: 'Sabado', time: '10:00 - 10:50', instructor: 'Ana Torres', space: 'Sala C', spots: 8 },
  ],
  'Yoga & Flexibilidad': [
    { day: 'Lunes', time: '07:00 - 07:55', instructor: 'Sofia Garcia', space: 'Sala A', spots: 6 },
    { day: 'Jueves', time: '07:00 - 07:55', instructor: 'Sofia Garcia', space: 'Sala A', spots: 4 },
    { day: 'Sabado', time: '09:00 - 09:55', instructor: 'Sofia Garcia', space: 'Sala A', spots: 3 },
    { day: 'Domingo', time: '09:00 - 09:55', instructor: 'Sofia Garcia', space: 'Sala A', spots: 5 },
  ],
};

function ScheduleDrawer({ program, open, onClose }) {
  const items = schedules[program] || [];

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/60" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-h-[70vh] max-w-lg rounded-t-[24px] bg-[#111418] text-primary-foreground outline-none">
          <div className="flex flex-col overflow-hidden">
            <div className="shrink-0 px-5 pb-2 pt-4">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-primary-foreground/20" />
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black">{program}</h3>
                <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/10" aria-label="Cerrar">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-0.5 text-xs text-primary-foreground/50">Horarios disponibles esta semana</p>
            </div>

            <div className="overflow-y-auto px-5 pb-5">
              <div className="grid gap-2">
                {items.map((item, i) => (
                  <div key={i} className="rounded-[16px] border border-primary-foreground/10 bg-primary-foreground/5 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-cyan-200">{item.day}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${item.spots > 5 ? 'bg-green-500/20 text-green-300' : item.spots > 2 ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>
                        {item.spots} libres
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-primary-foreground/70">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-cyan-200" />
                        {item.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-cyan-200" />
                        {item.instructor}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-cyan-200" />
                        {item.space}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/cliente/login"
                onClick={onClose}
                className="mt-4 flex h-[48px] w-full items-center justify-center rounded-xl bg-[#3b82f6] text-sm font-black uppercase tracking-[0.16em] text-primary-foreground transition hover:bg-[#3b82f6]/80"
              >
                Reservar ahora
              </Link>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function Programas() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', skipSnaps: false });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <section id="programas" className="relative overflow-hidden px-5 py-20 lg:px-8">
      <div className="absolute inset-0 bg-[#07111f]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(34,211,238,.12),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(37,99,235,.1),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-200">Nuestras clases</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.04em] text-primary-foreground lg:text-6xl lg:mt-4 lg:tracking-[-0.05em]">
              Programas para entrenar con dirección
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground transition hover:bg-[#3b82f6] hover:text-primary-foreground disabled:opacity-30"
              aria-label="Anterior"
            >
              <span className="text-lg">←</span>
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground transition hover:bg-[#3b82f6] hover:text-primary-foreground disabled:opacity-30"
              aria-label="Siguiente"
            >
              <span className="text-lg">→</span>
            </button>
          </div>
        </motion.div>

        <div className="mt-10 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {programs.map((program) => (
              <motion.div
                key={program.title}
                className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <article className="group overflow-hidden rounded-[34px] border border-primary-foreground/10 bg-primary-foreground/8">
                  <div className="overflow-hidden">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-7">
                    <h3 className="text-2xl font-black text-primary-foreground sm:text-3xl">{program.title}</h3>
                    <p className="mt-4 leading-7 text-primary-foreground/68">{program.text}</p>
                    <button
                      onClick={() => setSelectedProgram(program.title)}
                      className="mt-6 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#3b82f6]/20 px-6 text-sm font-bold uppercase tracking-[0.12em] text-cyan-200 transition hover:bg-[#3b82f6] hover:text-primary-foreground sm:w-auto sm:rounded-full sm:px-5"
                    >
                      Ver horarios
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2 sm:hidden">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground disabled:opacity-30"
            aria-label="Anterior"
          >
            ←
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground disabled:opacity-30"
            aria-label="Siguiente"
          >
            →
          </button>
        </div>
      </div>

      <ScheduleDrawer
        program={selectedProgram}
        open={!!selectedProgram}
        onClose={() => setSelectedProgram(null)}
      />
    </section>
  );
}

export default Programas;

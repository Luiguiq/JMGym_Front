import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  { name: 'Luis García', role: 'Cliente', text: 'Excelente ambiente, los instructores son muy profesionales. La plataforma de reservas es súper práctica.', rating: 5 },
  { name: 'María Torres', role: 'Cliente', text: 'Desde que empecé en JMGym noté un cambio increíble en mi condición física. 100% recomendado.', rating: 5 },
  { name: 'Carlos Mendoza', role: 'Cliente', text: 'La facilidad de reservar desde el celular me hace no faltar nunca. El sistema es muy intuitivo.', rating: 5 },
  { name: 'Ana Castillo', role: 'Cliente', text: 'Me encanta la variedad de clases. Zumba, cardio, fuerza... siempre hay algo nuevo que probar.', rating: 4 },
  { name: 'Pedro Silva', role: 'Cliente', text: 'El mejor gimnasio de Callao. Instalaciones limpias, buen ambiente y excelente atención.', rating: 5 },
];

function Testimonios() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

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
    <section className="bg-[#07111f] px-5 py-20 text-slate-100 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-brand-600">Testimonios</p>
            <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-[-0.04em] sm:text-6xl sm:mt-4">
              Lo que dicen nuestros alumnos
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 text-slate-500 transition hover:bg-brand-600 hover:text-white disabled:opacity-30"
              aria-label="Anterior"
            >
              <span className="text-lg">←</span>
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 text-slate-500 transition hover:bg-brand-600 hover:text-white disabled:opacity-30"
              aria-label="Siguiente"
            >
              <span className="text-lg">→</span>
            </button>
          </div>
        </motion.div>

        <div className="mt-10 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <article className="flex h-full flex-col rounded-[28px] bg-slate-800 p-7 shadow-[0_12px_40px_rgba(15,23,42,.06)]">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`h-5 w-5 ${j < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                      />
                    ))}
                  </div>
                  <p className="mt-5 flex-1 leading-7 text-slate-300">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-slate-100">{t.name}</p>
                      <p className="text-sm text-slate-400">{t.role}</p>
                    </div>
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-500 disabled:opacity-30"
          >
            ←
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-500 disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

export default Testimonios;

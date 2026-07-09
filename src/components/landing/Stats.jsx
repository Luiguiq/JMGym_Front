import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Users, Calendar, Heart, Star } from 'lucide-react';

const stats = [
  { value: 500, suffix: '+', label: 'Clientes activos', icon: Users },
  { value: 15, suffix: '', label: 'Clases disponibles', icon: Calendar },
  { value: 98, suffix: '%', label: 'Asistencia', icon: Heart },
  { value: 4.9, suffix: '★', label: 'Calificacion', icon: Star },
];

function AnimatedNumber({ value, suffix }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let startTime;
    const duration = 2000;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setDisplay(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#07111f] px-5 py-16 text-slate-100 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center gap-5 rounded-[28px] bg-slate-800 p-6 shadow-lg"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-brand-50 text-brand-600">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-black leading-none tracking-tight">
                    {inView ? <AnimatedNumber value={stat.value} suffix={stat.suffix} /> : '0'}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Stats;

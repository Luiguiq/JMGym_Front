import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, Smartphone, Trophy } from 'lucide-react';
import trenSuperiorImage from '../../assets/images/trensuperior.jpg';
import cardioImage from '../../assets/images/cardio.jpg';

const reasons = [
  { icon: Shield, title: 'Plataforma segura', text: 'Reserva tus clases con total confianza desde cualquier dispositivo.' },
  { icon: Zap, title: 'Reserva express', text: 'Encuentra y aparta tu espacio en menos de un minuto.' },
  { icon: Smartphone, title: 'Todo desde tu celular', text: 'Gestiona tus entrenamientos, pagos e historial desde una app.' },
  { icon: Trophy, title: 'Resultados reales', text: 'Programas diseñados para que veas progreso en cada sesión.' },
];

function WhyJMGym() {
  return (
    <section className="relative overflow-hidden px-5 py-20 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,.18),transparent_30%),radial-gradient(circle_at_78%_0%,rgba(37,99,235,.22),transparent_32%)]" />
      <div className="absolute inset-0 bg-[#07111f]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex rounded-full border border-cyan-200/30 bg-primary-foreground/8 px-5 py-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-100">
              ¿Por qué JMGym?
            </span>
            <h2 className="mt-5 max-w-4xl font-serif text-4xl font-black leading-[0.9] tracking-[-0.04em] text-primary-foreground sm:text-6xl sm:mt-7 lg:text-7xl lg:leading-[0.88] lg:tracking-[-0.06em]">
              Más que un gimnasio,<br />una experiencia
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-primary-foreground/72">
              Integramos entrenamiento en sala con una plataforma digital para que reserves, pagues y sigas tu progreso desde un solo lugar.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {reasons.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.title} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#3b82f6]/20 text-cyan-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary-foreground">{r.title}</h3>
                      <p className="mt-1 text-sm text-primary-foreground/60">{r.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-[42px] border border-primary-foreground/10 bg-primary-foreground/8 p-4 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <img src={trenSuperiorImage} alt="Entrenamiento de fuerza" className="h-72 w-full rounded-[32px] object-cover sm:h-[440px]" />
              <div className="grid gap-4">
                <img src={cardioImage} alt="Cardio" className="h-52 w-full rounded-[32px] object-cover" />
                <div className="rounded-[32px] bg-[#3b82f6] p-7 text-primary-foreground">
                  <p className="text-sm font-black uppercase tracking-[0.22em]">JMGym 360</p>
                  <p className="mt-4 text-3xl font-black leading-none">Reserva, entrena y evoluciona.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default WhyJMGym;

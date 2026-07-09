import { motion } from 'framer-motion';
import { Search, CalendarCheck, Dumbbell, History } from 'lucide-react';

const steps = [
  { icon: Search, title: 'Explora las clases', text: 'Navega por nuestra oferta de clases y encuentra la que se ajuste a tus objetivos.' },
  { icon: CalendarCheck, title: 'Reserva en segundos', text: 'Selecciona el horario y reserva tu espacio con solo un par de clics.' },
  { icon: Dumbbell, title: 'Entrena', text: 'Llega al gimnasio, presenta tu código QR y disfruta de tu clase.' },
  { icon: History, title: 'Consulta tu historial', text: 'Revisa tus reservas, pagos y progreso desde cualquier dispositivo.' },
];

const connectors = ['→', '→', '→'];

function HowItWorks() {
  return (
    <section className="relative overflow-hidden px-5 py-20 lg:px-8">
      <div className="absolute inset-0 bg-[#07111f]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,211,238,.08),transparent_30%),radial-gradient(circle_at_70%_50%,rgba(37,99,235,.1),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex rounded-full border border-cyan-200/30 bg-primary-foreground/8 px-5 py-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-100">
            Cómo funciona
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-primary-foreground sm:text-6xl sm:mt-6 lg:text-6xl">
            De la reserva al entrenamiento
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-8 md:grid-cols-4 md:gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#3b82f6]/20 text-cyan-200">
                    <Icon className="h-9 w-9" />
                  </div>
                  <span className="mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#3b82f6] text-sm font-black text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-xl font-black text-primary-foreground">{step.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-primary-foreground/60">{step.text}</p>
                </motion.div>
                {i < connectors.length && (
                  <div className="absolute -right-2 top-10 hidden text-3xl text-cyan-200/30 md:block">
                    {connectors[i]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

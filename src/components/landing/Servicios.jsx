import { motion } from 'framer-motion';
import { Dumbbell, Users, CalendarCheck, LineChart, Sparkles, HeartPulse } from 'lucide-react';

const services = [
  { icon: Dumbbell, title: 'Plan de entrenamiento', text: 'Rutinas organizadas para avanzar con objetivos claros y sesiones pensadas para tu nivel.' },
  { icon: Users, title: 'Clases grupales', text: 'Entrena con energía, acompañamiento y una agenda variada de actividades durante la semana.' },
  { icon: CalendarCheck, title: 'Reserva de espacios', text: 'Gestiona tu asistencia desde el sistema digital y asegura tu espacio antes de llegar al gimnasio.' },
  { icon: LineChart, title: 'Seguimiento fitness', text: 'Mantente conectado con tus clases, reservas y próximos entrenamientos desde cualquier dispositivo.' },
  { icon: HeartPulse, title: 'Personal trainer', text: 'Asesoría personalizada para maximizar tus resultados con un profesional dedicado.' },
  { icon: Sparkles, title: 'Comunidad JMGym', text: 'Forma parte de una comunidad activa que te motiva a superar tus límites cada día.' },
];

function Servicios() {
  return (
    <section id="servicios" className="bg-[#07111f] px-5 py-20 text-slate-100 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-black uppercase tracking-[0.24em] text-brand-600">Servicios</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-6xl sm:mt-4 lg:text-6xl">
            Todo lo que necesitas para entrenar mejor
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group rounded-[28px] bg-slate-800 p-7 shadow-[0_12px_40px_rgba(15,23,42,.06)] transition-shadow hover:shadow-[0_20px_60px_rgba(15,23,42,.12)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-brand-50 text-brand-600 transition group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-6 h-1.5 w-12 rounded-full bg-brand-500" />
                <h3 className="mt-5 text-2xl font-black">{service.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{service.text}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Servicios;

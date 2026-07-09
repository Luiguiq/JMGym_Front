import { motion } from 'framer-motion';
import { Smartphone, Calendar, User, CreditCard } from 'lucide-react';

const screens = [
  { icon: Smartphone, title: 'Home', desc: 'Vista general de tus clases y progreso', color: 'from-cyan-400 to-blue-500' },
  { icon: Calendar, title: 'Clases', desc: 'Explora y reserva en segundos', color: 'from-blue-500 to-indigo-500' },
  { icon: CreditCard, title: 'Pagos', desc: 'Historial y métodos de pago', color: 'from-indigo-500 to-purple-500' },
  { icon: User, title: 'Perfil', desc: 'Tu información y estadísticas', color: 'from-purple-500 to-pink-500' },
];

function AppShowcase() {
  return (
    <section className="bg-slate-800 px-5 py-20 text-slate-100 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex rounded-full border border-brand-200/30 bg-brand-50 px-5 py-2 text-xs font-black uppercase tracking-[0.28em] text-brand-600">
            Plataforma digital
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl sm:mt-6 lg:text-7xl">
            Reserva desde tu <span className="text-brand-600">celular</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Toda la experiencia JMGym en la palma de tu mano. Reserva clases, consulta tu historial y mantente al día.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {screens.map((screen, i) => {
            const Icon = screen.icon;
            return (
              <motion.div
                key={screen.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <div className={`rounded-[32px] bg-gradient-to-br ${screen.color} p-1`}>
                  <div className="rounded-[30px] bg-slate-800 p-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-brand-50 text-brand-600 transition group-hover:scale-110">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 text-2xl font-black">{screen.title}</h3>
                    <p className="mt-2 text-slate-300">{screen.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 max-w-2xl rounded-[28px] border border-slate-700 bg-[#07111f] p-6 text-center"
        >
          <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Próximamente en</p>
          <div className="mt-3 flex items-center justify-center gap-8">
            <span className="flex items-center gap-2 text-lg font-black text-slate-100">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              App Store
            </span>
            <span className="flex items-center gap-2 text-lg font-black text-slate-100">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>
              Google Play
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AppShowcase;

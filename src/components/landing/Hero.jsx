import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroBackgroundImage from '../../assets/images/jmworkoutparatras.jpg';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';

function Hero() {
  return (
    <section
      id="inicio"
      className="relative grid min-h-dvh place-items-center overflow-hidden bg-cover bg-center px-5 py-16 text-center md:min-h-screen"
      style={{ backgroundImage: `linear-gradient(110deg, rgba(7,17,31,.92), rgba(8,47,73,.58), rgba(7,17,31,.94)), url(${heroBackgroundImage})` }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(34,211,238,.22),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(37,99,235,.28),transparent_32%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07111f] to-transparent" />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-[44px] bg-[#3b82f6]/35 blur-3xl" />
          <img
            src={logoJmGym}
            alt="JMGym"
            className="relative h-20 w-20 rounded-[28px] bg-slate-800 object-contain p-3 shadow-[0_28px_90px_rgba(34,211,238,.24)] sm:h-28 sm:w-28 sm:rounded-[36px] sm:p-4"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 max-w-5xl text-4xl font-black uppercase leading-none tracking-[0.06em] text-primary-foreground drop-shadow-[0_14px_40px_rgba(0,0,0,.35)] sm:text-5xl sm:mt-8 lg:text-7xl lg:tracking-[0.08em]"
        >
          Supera tus{' '}
          <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">límites</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4 max-w-2xl text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100/80 sm:mt-6 sm:text-base sm:tracking-[0.28em]"
        >
          Entrena con energía, reserva con claridad
        </motion.p>

        <div className="mt-8 sm:mt-10">
          <Link
            to="/cliente/login"
            className="inline-flex h-[52px] w-full items-center justify-center rounded-xl bg-[#3b82f6] px-10 text-sm font-black uppercase tracking-[0.16em] text-primary-foreground shadow-[0_18px_48px_rgba(34,211,238,.22)] transition hover:-translate-y-1 hover:bg-slate-800 hover:text-slate-100 active:scale-95 sm:w-auto sm:rounded-full"
          >
            Comienza gratis
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;

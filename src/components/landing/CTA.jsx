import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function CTA() {
  return (
    <section className="px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[42px] bg-gradient-to-br from-[#0a4fb9] via-[#1364d2] to-[#2490e5] p-8 text-primary-foreground lg:p-14"
        >
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-200">Empieza hoy</p>
              <h2 className="mt-4 max-w-xl text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                ¿Listo para entrenar?
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-7 text-primary-foreground/85">
                Reserva tu primera clase y descubre por qué más de 500 alumnos entrenan con nosotros.
              </p>
              <Link
                to="/cliente/registro"
                className="mt-8 inline-flex h-[52px] w-full items-center justify-center gap-3 rounded-xl bg-slate-800 px-8 text-sm font-black uppercase tracking-[0.16em] text-slate-100 shadow-lg transition hover:-translate-y-1 hover:bg-[#07111f] sm:w-auto sm:rounded-full"
              >
                Reserva tu primera clase
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="rounded-[32px] border border-primary-foreground/15 bg-primary-foreground/10 p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-black">¿Ya eres miembro?</h3>
              <p className="mt-2 text-primary-foreground/80">
                Inicia sesión para gestionar tus reservas, ver tu historial y seguir entrenando.
              </p>
              <Link
                to="/cliente/login"
                className="mt-6 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-primary-foreground/30 px-8 text-sm font-bold uppercase tracking-[0.14em] text-primary-foreground/90 transition hover:border-cyan-200 hover:bg-primary-foreground/10 sm:w-auto sm:rounded-full"
              >
                Iniciar sesión
                <span aria-hidden="true" className="text-lg">→</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTA;

import { IdCard, MessageCircle, Phone, User } from 'lucide-react';
import PublicFooter from '../components/common/PublicFooter.jsx';
import PublicHeader from '../components/common/PublicHeader.jsx';
import heroBackgroundImage from '../assets/images/jmworkoutport2.jpg';

const gymAddress = 'Av. Conde de Lemos 420, Callao 07006';

function Contacto() {
  return (
    <main className="min-h-screen bg-card text-foreground">
      <PublicHeader subtitle="Contacto" />

      <div className="animate-page-enter">
        <section
          className="relative grid min-h-52 place-items-center overflow-hidden bg-[#07111f] bg-cover bg-center px-5 py-16 text-center text-primary-foreground lg:min-h-64"
          style={{ backgroundImage: `linear-gradient(110deg, rgba(7,17,31,.9), rgba(8,47,73,.62), rgba(7,17,31,.88)), url(${heroBackgroundImage})` }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,.22),transparent_32%)]" />
          <h1 className="relative z-10 text-5xl font-black uppercase tracking-[0.12em] drop-shadow-[0_10px_30px_rgba(0,0,0,.45)] md:text-6xl">
            Contacto
          </h1>
        </section>

        <section className="px-5 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-brand-700">Estamos para ayudarte</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-5xl">
              Contactanos por WhatsApp
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-secondary">
              Dejanos tus datos y nuestro equipo te orientara sobre clases, horarios, reservas y servicios disponibles en JMGym Callao.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-4xl">
            <form className="rounded-[38px] bg-card p-6 shadow-[0_24px_80px_rgba(7,17,31,.1)] ring-1 ring-border lg:p-8">
              <div className="grid gap-5">
                <label className="group relative block">
                  <User className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition group-focus-within:text-cyan-500" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Nombres"
                    className="w-full rounded-[24px] border border-border bg-card py-5 pl-14 pr-5 text-lg outline-none transition placeholder:text-muted-foreground focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                  />
                </label>

                <label className="group relative block">
                  <User className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition group-focus-within:text-cyan-500" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Apellidos"
                    className="w-full rounded-[24px] border border-border bg-card py-5 pl-14 pr-5 text-lg outline-none transition placeholder:text-muted-foreground focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                  />
                </label>

                <label className="group relative block">
                  <IdCard className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition group-focus-within:text-cyan-500" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="DNI"
                    className="w-full rounded-[24px] border border-border bg-card py-5 pl-14 pr-5 text-lg outline-none transition placeholder:text-muted-foreground focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                  />
                </label>

                <label className="group relative block">
                  <Phone className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition group-focus-within:text-cyan-500" aria-hidden="true" />
                  <input
                    type="tel"
                    placeholder="Celular"
                    className="w-full rounded-[24px] border border-border bg-card py-5 pl-14 pr-5 text-lg outline-none transition placeholder:text-muted-foreground focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                  />
                </label>

                <div className="rounded-[24px] border border-border bg-surface p-5 text-left">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-700">Sede</p>
                  <p className="mt-2 text-lg font-bold text-foreground">JMGym Callao</p>
                  <p className="mt-1 text-sm text-muted">{gymAddress}</p>
                </div>

                <textarea
                  rows="4"
                  placeholder="Mensaje opcional"
                  className="w-full resize-none rounded-[24px] border border-border bg-card p-5 text-lg outline-none transition placeholder:text-muted-foreground focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />

                <button
                  type="button"
                  className="group inline-flex items-center justify-center gap-3 rounded-[24px] bg-[#07111f] px-7 py-5 text-lg font-black text-primary-foreground transition hover:-translate-y-1 hover:bg-brand-700"
                >
                  <MessageCircle className="h-6 w-6 text-cyan-200 transition group-hover:scale-110" aria-hidden="true" />
                  Consultar
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      <PublicFooter />
    </main>
  );
}

export default Contacto;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';

function PublicHeader({ subtitle = 'Fitness club' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07111f]/85 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoJmGym}
              alt="Logo JMGym"
              className="h-12 w-12 rounded-2xl bg-white object-contain p-1 shadow-[0_10px_24px_rgba(34,211,238,.16)]"
            />
            <div>
              <strong className="block text-xl font-black leading-none">JMGym</strong>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">{subtitle}</span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="group grid h-12 w-12 place-items-center rounded-full border border-cyan-200/20 text-cyan-200 transition hover:border-cyan-200 hover:bg-white/8"
            aria-label="Abrir menu"
          >
            <span className="flex w-7 flex-col gap-1.5">
              <span className="h-0.5 rounded-full bg-current transition group-hover:translate-x-1" />
              <span className="h-0.5 rounded-full bg-current" />
              <span className="h-0.5 rounded-full bg-current transition group-hover:-translate-x-1" />
            </span>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-[#111418]/98 text-white transition-all duration-300 ease-out ${
          isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          onClick={closeMenu}
          className={`absolute right-6 top-6 z-20 grid h-14 w-14 place-items-center text-cyan-200 transition-all duration-300 hover:scale-105 hover:text-white ${
            isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
          }`}
          aria-label="Cerrar menu"
        >
          <span className="relative h-10 w-10">
            <span className="absolute left-1/2 top-1/2 h-0.5 w-10 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current" />
            <span className="absolute left-1/2 top-1/2 h-0.5 w-10 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
          </span>
        </button>

        <nav
          className={`relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 px-5 text-center text-3xl font-black transition-all duration-300 ease-out md:text-4xl ${
            isMenuOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-6 scale-[.98] opacity-0'
          }`}
        >
          <Link className="transition duration-200 hover:-translate-y-1 hover:text-cyan-200" to="/" onClick={closeMenu}>Inicio</Link>
          <Link className="transition duration-200 hover:-translate-y-1 hover:text-cyan-200" to="/nosotros" onClick={closeMenu}>Nosotros</Link>
          <Link className="transition duration-200 hover:-translate-y-1 hover:text-cyan-200" to="/sede" onClick={closeMenu}>Sedes</Link>
          <Link className="transition duration-200 hover:-translate-y-1 hover:text-cyan-200" to="/servicios" onClick={closeMenu}>Servicios</Link>
          <Link className="transition duration-200 hover:-translate-y-1 hover:text-cyan-200" to="/contacto" onClick={closeMenu}>Contacto</Link>
          <a className="transition duration-200 hover:-translate-y-1 hover:text-cyan-200" href="/#acceso" onClick={closeMenu}>Pase gratis</a>
        </nav>
      </div>
    </>
  );
}

export default PublicHeader;

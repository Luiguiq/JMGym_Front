import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer } from 'vaul';
import { X, Menu } from 'lucide-react';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';
import LoginSelector from '../common/LoginSelector.jsx';

function PublicHeader({ subtitle = 'Fitness club' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/sede', label: 'Sedes' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/contacto', label: 'Contacto' },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-primary-foreground/10 bg-[#07111f]/85 text-primary-foreground backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoJmGym}
              alt="Logo JMGym"
              className="h-10 w-10 rounded-xl bg-slate-800 object-contain p-1 shadow-[0_10px_24px_rgba(34,211,238,.16)] sm:h-12 sm:w-12"
            />
            <div>
              <strong className="block text-lg font-black leading-none sm:text-xl">JMGym</strong>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200 sm:text-xs">{subtitle}</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-primary-foreground/70 transition hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/cliente/login"
              className="rounded-full bg-[#3b82f6] px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_12px_32px_rgba(34,211,238,.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 hover:text-slate-100 sm:text-sm"
            >
              Reservar Clase
            </Link>
            <button
              onClick={() => setShowLogin(true)}
              className="rounded-full border border-primary-foreground/20 px-5 py-2.5 text-xs font-semibold text-primary-foreground/80 transition hover:border-cyan-200 hover:text-cyan-100 sm:text-sm"
            >
              Iniciar sesion
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200/20 text-cyan-200 transition hover:border-cyan-200 hover:bg-primary-foreground/8 md:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <Drawer.Root open={isMenuOpen} onOpenChange={setIsMenuOpen} direction="right">
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-black/60" />
          <Drawer.Content className="fixed bottom-0 right-0 top-0 z-50 flex w-[300px] flex-col bg-[#111418] text-primary-foreground outline-none">
            <div className="flex items-center justify-between border-b border-primary-foreground/10 px-6 py-5">
              <span className="text-lg font-black">Menu</span>
              <button
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center rounded-full text-cyan-200 transition hover:bg-primary-foreground/10"
                aria-label="Cerrar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 px-4 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className="rounded-2xl px-4 py-3 text-lg font-bold transition hover:bg-primary-foreground/10 hover:text-cyan-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t border-primary-foreground/10 px-4 py-6">
              <Link
                to="/cliente/login"
                onClick={closeMenu}
                className="flex h-[52px] w-full items-center justify-center rounded-xl bg-[#3b82f6] text-sm font-black uppercase tracking-[0.16em] text-white"
              >
                Reservar Clase
              </Link>
              <button
                onClick={() => { closeMenu(); setShowLogin(true); }}
                className="mt-3 flex h-[52px] w-full items-center justify-center rounded-xl border border-primary-foreground/20 text-sm font-semibold text-primary-foreground/80"
              >
                Iniciar sesion
              </button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <LoginSelector isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}

export default PublicHeader;

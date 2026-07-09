import { Link } from 'react-router-dom';
import { Music2, MessageCircle, MapPin, Clock, Camera, ThumbsUp } from 'lucide-react';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';

const gymAddress = 'Av. Conde de Lemos 420, Callao 07006';
const gymHours = 'Lun - Vie: 6:00 - 22:00 | Sab: 8:00 - 20:00 | Dom: 9:00 - 14:00';

const socialLinks = [
  { icon: Camera, href: '#', label: 'Instagram' },
  { icon: ThumbsUp, href: '#', label: 'Facebook' },
  { icon: Music2, href: '#', label: 'TikTok' },
  { icon: MessageCircle, href: '#', label: 'WhatsApp' },
];

function PublicFooter() {
  return (
    <footer className="border-t border-primary-foreground/10 bg-[#07111f] px-5 py-12 text-primary-foreground lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={logoJmGym} alt="Logo JMGym" className="h-12 w-12 rounded-2xl bg-slate-800 object-contain p-1" />
            <strong className="text-2xl font-black">JMGym</strong>
          </div>
          <p className="mt-4 max-w-sm text-primary-foreground/58">
            Gimnasio, clases y reservas digitales para una experiencia fitness mas clara.
          </p>
          <div className="mt-6 flex gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/15 text-primary-foreground/50 transition hover:border-cyan-200 hover:text-cyan-200"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">Enlaces</h3>
          <div className="mt-5 grid gap-3 text-primary-foreground/64">
            <Link to="/sede" className="transition hover:text-primary-foreground">Sede</Link>
            <a href="/#programas" className="transition hover:text-primary-foreground">Programas</a>
            <Link to="/servicios" className="transition hover:text-primary-foreground">Servicios</Link>
            <Link to="/contacto" className="transition hover:text-primary-foreground">Contacto</Link>
            <a href="/#faq" className="transition hover:text-primary-foreground">FAQ</a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">Contacto</h3>
          <div className="mt-5 grid gap-4 text-primary-foreground/64">
            <a href={`https://maps.google.com/?q=${encodeURIComponent(gymAddress)}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 transition hover:text-primary-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
              <span>{gymAddress}, Callao</span>
            </a>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
              <span>{gymHours}</span>
            </div>
            <a href="mailto:contacto@jmgym.com" className="transition hover:text-primary-foreground">
              contacto@jmgym.com
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">Horarios</h3>
          <div className="mt-5 grid gap-2 text-sm text-primary-foreground/64">
            <div className="flex justify-between">
              <span>Lun - Vie</span>
              <span className="font-semibold text-primary-foreground/80">6:00 - 22:00</span>
            </div>
            <div className="flex justify-between">
              <span>Sabado</span>
              <span className="font-semibold text-primary-foreground/80">8:00 - 20:00</span>
            </div>
            <div className="flex justify-between">
              <span>Domingo</span>
              <span className="font-semibold text-primary-foreground/80">9:00 - 14:00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 text-sm text-primary-foreground/42 sm:flex-row">
        <p>&copy; 2026 JMGym. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          <a href="#" className="transition hover:text-primary-foreground/60">Terminos</a>
          <a href="#" className="transition hover:text-primary-foreground/60">Privacidad</a>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;

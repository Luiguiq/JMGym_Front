import { Link } from 'react-router-dom';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';
import NotificationBell from './NotificationBell.jsx';

function Navbar() {
  return (
    <header className="flex items-center justify-between rounded-2xl border border-border bg-card/90 px-4 py-2 shadow-sm backdrop-blur-xl dark:bg-card/95">
      <Link to="/cliente/home" className="flex items-center gap-2">
        <img
          className="h-8 w-8 rounded-xl object-contain shadow-sm ring-1 ring-border"
          src={logoJmGym}
          alt="Logo de JMGym"
        />
        <strong className="text-sm font-black text-foreground">JMGym</strong>
      </Link>

      <div className="flex items-center gap-2">
        <NotificationBell />
      </div>
    </header>
  );
}

export default Navbar;

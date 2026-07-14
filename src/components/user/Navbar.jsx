import { Link } from 'react-router-dom';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';
import NotificationBell from './NotificationBell.jsx';

function Navbar() {
  return (
    <header className="flex items-center justify-between rounded-2xl border border-border bg-card/90 px-4 py-2 shadow-sm backdrop-blur-xl dark:bg-card/95 lg:bg-transparent lg:shadow-none lg:backdrop-blur-none lg:p-0 lg:rounded-none lg:border-0">
      <Link to="/cliente/home" className="flex items-center gap-2 lg:hidden lg:gap-3">
          <img
            className="h-8 w-8 rounded-xl object-contain shadow-sm ring-1 ring-border lg:h-10 lg:w-10 lg:rounded-2xl"
            src={logoJmGym}
            alt="Logo de JMGym"
          />
          <strong className="text-sm font-black text-foreground lg:text-base">JMGym</strong>
        </Link>

      <div className="flex items-center gap-2 ml-auto">
        <NotificationBell />
      </div>
    </header>
  );
}

export default Navbar;

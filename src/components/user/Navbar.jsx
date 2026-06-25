import { Link } from 'react-router-dom';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';

function Navbar() {
  return (
    <header className="flex items-center justify-between gap-4 rounded-[28px] bg-white/85 px-4 py-2.5 shadow-[0_10px_30px_rgba(15,23,42,.06)] backdrop-blur sm:py-3 dark:bg-slate-800/85 dark:shadow-[0_10px_30px_rgba(0,0,0,.2)]">
      <Link to="/cliente/home" className="flex items-center gap-2 sm:gap-3">
        <img
          className="h-9 w-9 rounded-2xl object-contain shadow-[0_10px_20px_rgba(0,74,171,.12)] sm:h-11 sm:w-11"
          src={logoJmGym}
          alt="Logo de JMGym"
        />
        <div>
          <strong className="block text-base font-black text-black sm:text-lg dark:text-white">JMGym</strong>
          <p className="text-[10px] text-slate-500 sm:text-xs dark:text-slate-400">Reserva clara y rápida</p>
        </div>
      </Link>
    </header>
  );
}

export default Navbar;
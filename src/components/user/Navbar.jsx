import { Link } from 'react-router-dom';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';

function Navbar() {
  return (
    <header className="flex items-center justify-between gap-4 rounded-[28px] bg-white/85 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,.06)] backdrop-blur">
      <Link to="/cliente/home" className="flex items-center gap-3">
        <img
          className="h-11 w-11 rounded-2xl object-contain shadow-[0_10px_20px_rgba(0,74,171,.12)]"
          src={logoJmGym}
          alt="Logo de JMGym"
        />
        <div>
          <strong className="block text-lg font-black text-black">JMGym</strong>
          <p className="text-xs text-slate-500">Reserva clara y rápida</p>
        </div>
      </Link>
    </header>
  );
}

export default Navbar;
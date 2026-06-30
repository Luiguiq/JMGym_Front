import { Link } from 'react-router-dom';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';

function Navbar() {
  return (
    <header className="flex items-center justify-between rounded-2xl bg-card/80 px-4 py-2 shadow-sm backdrop-blur-xl">
      <Link to="/cliente/home" className="flex items-center gap-2">
        <img
          className="h-8 w-8 rounded-xl object-contain shadow-sm"
          src={logoJmGym}
          alt="Logo de JMGym"
        />
        <strong className="text-sm font-black text-foreground">JMGym</strong>
      </Link>
    </header>
  );
}

export default Navbar;
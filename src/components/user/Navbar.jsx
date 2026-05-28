import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';

function Navbar() {
  return (
    <header className="flex items-center gap-3 font-display text-2xl font-extrabold text-brand-600 md:text-3xl">
      <img className="h-10 w-10 rounded-xl bg-white object-contain shadow-[0_10px_22px_rgba(8,117,198,0.12)] md:h-14 md:w-14 md:rounded-2xl" src={logoJmGym} alt="Logo de JMGym" />
      <strong>JMGym</strong>
    </header>
  );
}

export default Navbar;

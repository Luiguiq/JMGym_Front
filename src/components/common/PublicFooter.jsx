import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';

const gymAddress = 'Av. Conde de Lemos 420, Callao 07006';

function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#07111f] px-5 py-12 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={logoJmGym} alt="Logo JMGym" className="h-12 w-12 rounded-2xl bg-white object-contain p-1" />
            <strong className="text-2xl font-black">JMGym</strong>
          </div>
          <p className="mt-5 max-w-sm text-white/58">Gimnasio, clases y reservas digitales para una experiencia fitness mas clara.</p>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">Enlaces</h3>
          <div className="mt-5 grid gap-3 text-white/64">
            <a href="/sede" className="hover:text-white">Sede</a>
            <a href="/#programas" className="hover:text-white">Programas</a>
            <a href="/servicios" className="hover:text-white">Servicios</a>
            <a href="/contacto" className="hover:text-white">Contacto</a>
            <a href="/#acceso" className="hover:text-white">Acceso</a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">Contacto</h3>
          <div className="mt-5 grid gap-3 text-white/64">
            <p>{gymAddress}, Callao</p>
            <p>contacto@jmgym.com</p>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl text-sm text-white/42">© 2026 JMGym. Todos los derechos reservados.</p>
    </footer>
  );
}

export default PublicFooter;

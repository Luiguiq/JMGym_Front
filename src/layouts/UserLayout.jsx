import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/user/Navbar.jsx';
import BottomNav from '../components/user/BottomNav.jsx';

const noNavExact = ['/cliente/login', '/cliente/registro'];
const noNavPrefixes = ['/cliente/clases/', '/cliente/seleccion-espacio/', '/cliente/pago/'];

function UserLayout() {
  const location = useLocation();
  const showNav = !noNavExact.includes(location.pathname) && !noNavPrefixes.some((p) => location.pathname.startsWith(p));

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface text-foreground">
      {showNav && (
        <div className="mx-auto max-w-lg px-4 pt-4 sm:px-6 sm:pt-5">
          <Navbar />
        </div>
      )}
      <Outlet />
      {showNav && <BottomNav />}
    </div>
  );
}

export default UserLayout;
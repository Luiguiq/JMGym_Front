import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/user/Navbar.jsx';
import BottomNav from '../components/user/BottomNav.jsx';
import UserSidebar from '../components/user/UserSidebar.jsx';

const noNavExact = ['/cliente/login', '/cliente/registro'];
const noNavPrefixes = ['/cliente/seleccion-espacio/', '/cliente/pago/', '/cliente/reservas/'];

function UserLayout() {
  const location = useLocation();
  const showNav = !noNavExact.includes(location.pathname) && !noNavPrefixes.some((p) => location.pathname.startsWith(p));

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface text-foreground lg:flex">
      {showNav && (
        <div className="hidden lg:block lg:w-64 lg:shrink-0">
          <div className="fixed z-50 h-screen w-64 overflow-y-auto border-r border-border bg-card">
            <UserSidebar />
          </div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        {showNav && (
          <div className="px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8">
            <Navbar />
          </div>
        )}
        <Outlet />
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}

export default UserLayout;

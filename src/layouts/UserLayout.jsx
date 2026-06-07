import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '../components/user/BottomNav.jsx';

const noNavRoutes = ['/cliente/bienvenida', '/cliente/login', '/cliente/registro'];

function UserLayout() {
  const location = useLocation();
  const showNav = !noNavRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7fbff] text-black">
      <Outlet />
      {showNav && <BottomNav />}
    </div>
  );
}

export default UserLayout;
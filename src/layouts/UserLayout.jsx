import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '../components/user/BottomNav.jsx';

const noNavRoutes = ['/cliente/bienvenida', '/cliente/login', '/cliente/registro'];

function UserLayout() {
  const location = useLocation();
  const showNav = !noNavRoutes.includes(location.pathname);

  return (
    <>
      <Outlet />
      {showNav && <BottomNav />}
    </>
  );
}

export default UserLayout;

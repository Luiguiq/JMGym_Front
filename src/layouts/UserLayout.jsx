import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/user/Navbar.jsx';
import BottomNav from '../components/user/BottomNav.jsx';
import NotificationBell from '../components/user/NotificationBell.jsx';
import NotificationResponseOverlay from '../components/user/NotificationResponseOverlay.jsx';

const noNavRoutes = [
  '/cliente/login',
  '/cliente/registro'
];

function UserLayout() {
  const location = useLocation();
  const showNav = !noNavRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7fbff] text-black">
      {showNav && (
        <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8">
          <Navbar />
        </div>
      )}
      <Outlet />
      {showNav && <BottomNav />}

      {/* Floating notification bell */}
      {showNav && (
        <div className="fixed bottom-24 right-5 sm:right-8 z-50">
          <NotificationBell floating />
        </div>
      )}

      {/* Response overlay for notifications that require action */}
      {showNav && <NotificationResponseOverlay />}
    </div>
  );
}

export default UserLayout;
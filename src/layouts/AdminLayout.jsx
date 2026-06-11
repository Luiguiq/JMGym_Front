import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavbarAdmin from '../components/admin/NavbarAdmin.jsx';
import Sidebar from '../components/admin/Sidebar.jsx';
import MobileMenu from '../components/admin/MobileMenu.jsx';

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <MobileMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <NavbarAdmin onMenuClick={() => setSidebarOpen(true)} sidebarOpen={sidebarOpen} />
        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 pb-8 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

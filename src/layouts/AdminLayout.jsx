import { Outlet } from 'react-router-dom';
import NavbarAdmin from '../components/admin/NavbarAdmin.jsx';
import Sidebar from '../components/admin/Sidebar.jsx';

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Sidebar />
      <div className="flex-1">
        <NavbarAdmin />
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;

import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout.jsx';
import UserLayout from '../layouts/UserLayout.jsx';
import Landing from '../pages/Landing.jsx';
import ClasesAdmin from '../pages/admin/ClasesAdmin.jsx';
import CrearClase from '../pages/admin/CrearClase.jsx';
import Dashboard from '../pages/admin/Dashboard.jsx';
import EditarClase from '../pages/admin/EditarClase.jsx';
import ReservasAdmin from '../pages/admin/ReservasAdmin.jsx';
import DetalleClase from '../pages/user/DetalleClase.jsx';
import Home from '../pages/user/Home.jsx';
import ListaClases from '../pages/user/ListaClases.jsx';
import Login from '../pages/user/Login.jsx';
import MisReservas from '../pages/user/MisReservas.jsx';
import Perfil from '../pages/user/Perfil.jsx';
import Register from '../pages/user/Register.jsx';
import Welcome from '../pages/user/Welcome.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/cliente" element={<UserLayout />}>
        <Route index element={<Navigate to="bienvenida" replace />} />
        <Route path="bienvenida" element={<Welcome />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Register />} />
        <Route path="home" element={<Home />} />
        <Route path="clases" element={<ListaClases />} />
        <Route path="clases/:id" element={<DetalleClase />} />
        <Route path="reservas" element={<MisReservas />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="clases" element={<ClasesAdmin />} />
        <Route path="clases/crear" element={<CrearClase />} />
        <Route path="clases/:id/editar" element={<EditarClase />} />
        <Route path="reservas" element={<ReservasAdmin />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;

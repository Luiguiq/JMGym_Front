import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import UserLayout from '../layouts/UserLayout.jsx';
import Landing from '../pages/Landing.jsx';
import AdminLogin from '../pages/admin/AdminLogin.jsx';
import ClasesAdmin from '../pages/admin/ClasesAdmin.jsx';
import CrearClase from '../pages/admin/CrearClase.jsx';
import CrearAdmin from '../pages/admin/CrearAdmin.jsx';
import Dashboard from '../pages/admin/Dashboard.jsx';
import EditarClase from '../pages/admin/EditarClase.jsx';
import InstructoresAdmin from '../pages/admin/InstructoresAdmin.jsx';
import ReservasAdmin from '../pages/admin/ReservasAdmin.jsx';
import UsuariosAdmin from '../pages/admin/UsuariosAdmin.jsx';
import DetalleClase from '../pages/user/DetalleClase.jsx';
import Home from '../pages/user/Home.jsx';
import ListaClases from '../pages/user/ListaClases.jsx';
import Login from '../pages/user/Login.jsx';
import MisReservas from '../pages/user/MisReservas.jsx';
import Perfil from '../pages/user/Perfil.jsx';
import Register from '../pages/user/Register.jsx';
import Welcome from '../pages/user/Welcome.jsx';
import SeleccionEspacio from '../pages/user/SeleccionEspacio';
import PagoClase from '../pages/user/PagoClase';
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/cliente/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/cliente/home" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/cliente" element={<UserLayout />}>
        <Route index element={<Navigate to="bienvenida" replace />} />
        <Route path="bienvenida" element={<Welcome />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Register />} />
        <Route path="home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="clases" element={<ProtectedRoute><ListaClases /></ProtectedRoute>} />
        <Route path="clases/:id" element={<ProtectedRoute><DetalleClase /></ProtectedRoute>} />
        <Route path="reservas" element={<ProtectedRoute><MisReservas /></ProtectedRoute>} />
        <Route path="perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/cliente/clases/:id" element={<DetalleClase />} />
          <Route path="/cliente/seleccion-espacio/:id" element={<SeleccionEspacio />} />
        <Route path="/cliente/pago/:id" element={<PagoClase />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="clases" element={<ClasesAdmin />} />
        <Route path="clases/crear" element={<CrearClase />} />
        <Route path="clases/:id/editar" element={<EditarClase />} />
        <Route path="reservas" element={<ReservasAdmin />} />
        <Route path="instructores" element={<InstructoresAdmin />} />
        <Route path="usuarios" element={<UsuariosAdmin />} />
        <Route path="crear-admin" element={<CrearAdmin />} />

      </Route>
    </Routes>
  );
}

export default AppRoutes;

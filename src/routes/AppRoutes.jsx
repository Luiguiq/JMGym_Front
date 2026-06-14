import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import UserLayout from '../layouts/UserLayout.jsx';
import Contacto from '../pages/Contacto.jsx';
import Landing from '../pages/Landing.jsx';
import Nosotros from '../pages/Nosotros.jsx';
import SedeDetalle from '../pages/SedeDetalle.jsx';
import Servicios from '../pages/Servicios.jsx';
import AdminLogin from '../pages/admin/AdminLogin.jsx';
import ClasesAdmin from '../pages/admin/ClasesAdmin.jsx';
import CrearClase from '../pages/admin/CrearClase.jsx';
import CrearAdmin from '../pages/admin/CrearAdmin.jsx';
import Dashboard from '../pages/admin/Dashboard.jsx';
import EditarClase from '../pages/admin/EditarClase.jsx';
import InstructoresAdmin from '../pages/admin/InstructoresAdmin.jsx';
import ReservasAdmin from '../pages/admin/ReservasAdmin.jsx';
import UsuariosAdmin from '../pages/admin/UsuariosAdmin.jsx';
import NotificacionesAdmin from '../pages/admin/NotificacionesAdmin.jsx';
import DetalleClase from '../pages/user/DetalleClase.jsx';
import InstructorDetalle from '../pages/user/InstructorDetalle.jsx';
import Home from '../pages/user/Home.jsx';
import ListaClases from '../pages/user/ListaClases.jsx';
import Login from '../pages/user/Login.jsx';
import MisReservas from '../pages/user/MisReservas.jsx';
import DetalleReserva from '../pages/user/DetalleReserva.jsx';
import Perfil from '../pages/user/Perfil.jsx';
import AyudaSoporte from '../pages/user/AyudaSoporte.jsx';
import CambiarAsiento from '../pages/user/CambiarAsiento.jsx';
import CancelacionesAdmin from '../pages/admin/CancelacionesAdmin.jsx';
import Configuraciones from '../pages/user/Configuraciones.jsx';
import EditarPerfil from '../pages/user/EditarPerfil.jsx';
import Pagos from '../pages/user/Pagos.jsx';
import Register from '../pages/user/Register.jsx';;
import SeleccionEspacio from '../pages/user/SeleccionEspacio';
import PagoClase from '../pages/user/PagoClase';
import Notificaciones from '../pages/user/Notificaciones.jsx';
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
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/sede" element={<SedeDetalle />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/contacto" element={<Contacto />} />

      <Route path="/cliente" element={<UserLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Register />} />
        <Route path="home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="clases" element={<ProtectedRoute><ListaClases /></ProtectedRoute>} />
        <Route path="clases/:id" element={<ProtectedRoute><DetalleClase /></ProtectedRoute>} />
        <Route path="instructores/:id" element={<ProtectedRoute><InstructorDetalle /></ProtectedRoute>} />
        <Route path="reservas" element={<ProtectedRoute><MisReservas /></ProtectedRoute>} />
        <Route
          path="reservas/:id"
          element={
            <ProtectedRoute>
              <DetalleReserva />
            </ProtectedRoute>
          }
        />
        <Route path="perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="perfil/editar" element={<ProtectedRoute><EditarPerfil /></ProtectedRoute>} />
        <Route path="configuraciones" element={<ProtectedRoute><Configuraciones /></ProtectedRoute>} />
        <Route path="ayuda" element={<ProtectedRoute><AyudaSoporte /></ProtectedRoute>} />
        <Route path="reservas/:id/cambiar-asiento" element={<ProtectedRoute><CambiarAsiento /></ProtectedRoute>} />
        <Route path="pagos" element={<ProtectedRoute><Pagos /></ProtectedRoute>} />
        <Route path="notificaciones" element={<ProtectedRoute><Notificaciones /></ProtectedRoute>} />
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
        <Route path="cancelaciones" element={<CancelacionesAdmin />} />
        <Route path="usuarios" element={<UsuariosAdmin />} />
        <Route path="crear-admin" element={<CrearAdmin />} />
        <Route path="notificaciones" element={<NotificacionesAdmin />} />

      </Route>
    </Routes>
  );
}

export default AppRoutes;

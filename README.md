# JMGym Frontend

Aplicación frontend de JMGym para la reserva de clases y espacios deportivos. Incluye flujo completo para clientes y panel administrativo.

## Descripción

JMGym Frontend es una interfaz web que permite a los clientes explorar, reservar y gestionar sus clases, mientras que el área administrativa brinda herramientas para el control operativo del negocio.

**Stack:**
- **React** (latest)
- **Vite**
- **React Router DOM v7**
- **Tailwind CSS v4**
- **Lucide React** (iconos)
- **Framer Motion** (animaciones)
- **Socket.IO Client** (WebSocket en tiempo real)

## Funcionalidades

### Cliente
- Landing page y bienvenida
- Inicio de sesión y registro de usuarios
- Exploración de clases disponibles con detalle e instructores
- Reserva de clases con selección de espacio y pago (Yape / Efectivo)
- **Programa de fidelización** con niveles Bronce, Plata y Oro
- **Bono de horas:** el excedente (>30h/mes) se arrastra al siguiente mes
- **Clases gratis:** nivel Oro tiene 2 clases gratis por mes
- Historial de reservas y perfil de usuario
- Vinculación de cuenta Yape (simulada)
- Notificaciones en tiempo real vía WebSocket

### Administrador
- Inicio de sesión exclusivo para administradores
- Dashboard con métricas operativas
- CRUD de clases (crear, editar, eliminar)
- Gestión de instructores
- Administración de usuarios
- Visualización y gestión de reservas
- Creación de nuevos administradores

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- Backend de JMGym corriendo (ver README del backend)

## Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd JMGym_Front

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear archivo .env en la raíz:
#   VITE_API_URL=http://localhost:8000/api

# 4. Iniciar en desarrollo
npm run dev
```

## Scripts disponibles

```bash
# Desarrollo con recarga en caliente
npm run dev

# Compilación para producción
npm run build

# Vista previa de la build de producción
npm run preview
```

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:8000/api` |

## Estructura del proyecto

```
src/
├── components/
│   ├── admin/
│   │   ├── NavbarAdmin.jsx          # Barra superior admin
│   │   ├── Sidebar.jsx              # Menú lateral admin
│   │   ├── ClassForm.jsx            # Formulario de clases
│   │   ├── ClassTable.jsx           # Tabla de clases
│   │   ├── InstructorForm.jsx       # Formulario de instructores
│   │   ├── UserForm.jsx             # Formulario de usuarios
│   │   ├── ReservationTable.jsx     # Tabla de reservas
│   │   ├── StatsCard.jsx            # Tarjetas de estadísticas
│   │   ├── MobileMenu.jsx           # Menú móvil
│   │   └── Loader.jsx               # Cargador
│   └── user/
│       ├── Navbar.jsx               # Barra superior usuario
│       ├── BottomNav.jsx            # Navegación inferior
│       ├── ClassCard.jsx            # Tarjeta de clase
│       ├── FidelityCard.jsx         # Tarjeta de fidelización
│       ├── ReservationCard.jsx      # Tarjeta de reserva
│       ├── NotificationBell.jsx     # Campana de notificaciones
│       ├── YapeVinculacionModal.jsx  # Modal de vinculación Yape
│       └── Footer.jsx               # Pie de página
├── context/
│   └── AuthContext.jsx              # Contexto de autenticación
├── pages/
│   ├── admin/
│   │   ├── AdminLogin.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ClasesAdmin.jsx
│   │   ├── CrearClase.jsx
│   │   ├── EditarClase.jsx
│   │   ├── InstructoresAdmin.jsx
│   │   ├── ReservasAdmin.jsx
│   │   ├── UsuariosAdmin.jsx
│   │   ├── CrearAdmin.jsx
│   │   └── NotificacionesAdmin.jsx
│   └── user/
│       ├── Home.jsx                 # Inicio con FidelityCard
│       ├── Login.jsx
│       ├── Register.jsx
│       ├── ListaClases.jsx
│       ├── DetalleClase.jsx
│       ├── SeleccionEspacio.jsx
│       ├── PagoClase.jsx            # Pago con opción de clase gratis
│       ├── MisReservas.jsx
│       ├── Perfil.jsx
│       └── Welcome.jsx
├── services/
│   ├── api.js                       # Cliente HTTP con JWT
│   ├── authService.js               # Autenticación
│   ├── classService.js              # Clases
│   ├── reservationService.js        # Reservas
│   ├── paymentService.js            # Pagos Yape
│   ├── fidelizacionService.js       # Fidelización
│   ├── notificationService.js       # Notificaciones
│   ├── socket.js                    # WebSocket (socket.io)
│   └── ...
├── routes/
│   └── AppRoutes.jsx                # Configuración de rutas
├── App.jsx
├── main.jsx
└── index.css
```

## Rutas principales

### Públicas
- `/` → Landing page

### Cliente
- `/cliente/bienvenida` → Pantalla de bienvenida
- `/cliente/login` → Inicio de sesión
- `/cliente/registro` → Registro de usuario
- `/cliente/home` → Inicio (con tarjeta de fidelización)
- `/cliente/clases` → Listado de clases
- `/cliente/clases/:id` → Detalle de clase
- `/cliente/seleccion-espacio/:id` → Selección de espacio
- `/cliente/pago/:id` → Pago de clase (con opción "Clase gratis" para Oro)
- `/cliente/reservas` → Mis reservas
- `/cliente/perfil` → Perfil de usuario

### Administrador
- `/admin/login` → Inicio de sesión administrativo
- `/admin` → Dashboard principal
- `/admin/clases` → Gestión de clases
- `/admin/clases/crear` → Crear clase
- `/admin/clases/:id/editar` → Editar clase
- `/admin/reservas` → Gestión de reservas
- `/admin/instructores` → Gestión de instructores
- `/admin/usuarios` → Gestión de usuarios
- `/admin/crear-admin` → Crear administrador
- `/admin/notificaciones` → Notificaciones

## Sistema de fidelización

### Niveles y beneficios

| Nivel | Horas/mes | Descuento | Beneficios clave |
|-------|-----------|-----------|------------------|
| 🥉 **Bronce** | 0-7h | 0% | Sorteos mensuales |
| 🥈 **Plata** | 8-20h | 10% | Regalo sorpresa |
| 🥇 **Oro** | 21h+ | 20% | **2 clases gratis/mes**, regalo premium |

### Bono de horas

Si acumulas más de 30h en un mes, las horas extra se suman al mes siguiente. Se muestra un badge "+Xh bono" en la tarjeta de fidelización.

### Clases gratis (nivel Oro)

Los usuarios Oro ven un botón "Clase gratis (100% dto)" en la pantalla de pago. Al activarlo, la reserva se crea con monto $0 sin necesidad de procesar pago.

## Credenciales de prueba

| Rol | Email | Contraseña | Nivel |
|-----|-------|------------|-------|
| Administrador | admin@jmgym.com | admin123 | - |
| Usuario | erick@gmail.com | 123456 | BRONCE |
| **Test Bronce** | **bronce@test.com** | **test123** | **BRONCE** |
| **Test Plata** | **plata@test.com** | **test123** | **PLATA** |
| **Test Oro** | **oro@test.com** | **test123** | **ORO** |

## Convenciones

- Componentes en `src/components/` con subcarpetas `admin/` y `user/`
- Páginas en `src/pages/` con la misma subdivisión
- Navegación con `react-router-dom` y rutas protegidas por rol
- Contexto de autenticación (`AuthContext`) para sesión y roles
- Servicios modulares en `src/services/` para comunicación con la API
- Estilos con Tailwind CSS v4 sin archivos CSS personalizados
- Layouts reutilizables: `UserLayout` y `AdminLayout`

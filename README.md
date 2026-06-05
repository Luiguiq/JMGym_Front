# JMGym Frontend

Aplicacion frontend de JMGym orientada a la reserva de clases y espacios deportivos. Este proyecto incluye el flujo completo para usuarios que desean reservar clases, asi como un panel administrativo para la gestion de clases, instructores, usuarios y reservas.

## Descripcion

JMGym Frontend es una interfaz web que permite a los clientes explorar, reservar y gestionar sus clases en el gimnasio, mientras que el area administrativa brinda herramientas para el control operativo del negocio. El frontend esta organizado por modulos reutilizables y utiliza:

- **React** (latest)
- **Vite**
- **React Router DOM v7**
- **Tailwind CSS v4**
- **Lucide React** para iconos

## Funcionalidades

### Cliente
- Pantalla de bienvenida y landing page.
- Inicio de sesion y registro de usuarios.
- Exploracion de clases disponibles con detalle e instructores.
- Reserva de clases con seleccion de espacio y pago.
- Historial de reservas y perfil de usuario.
- Diseno responsivo con navegacion inferior y superior.

### Administrador
- Inicio de sesion exclusivo para administradores.
- Dashboard con metricas operativas.
- CRUD de clases (crear, editar, eliminar).
- Gestion de instructores.
- Administracion de usuarios.
- Visualizacion y gestion de reservas.
- Creacion de nuevos administradores.
- Sidebar y navegacion adaptada para escritorio y movil.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Instalacion

Clona el repositorio e instala las dependencias:

```bash
npm install
```

## Scripts disponibles

### Desarrollo

```bash
npm run dev
```

Inicia Vite en modo desarrollo con recarga en caliente.

### Compilacion

```bash
npm run build
```

Genera la version de produccion dentro de `dist/`.

### Vista previa

```bash
npm run preview
```

Sirve la build de produccion de forma local.

## Estructura del proyecto

```
JMGym_Front/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminBottomNav.jsx
│   │   │   ├── ClassForm.jsx
│   │   │   ├── ClassTable.jsx
│   │   │   ├── InstructorForm.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── MobileMenu.jsx
│   │   │   ├── NavbarAdmin.jsx
│   │   │   ├── ReservationTable.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   └── UserForm.jsx
│   │   └── user/
│   │       ├── BottomNav.jsx
│   │       ├── ClassCard.jsx
│   │       ├── Footer.jsx
│   │       ├── Loader.jsx
│   │       ├── Navbar.jsx
│   │       ├── ProfileOption.jsx
│   │       └── ReservationCard.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── data/
│   │   └── clientHomeData.js
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   └── UserLayout.jsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── ClasesAdmin.jsx
│   │   │   ├── CrearAdmin.jsx
│   │   │   ├── CrearClase.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EditarClase.jsx
│   │   │   ├── InstructoresAdmin.jsx
│   │   │   ├── ReservasAdmin.jsx
│   │   │   └── UsuariosAdmin.jsx
│   │   ├── user/
│   │   │   ├── DetalleClase.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── InstructorDetalle.jsx
│   │   │   ├── ListaClases.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MisReservas.jsx
│   │   │   ├── PagoClase.jsx
│   │   │   ├── Perfil.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── SeleccionEspacio.jsx
│   │   │   └── Welcome.jsx
│   │   └── Landing.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── services/
│   │   ├── adminService.js
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── classService.js
│   │   ├── genreService.js
│   │   ├── instructorService.js
│   │   ├── reservationService.js
│   │   └── userService.js
│   ├── assets/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Rutas principales

### Publicas
- `/` -> Landing page

### Cliente
- `/cliente/bienvenida` -> Pantalla de bienvenida
- `/cliente/login` -> Inicio de sesion
- `/cliente/registro` -> Registro de usuario
- `/cliente/home` -> Inicio del cliente
- `/cliente/clases` -> Listado de clases
- `/cliente/clases/:id` -> Detalle de clase
- `/cliente/instructores/:id` -> Detalle de instructor
- `/cliente/reservas` -> Mis reservas
- `/cliente/perfil` -> Perfil de usuario
- `/cliente/seleccion-espacio/:id` -> Seleccion de espacio para reserva
- `/cliente/pago/:id` -> Pago de clase

### Administrador
- `/admin/login` -> Inicio de sesion administrativo
- `/admin` -> Dashboard principal
- `/admin/clases` -> Gestion de clases
- `/admin/clases/crear` -> Crear nueva clase
- `/admin/clases/:id/editar` -> Editar clase
- `/admin/reservas` -> Gestion de reservas
- `/admin/instructores` -> Gestion de instructores
- `/admin/usuarios` -> Gestion de usuarios
- `/admin/crear-admin` -> Crear nuevo administrador

## Estrategia de ramas

Se usa una estrategia basada en ramas de trabajo y consolidacion:

- `main`: reservada exclusivamente para produccion.
- `develop`: linea base donde se integran las tareas del equipo.
- `feature/nombre-tarea`: ramas para desarrollar hitos o funcionalidades.
- `bugfix/nombre-error`: ramas para corregir fallos detectados en develop.

### Flujo recomendado

1. Crear una rama `feature/...` desde `develop`.
2. Desarrollar y probar la funcionalidad.
3. Abrir pull request hacia `develop`.
4. Validar y, cuando este estable, fusionar `develop` hacia `main`.

## Convenciones usadas

- Componentes de React organizados en `src/components/` con subcarpetas `admin/` y `user/`.
- Paginas separadas en `src/pages/` con la misma subdivision.
- Navegacion centralizada con `react-router-dom` y rutas protegidas por rol.
- Contexto de autenticacion (`AuthContext`) para manejo de sesion y roles.
- Servicios modulares en `src/services/` para la comunicacion con la API.
- Estilos con **Tailwind CSS v4** sin archivos CSS personalizados.
- Layouts reutilizables para cliente (`UserLayout`) y administrador (`AdminLayout`).

## Notas

- El proyecto usa componentes reutilizables para facilitar nuevas vistas tanto en cliente como en administrador.
- Las rutas protegidas verifican autenticacion y rol mediante `ProtectedRoute` y `AdminRoute`.
- Se recomienda mantener la estructura modular para mejorar mantenimiento y escalabilidad.
- Los cambios importantes deben validarse antes de integrarse a `develop`.

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, IdCard, Phone, Lock, Camera, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { userService } from '../../services/userService.js';
import Field from '../../components/user/Field.jsx';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api';
const BACKEND_URL = API_BASE.replace('/api', '');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DNI_REGEX = /^\d{8}$/;
const PHONE_REGEX = /^\d{7,15}$/;

function EditarPerfil() {
  const navigate = useNavigate();
  const { user: authUser, setUser } = useAuth();
  const fileInputRef = useRef(null);

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [fotoPreview, setFotoPreview] = useState('');
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoError, setFotoError] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  function clearError(field) {
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  }

  useEffect(() => {
    userService
      .getMyProfile()
      .then((data) => {
        setNombreCompleto(data.nombre_completo ?? '');
        setEmail(data.correo ?? '');
        setDni(data.dni ?? '');
        setTelefono(data.telefono ?? '');
        setFotoPerfil(data.foto_perfil ?? '');
      })
      .catch(() => setServerError('Error al cargar tus datos'))
      .finally(() => setPageLoading(false));
  }, []);

  function handleFotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoError('');

    const ext = file.name.split('.').pop().toLowerCase();
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!allowed.includes(ext)) {
      setFotoError('Formato no válido. Usa JPG, PNG, WebP o GIF.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFotoError('La imagen supera los 5 MB. Elige una más pequeña.');
      return;
    }

    setFotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setFotoPreview(reader.result);
    reader.readAsDataURL(file);
  }

  function validateAll() {
    const errors = {};

    if (!nombreCompleto.trim()) {
      errors.nombre = 'El nombre completo es obligatorio.';
    }

    if (!email.trim()) {
      errors.email = 'El correo electrónico es obligatorio.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = 'El correo no tiene un formato válido.';
    }

    if (!dni.trim()) {
      errors.dni = 'El DNI es obligatorio.';
    } else if (!DNI_REGEX.test(dni.trim())) {
      errors.dni = 'El DNI debe tener exactamente 8 dígitos.';
    }

    if (telefono.trim() && !PHONE_REGEX.test(telefono.trim())) {
      errors.telefono = 'El teléfono debe contener solo números (7 a 15 dígitos).';
    }

    if (newPassword && !oldPassword) {
      errors.oldPassword = 'Ingresa tu contraseña actual para cambiarla.';
    }

    if (newPassword && newPassword.length < 6) {
      errors.newPassword = 'La nueva contraseña debe tener al menos 6 caracteres.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');
    setSuccess('');

    if (!validateAll()) return;

    setLoading(true);

    try {
      let fotoUrl = fotoPerfil;

      if (fotoFile) {
        const uploadResult = await userService.uploadPhoto(fotoFile);
        fotoUrl = uploadResult.url;
      }

      const body = {};
      if (nombreCompleto.trim()) body.nombre_completo = nombreCompleto.trim();
      if (email.trim()) body.correo = email.trim();
      if (dni.trim()) body.dni = dni.trim();
      if (telefono.trim()) body.telefono = telefono.trim();
      if (fotoUrl) body.foto_perfil = fotoUrl;

      if (oldPassword && newPassword) {
        body.old_password = oldPassword;
        body.password = newPassword;
      }

      const updated = await userService.updateMyProfile(body);

      setUser((prev) => ({
        ...prev,
        name: updated.nombre_completo ?? prev.name,
        email: updated.correo ?? prev.email,
        dni: updated.dni ?? prev.dni,
        foto_perfil: updated.foto_perfil ?? prev.foto_perfil,
      }));

      setSuccess('Perfil actualizado correctamente');

      setTimeout(() => navigate('/cliente/perfil'), 2000);
    } catch (err) {
      if (err.message?.includes('contraseña actual no es correcta')) {
        setFieldErrors((prev) => ({ ...prev, oldPassword: 'La contraseña actual no es correcta.' }));
      } else {
        setServerError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-muted">Cargando...</p>
      </main>
    );
  }

  const fotoSrc = fotoPreview || (fotoPerfil ? `${BACKEND_URL}${fotoPerfil}` : null);

  return (
    <main className="min-h-dvh overflow-x-hidden bg-surface p-3 sm:p-4 lg:p-5">
      <section className="mx-auto grid min-h-[calc(100dvh-1.5rem)] max-w-3xl overflow-hidden rounded-[32px] bg-card shadow-[0_24px_70px_rgba(15,23,42,.08)]">
        <form className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10" onSubmit={handleSubmit}>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/cliente/perfil')}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-surface text-secondary transition hover:bg-border-light"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Editar perfil</h2>
              <p className="mt-1 text-secondary">Actualiza tus datos personales</p>
            </div>
          </div>

          {serverError && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              {serverError}
            </div>
          )}

          {success && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-600">
              {success}
            </div>
          )}

          {success && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div className="flex flex-col items-center gap-5 rounded-[32px] bg-card px-10 py-12 shadow-2xl text-center max-w-sm w-full">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle size={40} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-foreground">¡Cambios guardados!</h3>
                  <p className="mt-2 text-sm text-secondary">Tu perfil se actualizó correctamente.</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-sky-100">
                {fotoSrc ? (
                  <img src={fotoSrc} alt="Foto de perfil" className="h-full w-full object-cover" />
                ) : (
                  <User size={40} className="text-sky-500" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-primary-foreground shadow transition hover:bg-brand-700"
              >
                <Camera size={16} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFotoChange}
            />
            {fotoError && (
              <p className="text-xs font-semibold text-red-500">{fotoError}</p>
            )}
            <p className="text-xs text-muted">Toca la cámara para cambiar tu foto</p>
          </div>

          <Field label="Nombre completo" icon={User} error={fieldErrors.nombre}>
            <input
              className="w-full bg-transparent outline-none"
              type="text"
              placeholder="Tu nombre completo"
              value={nombreCompleto}
              onChange={(e) => { setNombreCompleto(e.target.value); clearError('nombre'); }}
              required
            />
          </Field>

          <Field label="Correo electrónico" icon={Mail} error={fieldErrors.email}>
            <input
              className="w-full bg-transparent outline-none"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
              required
            />
          </Field>

          <Field label="DNI" icon={IdCard} error={fieldErrors.dni}>
            <input
              className="w-full bg-transparent outline-none"
              type="text"
              placeholder="12345678"
              value={dni}
              onChange={(e) => { setDni(e.target.value); clearError('dni'); }}
              required
            />
          </Field>

          <Field label="Teléfono" icon={Phone} error={fieldErrors.telefono}>
            <input
              className="w-full bg-transparent outline-none"
              type="tel"
              placeholder="999 888 777"
              value={telefono}
              onChange={(e) => { setTelefono(e.target.value); clearError('telefono'); }}
            />
          </Field>

          <div className="border-t border-border-light pt-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">Cambiar contraseña</h3>

            <Field label="Contraseña actual" icon={Lock} error={fieldErrors.oldPassword} className="mb-4">
              <input
                className="w-full bg-transparent outline-none"
                type="password"
                placeholder="Ingresa tu contraseña actual"
                value={oldPassword}
                onChange={(e) => { setOldPassword(e.target.value); clearError('oldPassword'); }}
              />
            </Field>

            <Field label="Nueva contraseña" icon={Lock} error={fieldErrors.newPassword}>
              <input
                className="w-full bg-transparent outline-none"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); clearError('newPassword'); }}
              />
            </Field>
          </div>

          <button
            className="min-h-14 rounded-2xl bg-brand-600 font-bold text-primary-foreground shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-16"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default EditarPerfil;

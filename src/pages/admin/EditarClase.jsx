import { useNavigate, useParams } from 'react-router-dom';
import ClassForm from '../../components/admin/ClassForm';
import { useState, useEffect } from 'react';
import Loader from '../../components/admin/Loader';
import { classService } from '../../services/classService';
import { reservationService } from '../../services/reservationService';
import { notificationService } from '../../services/notificationService';

const EditarClase = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClassData();
  }, [id]);

  const loadClassData = async () => {
    try {
      setLoading(true);
      const data = await classService.getClassById(id);
      setClassData(data);
    } catch (error) {
      console.error('Error cargando clase:', error);
      navigate('/admin/clases');
    } finally {
      setLoading(false);
    }
  };

  async function notifyUsersOnClassChange(classId, oldData, newData) {
    const cambios = [];
    if (String(oldData.id_instructor) !== String(newData.id_instructor)) cambios.push('instructor');
    if (oldData.hora_inicio !== newData.hora_inicio) cambios.push('horario');
    if (oldData.fecha !== newData.fecha) cambios.push('fecha');
    if (cambios.length === 0) return;

    try {
      const reservations = await reservationService.getAllReservations();
      const activeUsers = reservations
        .filter((r) => r.id_clase === classId && r.estado_reserva === 'ACTIVA' && r.id_usuario);
      if (activeUsers.length === 0) return;

      const cambiosStr = cambios.join(', ');
      for (const reservation of activeUsers) {
        await notificationService.sendNotification({
          titulo: `Cambio en tu clase "${oldData.name || oldData.nombre_clase}"`,
          mensaje: `La clase ha cambiado su ${cambiosStr}. Revisa los nuevos detalles y confirma si deseas continuar con la reserva o anularla.`,
          tipo: 'CAMBIO_HORARIO',
          all_users: false,
          user_ids: [reservation.id_usuario],
          class_id: classId,
          requiere_respuesta: true,
        });
      }
    } catch (err) {
      console.error('Error enviando notificaciones de cambio:', err);
    }
  }

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      await classService.updateClass(id, formData);
      await notifyUsersOnClassChange(Number(id), classData, formData);
      navigate('/admin/clases');
    } catch (error) {
      console.error('Error actualizando clase:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !classData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" text="Cargando clase..." />
      </div>
    );
  }

  return (
    <ClassForm
      initialData={classData}
      onSubmit={handleSubmit}
      onClose={() => navigate('/admin/clases')}
      loading={saving}
    />
  );
};

export default EditarClase;

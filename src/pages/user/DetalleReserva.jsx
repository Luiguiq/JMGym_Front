import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reservationService } from '../../services/reservationService.js';

function DetalleReserva() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {

    reservationService
      .getMyReservationDetail(id)
      .then(setReservation)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Cargando reserva...
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        {error}
      </main>
    );
  }

  if (!reservation) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Reserva no encontrada
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-50 p-6">

      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 rounded-xl bg-white shadow"
      >
        ← Volver
      </button>

      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 shadow">

        <h1 className="text-2xl font-bold mb-6">
          Detalle de Reserva
        </h1>

        <div className="space-y-4">

          <div>
            <strong>Código:</strong>
            <br />
            {reservation.codigo_reserva}
          </div>

          <div>
            <strong>Clase:</strong>
            <br />
            {reservation.className}
          </div>

          <div>
            <strong>Espacio:</strong>
            <br />
            {reservation.codigo_espacio}
          </div>

          <div>
            <strong>Instructor:</strong>
            <br />
            {reservation.instructor_nombre}
          </div>

          <div>
            <strong>Fecha:</strong>
            <br />
            {reservation.fecha_clase}
          </div>

          <div>
            <strong>Hora:</strong>
            <br />
            {reservation.hora_inicio}
          </div>

          <div>
            <strong>Monto:</strong>
            <br />
            S/ {Number(reservation.monto).toFixed(2)}
          </div>

          <div>
            <strong>Estado Reserva:</strong>
            <br />
            {reservation.estado_reserva}
          </div>

          <div>
            <strong>Estado Pago:</strong>
            <br />
            {reservation.estado_pago}
          </div>

        </div>

      </div>

    </main>
  );
}

export default DetalleReserva;
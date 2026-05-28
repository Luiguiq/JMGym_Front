import { useEffect, useState } from 'react';
import ReservationTable from '../../components/admin/ReservationTable.jsx';
import { reservationService } from '../../services/reservationService.js';

function ReservasAdmin() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reservationService
      .getAllReservations()
      .then(setReservations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return <main className="p-6"><ReservationTable reservations={reservations} loading={loading} /></main>;
}

export default ReservasAdmin;

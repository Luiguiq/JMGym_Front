import { apiRequest } from './api.js';

const BENEFICIOS = {
  BRONCE: [
    { icono: 'Gift', texto: 'Participación en sorteos mensuales' },
    { icono: 'Percent', texto: 'Descuentos especiales en productos seleccionados de la academia' },
  ],
  PLATA: [
    { icono: 'Percent', texto: '10% de descuento en tu próxima clase' },
    { icono: 'Gift', texto: 'Participación en sorteos exclusivos' },
    { icono: 'Package', texto: 'Regalo sorpresa de la academia (botella deportiva, llavero, pulsera, sticker pack o merchandising disponible)' },
  ],
  ORO: [
    { icono: 'Gift', texto: '2 clases gratis al mes con 100% de descuento' },
    { icono: 'Percent', texto: '20% de descuento en tu próxima clase' },
    { icono: 'Gift', texto: 'Regalo mensual premium de la academia (polo, botella térmica, toalla deportiva, gorra o merchandising disponible)' },
    { icono: 'Trophy', texto: 'Participación en sorteos mensuales nivel oro' },
  ],
};

const NIVELES = [
  { nivel: 'BRONCE', nombre: 'Bronce', emoji: '🥉', minHoras: 0, maxHoras: 7, color: 'amber' },
  { nivel: 'PLATA', nombre: 'Plata', emoji: '🥈', minHoras: 8, maxHoras: 20, color: 'slate' },
  { nivel: 'ORO', nombre: 'Oro', emoji: '🥇', minHoras: 21, maxHoras: Infinity, color: 'yellow' },
];

function obtenerMesActual() {
  const ahora = new Date();
  return {
    mes: ahora.getMonth(),
    anio: ahora.getFullYear(),
    inicio: new Date(ahora.getFullYear(), ahora.getMonth(), 1),
    fin: new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59),
  };
}

function calcularHorasMes(reservas) {
  const { inicio, fin } = obtenerMesActual();
  return reservas
    .filter((r) => {
      if (!r.fecha_clase) return false;
      const fechaClase = new Date(r.fecha_clase + 'T00:00:00');
      return (
        fechaClase >= inicio &&
        fechaClase <= fin &&
        ['ACTIVA', 'FINALIZADA', 'COMPLETADA'].includes(r.estado_reserva) &&
        r.estado_pago !== 'PENDIENTE'
      );
    })
    .reduce((total, r) => {
      const horas = Number(r.duracion_minutos || 60) / 60;
      return total + horas;
    }, 0);
}

function obtenerNivel(horas) {
  return NIVELES.find((n) => horas >= n.minHoras && horas <= n.maxHoras) || NIVELES[0];
}

function obtenerSiguienteNivel(nivelActual) {
  const idx = NIVELES.findIndex((n) => n.nivel === nivelActual.nivel);
  return idx < NIVELES.length - 1 ? NIVELES[idx + 1] : null;
}

function obtenerProgreso(horas, nivel) {
  const siguiente = obtenerSiguienteNivel(nivel);
  if (!siguiente) return { porcentaje: 100, horasRestantes: 0, mensaje: '¡Has alcanzado el nivel más alto este mes!' };
  const horasRestantes = Math.max(0, siguiente.minHoras - horas);
  const rango = siguiente.minHoras - nivel.minHoras;
  const porcentaje = Math.min(100, Math.round(((horas - nivel.minHoras) / rango) * 100));
  return {
    porcentaje,
    horasRestantes,
    mensaje: `Te faltan ${Math.ceil(horasRestantes)} horas para alcanzar el nivel ${siguiente.nombre}`,
    siguiente,
  };
}

function obtenerBeneficios(nivel) {
  return BENEFICIOS[nivel.nivel] || [];
}

async function getMiFidelizacion() {
  return apiRequest('/fidelizacion/me');
}

export const fidelizacionService = {
  calcularHorasMes,
  obtenerNivel,
  obtenerSiguienteNivel,
  obtenerProgreso,
  obtenerBeneficios,
  getMiFidelizacion,
  NIVELES,
  BENEFICIOS,
};
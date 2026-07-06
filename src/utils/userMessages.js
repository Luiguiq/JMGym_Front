export function getFriendlyErrorMessage(error, fallback = 'No pudimos completar la acción. Inténtalo nuevamente.') {
  const message = String(error?.message || error || '').trim();
  if (!message) return fallback;

  const lower = message.toLowerCase();
  if (lower.includes('failed to fetch') || lower.includes('networkerror')) {
    return 'No pudimos conectarnos con el servidor. Comprueba tu conexión e inténtalo nuevamente.';
  }
  if (lower.includes('internal server error')) {
    return 'El servidor no pudo completar la solicitud. Inténtalo nuevamente en unos minutos.';
  }
  if (lower.includes('unprocessable entity')) {
    return 'Revisa los datos ingresados. Hay información incompleta o inválida.';
  }

  return message;
}

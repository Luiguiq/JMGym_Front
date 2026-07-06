export const DNI_ERROR_MESSAGE = 'El DNI debe contener exactamente 8 dígitos.';
export const DNI_REGEX = /^[0-9]{8}$/;

export function sanitizeDni(value) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 8);
}

export function isValidDni(value) {
  return DNI_REGEX.test(value);
}

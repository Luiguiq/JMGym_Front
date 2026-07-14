const API_BASE = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '');

export function resolveImageUrl(url) {
  if (!url) return '';
  // Fix Cloudinary URLs missing colon (e.g. /https//... or https//...)
  url = url.replace(/^\/?(https?)\/\//i, '$1://');
  if (/^(https?:|blob:|data:)/i.test(url)) return url;
  if (url.startsWith('/uploads/')) return `${API_BASE}${url}`;
  if (url.startsWith('/src/')) return '';
  return url;
}

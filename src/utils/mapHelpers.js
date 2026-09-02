/**
 * Determine Pin Icon background color class based on status or category
 */
export function getPinBgClass(category, status) {
  if (status === 'Resuelto' || status === 'approved') return 'bg-emerald-600';
  if (status === 'Inspección Requerida' || status === 'Pendiente') return 'bg-amber-500';
  if (category === 'Salud') return 'bg-pink-600';
  if (category === 'Vialidad') return 'bg-purple-600';
  return 'bg-blue-600';
}

/**
 * Creates custom Pin Marker using Leaflet DivIcon
 */
export function createCustomPinIcon(category, status) {
  const bgClass = getPinBgClass(category, status);

  const html = `
    <div class="w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-[10px] ${bgClass}">
      <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
    </div>
  `;

  if (typeof window === 'undefined') {
    return { html, className: 'custom-map-pin border-0 bg-transparent' };
  }

  // Dynamic import/require fallback when running in browser environment
  const L = window.L || require('leaflet');
  return L.divIcon({
    html,
    className: 'custom-map-pin border-0 bg-transparent',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
}

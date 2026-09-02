import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatCoordinates, formatDate } from '../utils/formattersAndFilters.js';
import { createCustomPinIcon } from '../utils/mapHelpers.js';
import MapControlsOverlay from './MapView/MapControlsOverlay.jsx';

// Fix Leaflet default marker icons in React/Vite builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapView({
  features = [],
  selectedFeatureId = null,
  onSelectFeature = () => {},
  onBoundsChange = () => {},
  spatialFilterEnabled = true
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const markersMapRef = useRef(new Map());

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Venezuela / Caracas Metropolitan region by default
    const map = L.map(mapContainerRef.current, {
      center: [10.4806, -66.9036],
      zoom: 11,
      zoomControl: false
    });

    // Add Zoom Control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Tile Layers (No API Key Required)
    const osmLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }
    );

    const esriSatLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 18
      }
    );

    osmLayer.addTo(map);

    // Layer switcher control
    const baseMaps = {
      "OpenStreetMap": osmLayer,
      "Satelital": esriSatLayer
    };
    L.control.layers(baseMaps, null, { position: 'topleft' }).addTo(map);

    // Standard Feature Group for individual markers
    const markersGroup = L.featureGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Map Movement event listener for spatial bounding box filter
    const emitBounds = () => {
      if (!mapInstanceRef.current) return;
      const b = mapInstanceRef.current.getBounds();
      onBoundsChange({
        south: b.getSouth(),
        west: b.getWest(),
        north: b.getNorth(),
        east: b.getEast()
      });
    };

    map.on('moveend', emitBounds);
    map.on('zoomend', emitBounds);

    return () => {
      map.off('moveend', emitBounds);
      map.off('zoomend', emitBounds);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Individual Markers on Map when features prop changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    markersMapRef.current.clear();

    if (!features || features.length === 0) return;

    const bounds = L.latLngBounds();

    features.forEach((feature) => {
      const [lon, lat] = feature.geometry?.coordinates || [];
      if (lat === undefined || lon === undefined) return;

      const p = feature.properties || {};
      const pinIcon = createCustomPinIcon(p.categoria, p.estado_atencion);
      const marker = L.marker([lat, lon], { icon: pinIcon });

      const isResolved = p.estado_atencion === 'Resuelto' || p.status === 'approved';
      const statusBadgeClass = isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800';

      // Build interactive popup content using pure Tailwind classes
      const popupContent = document.createElement('div');
      popupContent.className = 'w-60 p-1 font-sans text-slate-900';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-100">
          <span class="font-bold text-xs text-slate-900">Encuesta #${p.id || 'N/A'}</span>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded ${statusBadgeClass}">
            ${p.estado_atencion || 'Registrado'}
          </span>
        </div>

        <div class="text-[11px] text-slate-700 space-y-1 mb-2">
          <div><span class="font-semibold text-slate-900">Categoría:</span> ${p.categoria || 'General'}</div>
          <div><span class="font-semibold text-slate-900">Encuestador:</span> ${p.submitted_by || 'N/A'}</div>
          <div><span class="font-semibold text-slate-900">Fecha:</span> ${formatDate(p.submission_time)}</div>
          <div><span class="font-semibold text-slate-900">Coordenadas:</span> ${formatCoordinates(lat, lon)}</div>
        </div>

        ${p.observaciones ? `
          <div class="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 mb-2 max-h-14 overflow-y-auto italic">
            "${p.observaciones}"
          </div>
        ` : ''}

        <button id="btn-popup-detail-${p.id}" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-2 rounded text-xs shadow-sm transition-colors cursor-pointer">
          Ver Ficha Completa
        </button>
      `;

      // Attach click handler to popup button
      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-detail-${p.id}`);
        if (btn) {
          btn.onclick = () => onSelectFeature(feature);
        }
      });

      marker.on('click', () => {
        onSelectFeature(feature);
      });

      markersGroup.addLayer(marker);
      markersMapRef.current.set(p.id, marker);
      bounds.extend([lat, lon]);
    });

    // Auto fit bounds to survey points location
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [features]);

  // Handle selected feature flying/centering
  useEffect(() => {
    if (!selectedFeatureId || !mapInstanceRef.current) return;
    const marker = markersMapRef.current.get(selectedFeatureId);
    if (marker) {
      const latLng = marker.getLatLng();
      mapInstanceRef.current.flyTo(latLng, 15, { duration: 1 });
      marker.openPopup();
    }
  }, [selectedFeatureId]);

  // Fit Bounds button click handler
  const handleFitBounds = () => {
    const map = mapInstanceRef.current;
    if (!map || !features || features.length === 0) return;

    const bounds = L.latLngBounds();
    features.forEach(f => {
      const [lon, lat] = f.geometry?.coordinates || [];
      if (lat !== undefined && lon !== undefined) {
        bounds.extend([lat, lon]);
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[350px]">
      <div ref={mapContainerRef} className="w-full h-full z-0 font-sans" />
      <MapControlsOverlay count={features.length} onFitBounds={handleFitBounds} />
    </div>
  );
}

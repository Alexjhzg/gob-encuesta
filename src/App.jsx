import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import MapView from './components/MapView.jsx';
import DataTable from './components/DataTable.jsx';
import RecordDetail from './components/RecordDetail.jsx';
import ConfigModal from './components/ConfigModal.jsx';
import DashboardView from './components/DashboardView.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import { getGeoJSONData } from './services/api.js';
import {
  filterFeaturesByBounds,
  filterFeaturesByDateRange,
  filterFeaturesByEnumerator,
  filterFeaturesByCategory,
  filterFeaturesByParroquia,
  filterFeaturesBySector,
  filterFeaturesBySearchText,
  calculateKPIs,
  normalizeSurveyorName
} from './utils/formattersAndFilters.js';
import { exportToGeoJSON, exportToCSV, downloadFile } from './utils/exporters.js';
import { AlertCircle, MapPin, Table } from 'lucide-react';

export default function App() {
  // App Config & Settings (token defaults to empty; backend falls back to KOBO_API_TOKEN env var)
  const [config, setConfig] = useState(() => {
    const defaultConfig = {
      serverUrl: 'https://kf.kobotoolbox.org',
      assetUid: 'aJwBHzgWAqMozzcGLbZjgE',
      token: ''
    };
    try {
      const saved = localStorage.getItem('kobo_config');
      return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
    } catch {
      return defaultConfig;
    }
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(import.meta.env.VITE_DEMO_MODE === 'true');

  // Raw GeoJSON Feature Collection
  const [rawDataset, setRawDataset] = useState({
    type: 'FeatureCollection',
    features: [],
    meta: {}
  });

  const [activeTab, setActiveTab] = useState('map'); // 'map' or 'dashboard'
  const [mobileSplitView, setMobileSplitView] = useState('map'); // 'map' or 'table' on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default collapsed/hidden on mobile
  const [filters, setFilters] = useState({
    searchText: '',
    startDate: '',
    endDate: '',
    enumerator: 'ALL',
    parroquia: 'ALL',
    sector: 'ALL',
    category: 'ALL'
  });

  // Spatial Bounding Box Filter state & Map Bounds
  const [spatialFilterEnabled, setSpatialFilterEnabled] = useState(true);
  const [mapBounds, setMapBounds] = useState(null);

  // Selection & UI modals
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Available options
  const [enumerators, setEnumerators] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [sectors, setSectors] = useState([]);

  // Save config to localStorage
  const handleSaveConfig = (newConfig) => {
    setConfig(newConfig);
    localStorage.setItem('kobo_config', JSON.stringify(newConfig));
  };

  // Fetch Dataset from Backend Proxy
  const applyDataset = useCallback((data, activeUid) => {
    setRawDataset(data);

    // Extract unique enumerators, categories, parroquias, and sectors dynamically 100% from dataset
    const enumSet = new Set();
    const catSet = new Set();
    const parSet = new Set();
    const secSet = new Set();

    (data.features || []).forEach((f) => {
      const p = f.properties || {};
      if (p.submitted_by) {
        const norm = normalizeSurveyorName(p.submitted_by);
        if (norm) enumSet.add(norm);
      }
      if (p.categoria && p.categoria !== 'Encuesta de Campo') {
        catSet.add(p.categoria);
      } else {
        catSet.add(
          activeUid === 'ajgQTzZcCG3ccEuB8dvNZc' ? 'Aspectos Políticos' : 'Intención de Voto'
        );
      }
      if (p['S1/par']) parSet.add(String(p['S1/par']));
      if (p['S1/sec']) secSet.add(String(p['S1/sec']));
    });

    setEnumerators(Array.from(enumSet).sort());
    setCategories(Array.from(catSet).sort());
    setParroquias(Array.from(parSet).sort((a, b) => Number(a) - Number(b)));
    setSectors(Array.from(secSet).sort((a, b) => Number(a) - Number(b)));
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await getGeoJSONData({
        serverUrl: config.serverUrl,
        assetUid: config.assetUid,
        token: config.token,
        limit: 1000,
        demo: isDemoMode
      });
      applyDataset(data, config.assetUid);
      setIsDemoMode(Boolean(data.meta?.is_mock));
    } catch (err) {
      if (!isDemoMode && /Credenciales faltantes/i.test(err.message)) {
        try {
          const demoData = await getGeoJSONData({ limit: 80, demo: true });
          applyDataset(demoData, config.assetUid);
          setIsDemoMode(true);
          setErrorMessage(null);
          return;
        } catch (demoErr) {
          setErrorMessage(demoErr.message);
          return;
        }
      }
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }, [config.serverUrl, config.assetUid, config.token, isDemoMode, applyDataset]);

  useEffect(() => {
    let cancelled = false;

    const loadInitial = async () => {
      try {
        const data = await getGeoJSONData({
          serverUrl: config.serverUrl,
          assetUid: config.assetUid,
          token: config.token,
          limit: 1000,
          demo: isDemoMode
        });
        if (!cancelled) {
          applyDataset(data, config.assetUid);
          setIsDemoMode(Boolean(data.meta?.is_mock));
          setErrorMessage(null);
        }
      } catch (err) {
        if (!cancelled && !isDemoMode && /Credenciales faltantes/i.test(err.message)) {
          try {
            const demoData = await getGeoJSONData({ limit: 80, demo: true });
            if (!cancelled) {
              applyDataset(demoData, config.assetUid);
              setIsDemoMode(true);
              setErrorMessage(null);
            }
            return;
          } catch (demoErr) {
            if (!cancelled) setErrorMessage(demoErr.message);
            return;
          }
        }
        if (!cancelled) {
          setErrorMessage(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitial();
    return () => {
      cancelled = true;
    };
  }, [config.assetUid, config.token, config.serverUrl, isDemoMode, applyDataset]);

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setMapBounds(null);
  };

  // Handle Filter Changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Attribute-filtered Features Pipeline (For Map and Table base)
  const attributeFilteredFeatures = useMemo(() => {
    let result = rawDataset.features || [];

    // 1. Text Search Filter
    result = filterFeaturesBySearchText(result, filters.searchText);

    // 2. Date Range Filter
    result = filterFeaturesByDateRange(result, filters.startDate, filters.endDate);

    // 3. Enumerator Filter
    result = filterFeaturesByEnumerator(result, filters.enumerator);

    // 4. Parroquia Filter
    result = filterFeaturesByParroquia(result, filters.parroquia);

    // 5. Sector Filter
    result = filterFeaturesBySector(result, filters.sector);

    // 6. Category Filter
    result = filterFeaturesByCategory(result, filters.category);

    return result;
  }, [rawDataset, filters]);

  // Table Features Pipeline (Attribute-filtered + Spatial bounding box)
  const tableFilteredFeatures = useMemo(() => {
    let result = attributeFilteredFeatures;

    // Spatial Bounding Box Filter (for Table synchronization)
    // Ignore spatial bounds if mobile view is explicitly set to 'table' (map hidden)
    if (spatialFilterEnabled && mapBounds && mobileSplitView !== 'table') {
      result = filterFeaturesByBounds(result, mapBounds);
    }

    return result;
  }, [attributeFilteredFeatures, spatialFilterEnabled, mapBounds, mobileSplitView]);

  // Dashboard KPIs Calculation
  const kpis = useMemo(() => {
    return calculateKPIs(attributeFilteredFeatures, rawDataset.meta?.total || 0);
  }, [attributeFilteredFeatures, rawDataset.meta?.total]);

  // Dynamic Date Limits calculation based on active dataset
  const dateLimits = useMemo(() => {
    let minD = null;
    let maxD = null;

    (rawDataset.features || []).forEach((f) => {
      const timeStr = f.properties?.submission_time || f.properties?._submission_time;
      if (timeStr) {
        const dateStr = timeStr.slice(0, 10);
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          if (!minD || dateStr < minD) minD = dateStr;
          if (!maxD || dateStr > maxD) maxD = dateStr;
        }
      }
    });

    return {
      minDate: minD || '2026-08-28',
      maxDate: maxD || '2026-08-30'
    };
  }, [rawDataset]);

  // Export Handlers
  const handleExportGeoJSON = () => {
    const jsonStr = exportToGeoJSON(tableFilteredFeatures);
    downloadFile(
      jsonStr,
      `kobo_surveys_${new Date().toISOString().slice(0, 10)}.geojson`,
      'application/json'
    );
  };

  const handleExportCSV = () => {
    const csvStr = exportToCSV(tableFilteredFeatures);
    downloadFile(csvStr, `kobo_surveys_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 font-sans text-slate-100 overflow-hidden">
      {/* Full-screen Loading Overlay */}
      {loading && <LoadingScreen message="Cargando datos..." />}

      {/* Header with KPIs and Survey Asset selector */}
      <Header
        kpis={kpis}
        activeAssetUid={config.assetUid}
        onSelectAssetUid={(uid) => {
          const newCfg = { ...config, assetUid: uid };
          setConfig(newCfg);
          localStorage.setItem('kobo_config', JSON.stringify(newCfg));
        }}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenConfig={() => setIsConfigOpen(true)}
        onRefresh={fetchData}
        loading={loading}
      />

      {/* Demo Mode Banner */}
      {isDemoMode && !errorMessage && (
        <div className="bg-blue-950/90 text-blue-100 border-b border-blue-800/80 px-4 py-1.5 text-xs flex items-center justify-between gap-2">
          <span>
            <strong>Modo Demo:</strong> Visualizando datos sintéticos de demostración. Configura{' '}
            <code className="font-mono text-blue-300">KOBO_API_TOKEN</code> o conecta tu cuenta para
            datos reales.
          </span>
          <button
            type="button"
            onClick={() => setIsConfigOpen(true)}
            className="shrink-0 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
          >
            Configurar API
          </button>
        </div>
      )}

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="bg-rose-900/90 text-rose-100 border-b border-rose-800 px-4 py-2 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>
              <strong>Error Kobo API:</strong> {errorMessage}
            </span>
          </div>
        </div>
      )}

      {/* Main Body: Collapsible Sidebar + Active Tab Content */}
      <div className="flex flex-1 w-full h-[calc(100vh-65px)] overflow-hidden">
        {/* Collapsible Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onToggleOpen={() => setSidebarOpen((prev) => !prev)}
          filters={filters}
          onFilterChange={handleFilterChange}
          enumerators={enumerators}
          categories={categories}
          parroquias={parroquias}
          sectors={sectors}
          minDate={dateLimits.minDate}
          maxDate={dateLimits.maxDate}
          spatialFilterEnabled={spatialFilterEnabled}
          onToggleSpatialFilter={setSpatialFilterEnabled}
          onExportGeoJSON={handleExportGeoJSON}
          onExportCSV={handleExportCSV}
        />

        {/* Active Content View: Map Split View vs Full Analytics Dashboard */}
        {activeTab === 'map' ? (
          <main className="flex-1 flex flex-col w-full h-full overflow-hidden">
            {/* Mobile View Switcher Sub-Bar (Only visible on small screens < md) */}
            <div className="flex md:hidden bg-slate-900 border-b border-slate-800 p-1.5 shrink-0 gap-1.5">
              <button
                onClick={() => setMobileSplitView('map')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  mobileSplitView === 'map'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <MapPin size={14} />
                <span>Mapa ({attributeFilteredFeatures.length})</span>
              </button>
              <button
                onClick={() => setMobileSplitView('table')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  mobileSplitView === 'table'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Table size={14} />
                <span>Tabla ({tableFilteredFeatures.length})</span>
              </button>
            </div>

            {/* Split View Container */}
            <div className="flex-1 flex flex-col md:flex-row w-full h-full overflow-hidden">
              {/* Map Pane (Full height on mobile if active, 60% width on desktop) */}
              <div
                className={`w-full md:w-[60%] h-full relative border-b md:border-b-0 md:border-r border-slate-800 ${
                  mobileSplitView === 'map' ? 'flex-1 block' : 'hidden md:block'
                }`}
              >
                <MapView
                  features={attributeFilteredFeatures}
                  selectedFeatureId={selectedFeature?.properties?.id}
                  onSelectFeature={(feat) => setSelectedFeature(feat)}
                  onBoundsChange={(bounds) => setMapBounds(bounds)}
                  spatialFilterEnabled={spatialFilterEnabled}
                />
              </div>

              {/* Data Table Pane (Full height on mobile if active, 40% width on desktop) */}
              <div
                className={`w-full md:w-[40%] h-full overflow-hidden ${
                  mobileSplitView === 'table' ? 'flex-1 block' : 'hidden md:block'
                }`}
              >
                <DataTable
                  features={tableFilteredFeatures}
                  selectedFeatureId={selectedFeature?.properties?.id}
                  onSelectFeature={(feat) => {
                    setSelectedFeature(feat);
                    setMobileSplitView('map');
                  }}
                  pageSize={15}
                />
              </div>
            </div>
          </main>
        ) : (
          <main className="flex-1 flex flex-col w-full h-full overflow-hidden">
            <DashboardView
              features={attributeFilteredFeatures}
              totalInDataset={rawDataset.meta?.total || 0}
              activeAssetUid={config.assetUid}
              onSelectFeature={(feat) => {
                setSelectedFeature(feat);
                handleSelectTab('map');
              }}
            />
          </main>
        )}
      </div>

      {/* Record Detail Drawer Modal */}
      {selectedFeature && (
        <RecordDetail feature={selectedFeature} onClose={() => setSelectedFeature(null)} />
      )}

      {/* Kobo API Config Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />
    </div>
  );
}

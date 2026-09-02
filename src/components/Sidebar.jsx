import React from 'react';
import { formatParroquiaName, formatSectorName } from '../utils/formattersAndFilters.js';
import { resetFilters } from '../utils/sidebarHelpers.js';
import { Filter, ChevronLeft, ChevronRight, User, MapPin, X, RotateCcw } from 'lucide-react';
import SearchFilterInput from './Sidebar/SearchFilterInput.jsx';
import DateRangeFilter from './Sidebar/DateRangeFilter.jsx';
import SelectFilter from './Sidebar/SelectFilter.jsx';
import ExportActions from './Sidebar/ExportActions.jsx';
import CollapsedSidebar from './Sidebar/CollapsedSidebar.jsx';

export default function Sidebar({
  isOpen = true,
  onToggleOpen = () => {},
  filters = {},
  onFilterChange = () => {},
  enumerators = [],
  categories = [],
  parroquias = [],
  sectors = [],
  minDate = '2026-08-28',
  maxDate = '2026-08-30',
  spatialFilterEnabled = true,
  onToggleSpatialFilter = () => {},
  onExportGeoJSON = () => {},
  onExportCSV = () => {}
}) {
  return (
    <>
      {/* Mobile Floating Trigger Button (FAB style: bottom-left above map badge) */}
      {!isOpen && (
        <button
          onClick={onToggleOpen}
          title="Abrir Panel de Filtros"
          className="md:hidden fixed left-4 bottom-16 z-30 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-blue-400/40 cursor-pointer"
        >
          <Filter size={15} />
          <span>Filtros</span>
        </button>
      )}

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onToggleOpen}
          className="fixed inset-0 z-30 bg-slate-950/75 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed md:relative inset-y-0 left-0 z-40 bg-slate-900 border-r border-slate-800 text-slate-200 transition-all duration-300 ease-in-out flex flex-col shadow-2xl md:shadow-none ${
          isOpen ? 'w-72 min-w-[288px] translate-x-0' : 'w-14 min-w-[56px] -translate-x-full md:translate-x-0'
        }`}
      >
        {/* Desktop Edge Toggle Button */}
        <button
          onClick={onToggleOpen}
          title={isOpen ? "Colapsar Panel" : "Expandir Panel de Filtros"}
          className="hidden md:flex absolute -right-3 top-5 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-md border border-slate-800 transition-transform cursor-pointer"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-100 text-sm tracking-wide">
            <Filter size={16} className="text-blue-400" />
            {isOpen && <span>Filtros y Parámetros</span>}
          </div>
          {isOpen && (
            <button
              onClick={onToggleOpen}
              className="md:hidden p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
              title="Cerrar Filtros"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Sidebar Form & Controls (Expanded mode) */}
        {isOpen ? (
          <div className="p-4 flex-1 overflow-y-auto space-y-5 text-xs">
            {/* Search Query Input */}
            <SearchFilterInput
              value={filters.searchText || ''}
              onChange={(val) => onFilterChange('searchText', val)}
            />

            {/* Date Range Picker */}
            <DateRangeFilter
              minDate={minDate}
              maxDate={maxDate}
              startDate={filters.startDate || ''}
              endDate={filters.endDate || ''}
              onStartDateChange={(val) => onFilterChange('startDate', val)}
              onEndDateChange={(val) => onFilterChange('endDate', val)}
            />

            {/* Enumerator / Encuestador Filter */}
            <SelectFilter
              label="Encuestador"
              icon={User}
              value={filters.enumerator || 'ALL'}
              allOptionLabel="Todos los encuestadores"
              options={enumerators}
              onChange={(val) => onFilterChange('enumerator', val)}
            />

            {/* Parroquia Filter */}
            <SelectFilter
              label="Parroquia"
              icon={MapPin}
              value={filters.parroquia || 'ALL'}
              allOptionLabel="Todas las Parroquias"
              options={parroquias}
              formatter={formatParroquiaName}
              onChange={(val) => onFilterChange('parroquia', val)}
            />

            {/* Sector Filter */}
            <SelectFilter
              label="Sector"
              icon={MapPin}
              iconClass="text-amber-400"
              value={filters.sector || 'ALL'}
              allOptionLabel="Todos los Sectores"
              options={sectors}
              formatter={formatSectorName}
              onChange={(val) => onFilterChange('sector', val)}
            />

            {/* Reset Filters Button */}
            <button
              onClick={() => resetFilters(onFilterChange)}
              className="w-full py-2 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <RotateCcw size={14} className="shrink-0" />
              <span>Limpiar Filtros</span>
            </button>

            <hr className="border-slate-800" />

            {/* Export Section */}
            <ExportActions
              onExportGeoJSON={onExportGeoJSON}
              onExportCSV={onExportCSV}
            />
          </div>
        ) : (
          /* Collapsed mode icons preview for Desktop */
          <CollapsedSidebar onToggleOpen={onToggleOpen} />
        )}
      </aside>
    </>
  );
}

import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { sortFeatures } from '../utils/tableHelpers.js';
import TableSortHeader from './DataTable/TableSortHeader.jsx';
import TableRowItem from './DataTable/TableRowItem.jsx';
import EmptyTableState from './DataTable/EmptyTableState.jsx';

export default function DataTable({
  features = [],
  selectedFeatureId = null,
  onSelectFeature = () => {},
  pageSize = 15
}) {
  const [sortField, setSortField] = useState('id');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedFeatures = sortFeatures(features, sortField, sortAsc);

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 shadow-inner font-sans">
      {/* Table Top Bar */}
      <div className="px-4 py-3 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Layers size={16} className="text-blue-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-100">
            Registros de Encuesta
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
            {features.length} registros (100% visibles)
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse text-xs">
          <TableSortHeader
            sortField={sortField}
            sortAsc={sortAsc}
            onSort={handleSort}
          />

          <tbody className="divide-y divide-slate-200 text-slate-800">
            {sortedFeatures.length > 0 ? (
              sortedFeatures.map(f => (
                <TableRowItem
                  key={f.properties?.id}
                  feature={f}
                  isSelected={selectedFeatureId === f.properties?.id}
                  onSelectFeature={onSelectFeature}
                />
              ))
            ) : (
              <EmptyTableState />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

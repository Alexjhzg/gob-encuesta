import React from 'react';
import { DEFAULT_KPIS } from '../utils/headerHelpers.js';
import BrandHeader from './Header/BrandHeader.jsx';
import SurveySelector from './Header/SurveySelector.jsx';
import ViewTabSwitcher from './Header/ViewTabSwitcher.jsx';
import KpiCardGroup from './Header/KpiCardGroup.jsx';
import HeaderActions from './Header/HeaderActions.jsx';

export default function Header({
  kpis = DEFAULT_KPIS,
  activeAssetUid = 'aJwBHzgWAqMozzcGLbZjgE',
  onSelectAssetUid = () => {},
  activeTab = 'map',
  onSelectTab = () => {},
  onOpenConfig = () => {},
  onRefresh = () => {},
  loading = false
}) {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 text-white px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-4 shadow-md">
      {/* Top Header Row (Mobile: Brand + Actions; Desktop: Brand + Selector + Tabs) */}
      <div className="flex flex-col md:flex-row md:items-center gap-2.5 sm:gap-4 w-full md:w-auto">
        <div className="flex items-center justify-between w-full md:w-auto">
          <BrandHeader />
          <div className="md:hidden">
            <HeaderActions onRefresh={onRefresh} loading={loading} />
          </div>
        </div>

        <SurveySelector
          activeAssetUid={activeAssetUid}
          onSelectAssetUid={onSelectAssetUid}
        />

        <div className="w-full md:w-auto">
          <ViewTabSwitcher
            activeTab={activeTab}
            onSelectTab={onSelectTab}
          />
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
        <KpiCardGroup kpis={kpis} />
        <div className="hidden md:block">
          <HeaderActions onRefresh={onRefresh} loading={loading} />
        </div>
      </div>
    </header>
  );
}

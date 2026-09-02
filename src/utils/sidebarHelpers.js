export const DEFAULT_FILTERS = {
  searchText: '',
  startDate: '',
  endDate: '',
  enumerator: 'ALL',
  parroquia: 'ALL',
  sector: 'ALL',
  category: 'ALL'
};

/**
 * Resets all filter values back to default
 */
export function resetFilters(onFilterChange) {
  if (typeof onFilterChange !== 'function') return;
  Object.entries(DEFAULT_FILTERS).forEach(([key, defaultValue]) => {
    onFilterChange(key, defaultValue);
  });
}

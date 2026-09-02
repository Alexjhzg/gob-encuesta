import { describe, it, expect, vi } from 'vitest';
import { resetFilters, DEFAULT_FILTERS } from '../src/utils/sidebarHelpers.js';

describe('Sidebar Helpers', () => {
  it('defines default filter values', () => {
    expect(DEFAULT_FILTERS).toEqual({
      searchText: '',
      startDate: '',
      endDate: '',
      enumerator: 'ALL',
      parroquia: 'ALL',
      sector: 'ALL',
      category: 'ALL'
    });
  });

  it('triggers onFilterChange for each filter when resetFilters is called', () => {
    const onFilterChange = vi.fn();
    resetFilters(onFilterChange);

    expect(onFilterChange).toHaveBeenCalledWith('searchText', '');
    expect(onFilterChange).toHaveBeenCalledWith('startDate', '');
    expect(onFilterChange).toHaveBeenCalledWith('endDate', '');
    expect(onFilterChange).toHaveBeenCalledWith('enumerator', 'ALL');
    expect(onFilterChange).toHaveBeenCalledWith('parroquia', 'ALL');
    expect(onFilterChange).toHaveBeenCalledWith('sector', 'ALL');
    expect(onFilterChange).toHaveBeenCalledWith('category', 'ALL');
  });
});

// components/dashboard/FilterControls.tsx
'use client';

import { Filter, Star, CheckCircle, XCircle } from 'lucide-react';

export interface FilterState {
  active: boolean;
  inactive: boolean;
  favorites: boolean;
}

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterControls({ filters, onFilterChange }: FilterControlsProps) {
  const toggleFilter = (filter: keyof FilterState) => {
    onFilterChange({
      ...filters,
      [filter]: !filters[filter]
    });
  };

  return (
    <div className="bg-dark-glass rounded-xl p-6 border border-purple-600/30 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold light-text">Filters</h2>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {/* Actief filter */}
        <button
          onClick={() => toggleFilter('active')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            filters.active 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
              : 'bg-navy-900/50 text-navy-200 border border-purple-600/20 hover:bg-navy-900'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Actief</span>
          {filters.active && (
            <span className="ml-1 text-xs opacity-70">✓</span>
          )}
        </button>

        {/* Niet actief filter */}
        <button
          onClick={() => toggleFilter('inactive')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            filters.inactive 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
              : 'bg-navy-900/50 text-navy-200 border border-purple-600/20 hover:bg-navy-900'
          }`}
        >
          <XCircle className="w-4 h-4" />
          <span>Niet actief</span>
          {filters.inactive && (
            <span className="ml-1 text-xs opacity-70">✓</span>
          )}
        </button>

        {/* Favorieten filter */}
        <button
          onClick={() => toggleFilter('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            filters.favorites 
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
              : 'bg-navy-900/50 text-navy-200 border border-purple-600/20 hover:bg-navy-900'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Favorieten</span>
          {filters.favorites && (
            <span className="ml-1 text-xs opacity-70">✓</span>
          )}
        </button>

        {/* Reset knop */}
        {(filters.active || filters.inactive || filters.favorites) && (
          <button
            onClick={() => onFilterChange({ active: true, inactive: true, favorites: true })}
            className="px-4 py-2 bg-navy-900/50 text-purple-300 border border-purple-600/30 rounded-lg hover:bg-navy-900 transition-all duration-300"
          >
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { Filter as FilterIcon } from 'lucide-react';
import { categories, levels, priceRanges } from '../data/mockData';
import { formatPriceRange } from '../utils/helpers';

export type FilterType = 'category' | 'level' | 'priceRange';

const TABS: { key: FilterType; label: string }[] = [
  { key: 'category', label: 'Danh mục' },
  { key: 'level', label: 'Trình độ' },
  { key: 'priceRange', label: 'Khoảng giá' },
];

interface FilterProps {
  filters: { category: string; level: string; priceRange: string };
  onChange: (type: FilterType, value: string) => void;
  scrolledPastHero?: boolean;
}

const Filter: React.FC<FilterProps> = ({ filters, onChange, scrolledPastHero = false }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterType>('category');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const tabOptions: Record<FilterType, string[]> = {
    category: categories,
    level: levels,
    priceRange: priceRanges,
  };

  return (
    <div ref={wrapperRef} className="relative h-full flex items-center">
      <button
        className={`flex items-center h-12 space-x-2 px-4 py-2 rounded-lg border border-secondary-200 transition-colors duration-150 focus:outline-none
          bg-white
          ${scrolledPastHero ? 'text-primary-600' : 'text-secondary-900'}
          ${scrolledPastHero ? 'hover:bg-white hover:text-primary-600' : 'hover:bg-secondary-100 hover:text-primary-600'}
        `}
        onClick={() => setDropdownOpen((open) => !open)}
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
        type="button"
      >
        <FilterIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Bộ lọc</span>
      </button>
      {/* Dropdown Panel */}
      {dropdownOpen && (
        <div
          className="absolute top-full left-0 w-80 bg-white border border-secondary-200 rounded-xl shadow-lg z-30"
        >
          {/* Tabs */}
          <div className="flex border-b border-secondary-100">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`flex-1 py-2 text-sm font-medium transition-colors duration-150 focus:outline-none ${
                  activeTab === tab.key
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-secondary-700 hover:bg-secondary-50'
                }`}
                onClick={() => setActiveTab(tab.key)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Tab Options */}
          <div className="p-4">
            {tabOptions[activeTab].map((option) => (
              <button
                key={option}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors duration-100 focus:outline-none ${
                  filters[activeTab] === option
                    ? 'bg-primary-100 text-primary-700 font-semibold'
                    : 'hover:bg-secondary-100 text-secondary-700'
                }`}
                onClick={() => {
                  onChange(activeTab, option);
                  setDropdownOpen(false);
                }}
                type="button"
              >
                {activeTab === 'priceRange' ? formatPriceRange(option) : option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter; 
import React from 'react';
import { priceRanges } from '../data/mockData';
import { formatPriceRange } from '../utils/helpers';

interface PriceFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-sm font-medium">Khoảng giá:</span>
      <select
        className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-400"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {priceRanges.map(range => (
          <option key={range} value={range}>
            {formatPriceRange(range)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PriceFilter; 
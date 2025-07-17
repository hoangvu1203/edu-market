import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
        <Search className="w-5 h-5" />
      </span>
      <input
        type="text"
        className="input-field h-12 flex items-center pl-10 pr-4 w-full"
        placeholder="Tìm kiếm khoá học, sản phẩm giáo dục..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar; 
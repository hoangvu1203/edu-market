import React from 'react';
import { Heart } from 'lucide-react';

interface FavoritesButtonProps {
  count: number;
  onClick?: () => void;
  className?: string;
}

const FavoritesButton: React.FC<FavoritesButtonProps> = ({ count, onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative text-secondary-700 hover:text-primary-600 transition-colors duration-200 ${className || ''}`}
  >
    <Heart className="w-5 h-5" />
    {count > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {count}
      </span>
    )}
  </button>
);

export default FavoritesButton; 
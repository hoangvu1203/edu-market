import React from 'react';

interface LogoHomeButtonProps {
  onClick: () => void;
}

const LogoHomeButton: React.FC<LogoHomeButtonProps> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center space-x-2 focus:outline-none"
    style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
  >
    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
      <span className="text-white font-bold text-lg">E</span>
    </div>
    <span className="text-xl font-bold text-secondary-900">EduMarket</span>
  </button>
);

export default LogoHomeButton; 
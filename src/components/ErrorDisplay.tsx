import React from 'react';

interface ErrorDisplayProps {
  error?: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;
  return (
    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-700 text-sm">{error}</p>
    </div>
  );
};

export default ErrorDisplay; 
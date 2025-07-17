import React from 'react';
import { Sparkles } from 'lucide-react';

interface SuggestionAIProps {
  loading: boolean;
  error?: string | null;
  onSuggest: () => void;
}

const SuggestionAI: React.FC<SuggestionAIProps> = ({ loading, error, onSuggest }) => {
  return (
    <>
      <button
        onClick={onSuggest}
        disabled={loading}
        className="h-12 flex items-center space-x-2 btn-primary px-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-4 h-4" />
        <span>{loading ? 'Đang xử lý...' : 'Gợi ý sản phẩm phù hợp'}</span>
      </button>
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-lg w-full text-center mt-2">
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}
    </>
  );
};

export default SuggestionAI; 
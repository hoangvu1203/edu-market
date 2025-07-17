import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Filter as FilterIcon, Search, Heart, User, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { categories, levels, priceRanges } from '../data/mockData';
import { formatPriceRange } from '../utils/helpers';
import { apiService } from '../services/api';
import SearchBar from './SearchBar';
import Filter from './Filter';
import SuggestionAI from './SuggestionAI';

const defaultFilters = {
  priceRange: 'Tất cả',
  category: 'Tất cả',
  level: 'Tất cả',
};
type TabKey = 'category' | 'level' | 'priceRange';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'category', label: 'Danh mục' },
  { key: 'level', label: 'Trình độ' },
  { key: 'priceRange', label: 'Khoảng giá' },
];

const Header: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownCloseTimeout = useRef<NodeJS.Timeout | null>(null);
  // FilterBar state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('category');
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Scroll state for background change
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      // Adjust this value to match your hero section height
      setScrolledPastHero(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    }
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: searchQuery });
      navigate('/');
    }
  };

  const handleGoHome = () => {
    dispatch({ type: 'SET_FILTERS', payload: defaultFilters });
    dispatch({ type: 'SET_SUGGESTIONS', payload: [] });
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    setSearchQuery(''); // Clear local search input
    navigate('/');
  };

  const favoriteCount = state.user.favorites.length;

  const handleViewHistory = () => {
    setUserDropdownOpen(false);
    navigate('/view-history');
  };

  // Handler for search bar
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    dispatch({ type: 'SET_SEARCH_QUERY', payload: value });
  };
  // Handler for filter change
  const handleFilterChange = (type: string, value: string) => {
    dispatch({ type: 'SET_FILTERS', payload: { ...state.filters, [type]: value } });
  };
  // Handler for AI suggestion
  const handleAISuggestions = async () => {
    dispatch({ type: 'SET_FILTERS', payload: defaultFilters });
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getSuggestions({
        favorites: state.user.favorites,
        viewHistory: state.user.viewHistory,
      });
      if (response.success) {
        dispatch({ type: 'SET_SUGGESTIONS', payload: response.data });
        dispatch({ type: 'SET_ERROR', payload: null });
      } else {
        dispatch({ type: 'SET_SUGGESTIONS', payload: [] });
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Không thể lấy gợi ý lúc này.' });
      }
    } catch (error) {
      dispatch({ type: 'SET_SUGGESTIONS', payload: [] });
      dispatch({ type: 'SET_ERROR', payload: 'Không thể lấy gợi ý lúc này. Vui lòng thử lại sau.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  const tabOptions: Record<TabKey, string[]> = {
    category: categories,
    level: levels,
    priceRange: priceRanges,
  };

  return (
    <header
      className={`shadow-sm border-b border-secondary-200 sticky top-0 z-50 transition-colors duration-500 ${
        scrolledPastHero
          ? 'bg-gradient-to-r from-blue-100 to-blue-50'
          : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* First Row: Logo, Navigation, User Menu */}
        <div className="flex justify-between items-center min-h-[72px]">
          {/* Logo */}
          <button
            type="button"
            onClick={handleGoHome}
            className="flex items-center space-x-2 focus:outline-none"
            style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-secondary-900">EduMarket</span>
          </button>
          {/* Desktop Navigation/User Menu (unchanged) */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              type="button"
              onClick={handleGoHome}
              className="text-secondary-700 hover:text-primary-600 transition-colors duration-200 bg-transparent border-none cursor-pointer text-base font-normal"
              style={{ padding: 0, margin: 0 }}
            >
              Home
            </button>
            <Link
              to="/favorites"
              className="relative text-secondary-700 hover:text-primary-600 transition-colors duration-200"
            >
              <Heart className="w-5 h-5" />
              {favoriteCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </Link>
            {/* User Dropdown */}
            <div
              className="relative"
              ref={userDropdownRef}
              onMouseEnter={() => {
                if (userDropdownCloseTimeout.current) {
                  clearTimeout(userDropdownCloseTimeout.current);
                }
                setUserDropdownOpen(true);
              }}
              onMouseLeave={() => {
                if (userDropdownCloseTimeout.current) {
                  clearTimeout(userDropdownCloseTimeout.current);
                }
                userDropdownCloseTimeout.current = setTimeout(() => {
                  setUserDropdownOpen(false);
                }, 200);
              }}
            >
              {/* Wrapper ensures both button and dropdown are in the hover area */}
              <div>
                <button
                  className="flex items-center space-x-2 text-secondary-700 hover:text-primary-600 px-2 py-1 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-haspopup="true"
                  aria-expanded={userDropdownOpen}
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{state.user.name}</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-secondary-200 rounded-lg shadow-lg z-50 animate-fade-in">
                    <div className="px-4 py-3 text-secondary-700 border-b border-secondary-100 cursor-default">
                      <div className="font-semibold">{state.user.name}</div>
                      <div className="text-xs text-secondary-500">{state.user.email}</div>
                    </div>
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-secondary-50 text-secondary-700 transition-colors duration-200"
                      onClick={handleViewHistory}
                    >
                      View History
                    </button>
                    <button
                      className="w-full text-left px-4 py-3 text-secondary-400 cursor-not-allowed"
                      disabled
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-secondary-700 hover:text-primary-600 hover:bg-secondary-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {/* Second Row: Filter, Search, Suggestion */}
        {location.pathname !== '/favorites' && location.pathname !== '/view-history' && (
          <div className="flex w-full flex-row items-center gap-3 mt-6 pb-2 h-12">
            <div className="flex-shrink-0 h-full relative">
              <Filter filters={state.filters} onChange={handleFilterChange} />
            </div>
            {/* SearchBar chỉ hiện trên desktop */}
            <div className="flex-grow w-full h-full items-center hidden md:flex">
              <SearchBar value={searchQuery} onChange={handleSearchChange} />
            </div>
            <div className="flex-shrink-0 h-full flex items-center">
              <SuggestionAI loading={state.loading} error={state.error} onSuggest={handleAISuggestions} />
            </div>
          </div>
        )}

        {/* Mobile SearchBar: chỉ hiện trên mobile */}
        {location.pathname !== '/favorites' && location.pathname !== '/view-history' && (
          <div className="md:hidden pb-4">
            <SearchBar value={searchQuery} onChange={handleSearchChange} />
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-secondary-200">
            <nav className="flex flex-col space-y-4 pt-4">
              <button
                type="button"
                onClick={() => { handleGoHome(); setIsMobileMenuOpen(false); }}
                className="text-secondary-700 hover:text-primary-600 transition-colors duration-200 bg-transparent border-none cursor-pointer text-base font-normal"
                style={{ padding: 0, margin: 0 }}
              >
                Home
              </button>
              <Link
                to="/favorites"
                className="flex items-center space-x-2 text-secondary-700 hover:text-primary-600 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="w-5 h-5" />
                <span>Favorites</span>
                {favoriteCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoriteCount}
                  </span>
                )}
              </Link>
              {/* User Dropdown for Mobile */}
              <button
                className="flex items-center space-x-2 text-secondary-700 hover:text-primary-600 px-2 py-1 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => setUserDropdownOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={userDropdownOpen}
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">{state.user.name}</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {userDropdownOpen && (
                <div className="mt-2 w-full bg-white border border-secondary-200 rounded-lg shadow-lg z-50 animate-fade-in">
                  <div className="px-4 py-3 text-secondary-700 border-b border-secondary-100 cursor-default">
                    <div className="font-semibold">{state.user.name}</div>
                    <div className="text-xs text-secondary-500">{state.user.email}</div>
                  </div>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-secondary-50 text-secondary-700 transition-colors duration-200"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setIsMobileMenuOpen(false);
                      navigate('/view-history');
                    }}
                  >
                    View History
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 text-secondary-400 cursor-not-allowed"
                    disabled
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 
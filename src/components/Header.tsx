import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Filter as FilterIcon, Search, Heart, User, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { categories, levels } from '../data/mockData';
import { apiService } from '../services/api';
import SearchBar from './SearchBar';
import Filter from './Filter';
import SuggestionAI from './SuggestionAI';
import LogoHomeButton from './LogoHomeButton';
import FavoritesButton from './FavoritesButton';
import UserMenu from './UserMenu';

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
  const userDropdownRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
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

  useEffect(() => {
    // Only apply on mobile menu open
    if (!isMobileMenuOpen) return;
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
  }, [userDropdownOpen, isMobileMenuOpen]);

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
          <LogoHomeButton onClick={handleGoHome} />
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
            <FavoritesButton count={favoriteCount} onClick={() => navigate('/favorites')} />
            {/* User Dropdown */}
            <UserMenu
              user={state.user}
              open={userDropdownOpen}
              setOpen={setUserDropdownOpen}
              onViewHistory={handleViewHistory}
              userDropdownRef={userDropdownRef}
              userDropdownCloseTimeout={userDropdownCloseTimeout}
            />
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
              <UserMenu
                user={state.user}
                open={userDropdownOpen}
                setOpen={setUserDropdownOpen}
                onViewHistory={handleViewHistory}
                userDropdownRef={userDropdownRef}
                userDropdownCloseTimeout={userDropdownCloseTimeout}
                isMobile={true}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                navigate={navigate}
              />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 
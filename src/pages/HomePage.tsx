import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Package } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { apiService } from '../services/api';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { Product } from '../types';
import ErrorDisplay from '../components/ErrorDisplay';

// 1. Imports
// 2. Default filter values
const defaultFilters = {
  priceRange: 'Tất cả',
  category: 'Tất cả',
  level: 'Tất cả',
};

/**
 * HomePage - Trang chủ hiển thị danh sách sản phẩm, tìm kiếm, lọc và gợi ý AI
 * Sử dụng context để lấy state, dispatch và xử lý các thao tác chính
 */
const HomePage: React.FC = () => {
  // Lấy state và dispatch từ context
  const { state, dispatch } = useAppContext();
  // State cho modal chi tiết sản phẩm
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Số lượng sản phẩm hiển thị trên trang chủ (tăng dần khi bấm 'Xem thêm')
  const [visibleCount, setVisibleCount] = useState(8);
  // Lưu lại số lượng gợi ý trước đó để phát hiện thay đổi
  const prevSuggestionsLength = useRef(state.suggestions.length);

  // --- Giá trị dẫn xuất ---
  // Nếu có gợi ý AI thì ưu tiên hiển thị, không thì dùng danh sách đã lọc
  const displayProducts = state.suggestions.length > 0 ? state.suggestions : state.filteredProducts;

  // Kiểm tra có phải trạng thái mặc định trang chủ không (không tìm kiếm, không lọc, không gợi ý)
  const isHomeDefault =
    !state.searchQuery &&
    state.suggestions.length === 0 &&
    state.filters.category === 'All' &&
    state.filters.level === 'All' &&
    state.filters.priceRange === 'All';

  // Giới hạn số lượng sản phẩm trên trang chủ, bấm 'Xem thêm' để tăng
  const HOMEPAGE_LIMIT = 8;
  const productsToShow = isHomeDefault ? displayProducts.slice(0, visibleCount) : displayProducts;

  // --- useEffect ---
  // Reset filter về mặc định khi vào trang chủ
  useEffect(() => {
    dispatch({ type: 'SET_FILTERS', payload: defaultFilters });
  }, [dispatch]);

  // Theo dõi thay đổi số lượng gợi ý để reset filter nếu cần
  useEffect(() => {
    if (prevSuggestionsLength.current !== state.suggestions.length) {
      prevSuggestionsLength.current = state.suggestions.length;
    }
  }, [state.suggestions.length, dispatch]);

  // Tải danh sách sản phẩm khi mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await apiService.getProducts();
        dispatch({ type: 'SET_PRODUCTS', payload: response.data });
        dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: response.data });
      } catch (error) {
        console.error('Error loading products:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Không thể tải danh sách sản phẩm' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    loadProducts();
  }, [dispatch]);

  // Lọc sản phẩm khi search/filter thay đổi
  useEffect(() => {
    const filterProducts = async () => {
      try {
        const response = await apiService.searchProducts(state.searchQuery, state.filters);
        dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: response.data });
      } catch (error) {
        console.error('Error filtering products:', error);
      }
    };
    filterProducts();
  }, [state.searchQuery, state.filters, dispatch]);

  // Reset số lượng hiển thị khi không ở trang chủ mặc định
  useEffect(() => {
    if (!isHomeDefault) {
      setVisibleCount(HOMEPAGE_LIMIT);
    }
  }, [isHomeDefault]);

  // --- Handler ---
  // Xem chi tiết sản phẩm (mở modal)
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Đóng modal chi tiết
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Xóa gợi ý AI và reset filter
  const handleClearSuggestions = () => {
    dispatch({ type: 'SET_SUGGESTIONS', payload: [] });
    dispatch({ type: 'SET_FILTERS', payload: defaultFilters });
  };

  // Hiển thị lại toàn bộ sản phẩm (reset search, filter, gợi ý)
  const handleViewAllProducts = () => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    dispatch({ type: 'SET_FILTERS', payload: defaultFilters });
    dispatch({ type: 'SET_SUGGESTIONS', payload: [] });
    setVisibleCount(HOMEPAGE_LIMIT);
  };

  // Bấm 'Xem thêm' để tăng số lượng sản phẩm hiển thị
  const handleSeeMore = () => setVisibleCount((prev) => prev + HOMEPAGE_LIMIT);

  // Lấy danh sách sản phẩm đang sale để hiển thị slider
  const saleCourses = state.products.filter((product) => product.originalPrice);
  const sliderRef = useRef<HTMLDivElement>(null);
  // Scroll slider trái/phải
  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth * 0.7;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-100 to-blue-50 py-10 md:py-16 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4 sm:px-6 lg:px-8 gap-8">
          {/* Hero Text */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary-600 mb-4 leading-tight">
              Nền tảng học tập hiện đại cho mọi người
            </h1>
            <p className="text-lg md:text-xl text-secondary-700 mb-6">
              Khám phá hàng trăm khóa học chất lượng, phát triển kỹ năng và sự nghiệp của bạn với EduMarket.
            </p>
            <a href="#" className="btn-primary px-8 py-3 text-lg font-semibold shadow-md">
              Bắt đầu ngay
            </a>
          </div>
          {/* Hero Image */}
          <div className="flex-1 flex justify-center md:justify-end">
            <img
              src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80"
              alt="Online Learning"
              className="w-full max-w-md rounded-xl shadow-lg object-cover"
            />
          </div>
        </div>
      </section>
      {saleCourses.length > 0 && state.suggestions.length === 0 && (
        <section className="w-full py-8 mb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-secondary-200 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-primary-600">Khóa học đang giảm giá</h2>
                <div className="flex gap-2">
                  <button
                    className="p-2 rounded-full bg-white border border-secondary-200 shadow hover:bg-primary-100 transition-colors"
                    onClick={() => scrollSlider('left')}
                    aria-label="Scroll left"
                  >
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button
                    className="p-2 rounded-full bg-white border border-secondary-200 shadow hover:bg-primary-100 transition-colors"
                    onClick={() => scrollSlider('right')}
                    aria-label="Scroll right"
                  >
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
              <div className="relative">
                <div
                  ref={sliderRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {saleCourses.map((product: Product) => (
                    <div key={product.id} className="min-w-[320px] max-w-xs flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
                      <ProductCard product={product} onViewDetails={handleViewDetails} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title and ErrorDisplay remain */}
        <ErrorDisplay error={state.error} />

        {/* Page Title */}
        <div className="mb-8">
          {state.suggestions.length > 0 ? (
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary-600" />
              <h1 className="text-2xl font-bold text-secondary-900">
                Gợi ý sản phẩm phù hợp với bạn
              </h1>
            </div>
          ) : (
            <h1 className="text-2xl font-bold text-secondary-900 mb-4 text-center">
              Khám phá thêm các khóa học khác
            </h1>
          )}
          {state.searchQuery && (
            <p className="text-secondary-600">
              Kết quả tìm kiếm cho "{state.searchQuery}"
            </p>
          )}
        </div>

        {/* Loading State */}
        {state.loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></span>
          </div>
        ) : null}

        {/* Products Grid */}
        {!state.loading && (
          <>
            {productsToShow.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsToShow.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-secondary-600">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm sản phẩm phù hợp.
                </p>
              </div>
            )}
            {/* 'Xem thêm' button for homepage */}
            {isHomeDefault && visibleCount < displayProducts.length && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleSeeMore}
                  className="btn-secondary"
                >
                  Xem thêm
                </button>
              </div>
            )}
          </>
        )}

        {/* 'Xem tất cả sản phẩm' Button after search or filters or suggestions */}
        {(state.searchQuery || state.suggestions.length > 0 || !isHomeDefault) && (displayProducts.length > 0) && (
          <div className="mt-8 text-center">
            <button
              onClick={handleViewAllProducts}
              className="btn-secondary"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}
      </main>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default HomePage; 
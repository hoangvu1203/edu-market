import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { Product } from '../types';

/**
 * FavoritesPage - Trang hiển thị danh sách sản phẩm yêu thích của người dùng
 * Sử dụng context để lấy danh sách yêu thích và mở modal xem chi tiết
 */
const FavoritesPage: React.FC = () => {
  // Lấy state từ context
  const { state } = useAppContext();
  // State cho modal chi tiết sản phẩm
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lọc danh sách sản phẩm yêu thích từ state
  const favoriteProducts = state.products.filter((product) =>
    state.user.favorites.includes(product.id)
  );

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

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Heart className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-bold text-secondary-900">
              Sản phẩm yêu thích
            </h1>
          </div>
          <p className="text-secondary-600">
            Bạn có {favoriteProducts.length} sản phẩm trong danh sách yêu thích
          </p>
        </div>

        {/* Favorites Grid */}
        {favoriteProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
            {/* Xem tất cả sản phẩm button */}
            <div className="mt-8 text-center">
              <a
                href="/"
                className="btn-secondary"
                onClick={() => {
                  // Reset filters, search, and suggestions when navigating home
                  if (window && window.localStorage) {
                    window.localStorage.removeItem('edu_marketplace_filters');
                    window.localStorage.removeItem('edu_marketplace_search');
                    window.localStorage.removeItem('edu_marketplace_suggestions');
                  }
                }}
              >
                Xem tất cả sản phẩm
              </a>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Chưa có sản phẩm yêu thích
            </h3>
            <p className="text-secondary-600 mb-6">
              Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.
            </p>
            <a
              href="/"
              className="btn-primary"
            >
              Khám phá khóa học
            </a>
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

export default FavoritesPage; 
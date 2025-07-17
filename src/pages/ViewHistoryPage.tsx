import React, { useState } from 'react';
import { History } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { Product } from '../types';

const ViewHistoryPage: React.FC = () => {
  const { state } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get viewed products in order (most recent first)
  const viewedProducts = state.user.viewHistory
    .map((id) => state.products.find((p) => p.id === id))
    .filter((p): p is Product => !!p);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

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
            <History className="w-6 h-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-secondary-900">
              Lịch sử xem sản phẩm
            </h1>
          </div>
          <p className="text-secondary-600">
            Bạn đã xem {viewedProducts.length} sản phẩm gần đây
          </p>
        </div>

        {/* Viewed Products Grid */}
        {viewedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {viewedProducts.map((product) => (
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
            <History className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Bạn chưa xem sản phẩm nào
            </h3>
            <p className="text-secondary-600 mb-6">
              Hãy khám phá các khoá học để xem lịch sử tại đây.
            </p>
            <a
              href="/"
              className="btn-primary"
            >
              Khám phá khoá học
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

export default ViewHistoryPage; 
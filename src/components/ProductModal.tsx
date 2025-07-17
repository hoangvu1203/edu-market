import React from 'react';
import { X, Heart, Star, Clock, User, Tag, CheckCircle } from 'lucide-react';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import { formatPrice, calculateDiscount, generateStars, isFavorite } from '../utils/helpers';
import { apiService } from '../services/api';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ProductModal - Hiển thị modal chi tiết sản phẩm (khóa học)
 * @param product - Sản phẩm cần xem chi tiết
 * @param isOpen - Modal đang mở hay đóng
 * @param onClose - Hàm đóng modal
 */
const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  // Lấy state và dispatch từ context để xử lý yêu thích
  const { state, dispatch } = useAppContext();

  // Nếu chưa có sản phẩm hoặc modal đóng thì không render gì cả
  if (!product || !isOpen) return null;

  // Kiểm tra sản phẩm đã được yêu thích chưa
  const isFavorited = isFavorite(product.id, state.user.favorites);

  // Xử lý khi bấm nút yêu thích trong modal
  const handleFavoriteToggle = async () => {
    try {
      if (isFavorited) {
        await apiService.removeFromFavorites(state.user.id, product.id);
        dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: product.id });
      } else {
        await apiService.addToFavorites(state.user.id, product.id);
        dispatch({ type: 'ADD_TO_FAVORITES', payload: product.id });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">Chi tiết khóa học</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-secondary-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image and Basic Info */}
            <div className="space-y-6">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {product.originalPrice && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded">
                    -{calculateDiscount(product.originalPrice, product.price)}%
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-primary-600 font-medium uppercase tracking-wide">
                    {product.category}
                  </span>
                  <h1 className="text-2xl font-bold text-secondary-900 mt-1">
                    {product.name}
                  </h1>
                </div>

                {/* Instructor */}
                {product.instructor && (
                  <div className="flex items-center space-x-2 text-secondary-600">
                    <User className="w-5 h-5" />
                    <span>Giảng viên: {product.instructor}</span>
                  </div>
                )}

                {/* Course Details */}
                <div className="flex items-center space-x-6 text-sm text-secondary-600">
                  {product.duration && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{product.duration}</span>
                    </div>
                  )}
                  {product.level && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                      product.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.level === 'Beginner' ? 'Cơ bản' : product.level === 'Intermediate' ? 'Trung bình' : 'Nâng cao'}
                    </span>
                  )}
                </div>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {generateStars(product.rating)}
                    </div>
                    <span className="text-secondary-600">
                      {product.rating} ({product.reviewCount} đánh giá)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Description and Actions */}
            <div className="space-y-6">
              {/* Price */}
              <div className="bg-secondary-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-secondary-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-secondary-500 line-through ml-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleFavoriteToggle}
                    className={`p-3 rounded-full transition-colors duration-200 ${
                      isFavorited 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-secondary-600 hover:bg-red-500 hover:text-white border border-secondary-300'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">Mô tả khóa học</h3>
                <p className="text-secondary-600 leading-relaxed">
                  {product.longDescription || product.description}
                </p>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* What you'll learn */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">Bạn sẽ học được gì?</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-secondary-600">Nắm vững kiến thức cơ bản đến nâng cao</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-secondary-600">Thực hành với các dự án thực tế</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-secondary-600">Hỗ trợ từ giảng viên và cộng đồng</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-secondary-600">Chứng chỉ hoàn thành khóa học</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full btn-primary py-3 text-lg">
                  Đăng ký khóa học
                </button>
                <button className="w-full btn-secondary py-3 text-lg">
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal; 
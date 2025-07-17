import React from 'react';
import { Heart, Star, Clock, User } from 'lucide-react';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import { formatPrice, calculateDiscount, generateStars, isFavorite } from '../utils/helpers';
import { apiService } from '../services/api';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

/**
 * ProductCard - Hiển thị thông tin tóm tắt của một sản phẩm (khóa học)
 * @param product - Thông tin sản phẩm
 * @param onViewDetails - Hàm callback khi bấm xem chi tiết
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  // Lấy state và dispatch từ context để xử lý yêu thích, lịch sử
  const { state, dispatch } = useAppContext();
  // Kiểm tra sản phẩm đã được yêu thích chưa
  const isFavorited = isFavorite(product.id, state.user.favorites);

  // Xử lý khi bấm nút yêu thích (trái tim)
  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Không cho click lan ra ngoài card
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

  // Khi click vào card, thêm vào lịch sử xem và mở modal chi tiết
  const handleCardClick = () => {
    dispatch({ type: 'ADD_TO_VIEW_HISTORY', payload: product.id });
    onViewDetails(product);
  };

  return (
    <div 
      className="card h-[600px] flex flex-col justify-between p-4 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="relative mb-2">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
        />
        
        {/* Discount Badge */}
        {product.originalPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
            -{calculateDiscount(product.originalPrice, product.price)}%
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors duration-200 ${
            isFavorited 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-secondary-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </div>
      {/* Main Content (flex-1) */}
      <div className="flex-1 flex flex-col">
        {/* Category */}
        <div className="text-xs text-primary-600 font-medium uppercase tracking-wide">
          {product.category}
        </div>
        {/* Title & Description Box with fixed height */}
        <div className="h-24 flex flex-col justify-start overflow-hidden">
          <h3 className="font-semibold text-secondary-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {product.name}
          </h3>
          <p className="text-sm text-secondary-600 line-clamp-2">
            {product.description}
          </p>
        </div>
        {/* Instructor */}
        {product.instructor && (
          <div className="flex items-center text-sm text-secondary-500 mt-1">
            <User className="w-4 h-4 mr-1" />
            {product.instructor}
          </div>
        )}
        {/* Course Details */}
        <div className="flex items-center justify-between text-sm text-secondary-500 mt-1">
          {product.duration && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {product.duration}
            </div>
          )}
          {product.level && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
          <div className="flex items-center space-x-1 mt-1">
            <div className="flex text-yellow-400">
              {generateStars(product.rating)}
            </div>
            <span className="text-sm text-secondary-600">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        )}
        {/* Price */}
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-lg font-bold text-secondary-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-secondary-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
      {/* View Details Button pinned to bottom */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleCardClick();
        }}
        className="w-full btn-primary mt-2"
        style={{ marginTop: 'auto' }}
      >
        Xem chi tiết
      </button>
    </div>
  );
};

export default ProductCard; 
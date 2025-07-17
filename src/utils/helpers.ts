/**
 * formatPrice - Định dạng số thành tiền Việt Nam Đồng
 * @param price - Số tiền
 * @returns Chuỗi định dạng VND
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * formatPriceRange - Định dạng chuỗi khoảng giá cho UI
 */
export const formatPriceRange = (range: string): string => {
  switch (range) {
    case '<500K':
      return '<500K';
    case '500K–1 triệu':
      return '500K–1 triệu';
    case '>1 triệu':
      return '>1 triệu';
    default:
      return 'Tất cả';
  }
};

/**
 * calculateDiscount - Tính phần trăm giảm giá
 */
export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

/**
 * generateStars - Tạo chuỗi hiển thị số sao đánh giá
 */
export const generateStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
};

/**
 * truncateText - Cắt ngắn chuỗi nếu vượt quá độ dài cho phép
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * debounce - Trì hoãn thực thi hàm (dùng cho search real-time)
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * isFavorite - Kiểm tra sản phẩm có trong danh sách yêu thích không
 */
export const isFavorite = (productId: string, favorites: string[]): boolean => {
  return favorites.includes(productId);
};

/**
 * getProductsByIds - Lấy danh sách sản phẩm theo mảng ID
 */
export const getProductsByIds = (productIds: string[], allProducts: any[]): any[] => {
  return allProducts.filter(product => productIds.includes(product.id));
};

/**
 * Simulate network/API delay for mock API calls.
 * Usage: await delay(500) // waits 500ms
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); 
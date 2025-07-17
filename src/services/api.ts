import axios from 'axios';
import { Product, ApiResponse } from '../types';
import { mockProducts } from '../data/mockData';
import { delay } from '../utils/helpers';

// Mock API base URL
const API_BASE_URL = 'https://api.edumarketplace.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Helper loại bỏ sản phẩm đã yêu thích/xem và tránh trùng lặp
function excludeAndUnique(products: Product[], excludeIds: Set<string>, already: Set<string>) {
  const result: Product[] = [];
  for (const p of products) {
    if (!excludeIds.has(p.id) && !already.has(p.id)) {
      result.push(p);
      already.add(p.id);
    }
  }
  return result;
}

/**
 * apiService - Mock API cho toàn bộ thao tác sản phẩm, gợi ý AI, tìm kiếm...
 * Các hàm đều trả về Promise để mô phỏng gọi API thực tế
 */
export const apiService = {
  /**
   * Lấy toàn bộ sản phẩm (mock)
   * @returns {Promise<ApiResponse<Product[]>>} Danh sách sản phẩm
   */
  async getProducts(): Promise<ApiResponse<Product[]>> {
    await delay(500);
    return {
      data: mockProducts,
      success: true,
      message: 'Products retrieved successfully'
    };
  },

  /**
   * Lấy sản phẩm theo ID (mock)
   * @param {string} id - ID sản phẩm
   * @returns {Promise<ApiResponse<Product>>} Sản phẩm nếu tìm thấy
   */
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    await delay(300);
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return {
      data: product,
      success: true,
      message: 'Product retrieved successfully'
    };
  },

  /**
   * Gợi ý sản phẩm dựa trên yêu thích và lịch sử xem (mock AI)
   * @param {Object} params - Tham số gồm favorites và viewHistory
   * @returns {Promise<ApiResponse<Product[]>>} Danh sách gợi ý
   */
  async getSuggestions({ favorites, viewHistory }: { favorites: string[]; viewHistory: string[] }): Promise<ApiResponse<Product[]>> {
    await delay(1000); // Giả lập thời gian xử lý AI

    const excludeIds = new Set([...favorites, ...viewHistory]);
    const already = new Set<string>();

    // Nếu user đã có yêu thích/xem thì gợi ý theo category đã tương tác
    if ((favorites && favorites.length > 0) || (viewHistory && viewHistory.length > 0)) {
      const favoriteProducts = mockProducts.filter(p => favorites.includes(p.id));
      const historyProducts = mockProducts.filter(p => viewHistory.includes(p.id));
      const favCategories = new Set(favoriteProducts.map(p => p.category));
      const historyCategories = new Set(historyProducts.map(p => p.category));
      const allCategories = Array.from(favCategories).concat(Array.from(historyCategories));
      const allCategoriesSet = new Set(allCategories);
      // Gợi ý tất cả sản phẩm cùng category, loại trừ đã thích/xem
      const suggestions = excludeAndUnique(
        mockProducts.filter(p => allCategoriesSet.has(p.category)),
        excludeIds,
        already
      );
      if (suggestions.length === 0) {
        return {
          data: [],
          success: false,
          message: 'Không thể lấy gợi ý lúc này.'
        };
      }
      return {
        data: suggestions,
        success: true,
        message: 'AI suggestions generated successfully'
      };
    }

    // Nếu user chưa có yêu thích/xem, gợi ý top 4 sản phẩm nổi bật
    const suggestions = mockProducts
      .filter(p => p.rating && p.rating >= 4.5)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
    return {
      data: suggestions,
      success: true,
      message: 'AI suggestions generated successfully'
    };
  },

  /**
   * Tìm kiếm sản phẩm theo query và filter (mock)
   * @param {string} query - Từ khóa tìm kiếm
   * @param {any} filters - Bộ lọc (category, level, priceRange)
   * @returns {Promise<ApiResponse<Product[]>>} Danh sách sản phẩm phù hợp
   */
  async searchProducts(query: string, filters: any): Promise<ApiResponse<Product[]>> {
    await delay(400);
    let filteredProducts = mockProducts;

    // Map giá trị filter từ UI (tiếng Việt) sang data (tiếng Anh)
    const levelMap: Record<string, string> = {
      'Tất cả': 'All',
      'Cơ bản': 'Beginner',
      'Trung bình': 'Intermediate',
      'Nâng cao': 'Advanced',
      'Beginner': 'Beginner',
      'Intermediate': 'Intermediate',
      'Advanced': 'Advanced',
    };
    const priceMap: Record<string, string> = {
      'Tất cả': 'All',
      '<500K': 'Under 500K',
      '500K–1 triệu': '500K - 1M',
      '>1 triệu': 'Over 1M',
      'Under 500K': 'Under 500K',
      '500K - 1M': '500K - 1M',
      'Over 1M': 'Over 1M',
    };

    // Lọc theo từ khóa
    if (query) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Lọc theo category (nếu không phải 'Tất cả')
    if (filters.category && filters.category !== 'Tất cả') {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }

    // Lọc theo level
    const mappedLevel = levelMap[filters.level] || filters.level;
    if (mappedLevel && mappedLevel !== 'All') {
      filteredProducts = filteredProducts.filter(p => p.level === mappedLevel);
    }

    // Lọc theo price range
    const mappedPrice = priceMap[filters.priceRange] || filters.priceRange;
    if (mappedPrice && mappedPrice !== 'All') {
      switch (mappedPrice) {
        case 'Under 500K':
          filteredProducts = filteredProducts.filter(p => p.price < 500000);
          break;
        case '500K - 1M':
          filteredProducts = filteredProducts.filter(p => p.price >= 500000 && p.price <= 1000000);
          break;
        case 'Over 1M':
          filteredProducts = filteredProducts.filter(p => p.price > 1000000);
          break;
      }
    }
    return {
      data: filteredProducts,
      success: true,
      message: 'Products filtered successfully'
    };
  },

  /**
   * Thêm sản phẩm vào danh sách yêu thích của người dùng (mock)
   * @param {string} userId - ID người dùng
   * @param {string} productId - ID sản phẩm
   * @returns {Promise<ApiResponse<boolean>>} Trạng thái thành công
   */
  async addToFavorites(userId: string, productId: string): Promise<ApiResponse<boolean>> {
    await delay(200);
    // Trong một ứng dụng thực tế, điều này sẽ cập nhật danh sách yêu thích của người dùng trong cơ sở dữ liệu
    return {
      data: true,
      success: true,
      message: 'Added to favorites successfully'
    };
  },

  /**
   * Xóa sản phẩm khỏi danh sách yêu thích của người dùng (mock)
   * @param {string} userId - ID người dùng
   * @param {string} productId - ID sản phẩm
   * @returns {Promise<ApiResponse<boolean>>} Trạng thái thành công
   */
  async removeFromFavorites(userId: string, productId: string): Promise<ApiResponse<boolean>> {
    await delay(200);
    // Trong một ứng dụng thực tế, điều này sẽ xóa khỏi danh sách yêu thích của người dùng trong cơ sở dữ liệu
    return {
      data: true,
      success: true,
      message: 'Removed from favorites successfully'
    };
  },

  /**
   * Lấy tất cả sản phẩm yêu thích của người dùng (mock)
   * @param {string} userId - ID người dùng
   * @returns {Promise<ApiResponse<Product[]>>} Danh sách sản phẩm yêu thích
   */
  async getUserFavorites(userId: string): Promise<ApiResponse<Product[]>> {
    await delay(300);
    // const user = mockUser; // mockUser is removed, so this line is commented out or removed if not needed
    const favoriteProducts = mockProducts.filter(p => /* user.favorites.includes(p.id) */ true); // Assuming mockUser.favorites is not available, so this line is commented out or removed if not needed
    
    return {
      data: favoriteProducts,
      success: true,
      message: 'Favorites retrieved successfully'
    };
  },

  /**
   * Ghi nhận lượt xem sản phẩm cho người dùng (mock)
   * @param {string} userId - ID người dùng
   * @param {string} productId - ID sản phẩm
   * @returns {Promise<ApiResponse<boolean>>} Trạng thái thành công
   */
  async recordProductView(userId: string, productId: string): Promise<ApiResponse<boolean>> {
    await delay(100);
    // Trong một ứng dụng thực tế, điều này sẽ ghi nhận lượt xem trong cơ sở dữ liệu
    return {
      data: true,
      success: true,
      message: 'View recorded successfully'
    };
  }
};

export default api; 
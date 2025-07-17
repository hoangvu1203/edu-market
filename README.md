# EduMarket - Sàn Giáo Dục Thương Mại Điện Tử Tích Hợp AI

Một ứng dụng Front-end hiện đại cho sàn giáo dục thương mại điện tử với tính năng AI gợi ý sản phẩm thông minh.

## 🚀 Tính Năng Chính

### 1. Hiển Thị Danh Sách Sản Phẩm
- Hiển thị danh sách khóa học với thông tin chi tiết
- Mỗi sản phẩm bao gồm: tên, giá, ảnh, mô tả, đánh giá
- Responsive design cho mọi thiết bị

### 2. Tìm Kiếm và Lọc
- Thanh tìm kiếm theo tên sản phẩm
- Bộ lọc theo danh mục, cấp độ, khoảng giá
- Tìm kiếm real-time với debounce

### 3. Gợi Ý Thông Minh (AI)
- Nút "Gợi ý sản phẩm phù hợp" 
- AI phân tích hành vi người dùng (đã xem, đã thích)
- Gợi ý dựa trên sở thích và lịch sử

### 4. Modal Chi Tiết Sản Phẩm
- Modal hiển thị thông tin đầy đủ sản phẩm
- Ảnh lớn, mô tả chi tiết, đánh giá
- Nút thêm vào yêu thích và đăng ký

### 5. Quản Lý Yêu Thích
- Thêm/xóa sản phẩm khỏi danh sách yêu thích
- Trang riêng hiển thị sản phẩm đã yêu thích
- Đếm số lượng yêu thích trên header

### 6. Lịch Sử Xem
- Tự động ghi lại sản phẩm đã xem
- Sử dụng cho AI gợi ý

## 🛠 Công Nghệ Sử Dụng

- **React 19** - Framework chính
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Context API** - State management

## 📁 Cấu Trúc Dự Án

```
src/
├── components/          # React components
│   ├── Header.tsx      # Header với navigation
│   ├── FilterBar.tsx   # Bộ lọc và tìm kiếm
│   ├── ProductCard.tsx # Card hiển thị sản phẩm
│   └── ProductModal.tsx # Modal chi tiết sản phẩm
├── pages/              # Page components
│   ├── HomePage.tsx    # Trang chủ
│   └── FavoritesPage.tsx # Trang yêu thích
├── context/            # React Context
│   └── AppContext.tsx  # Global state management
├── services/           # API services
│   └── api.ts         # Mock API calls
├── data/              # Mock data
│   └── mockData.ts    # Sample products và user data
├── types/             # TypeScript interfaces
│   └── index.ts       # Type definitions
├── utils/             # Utility functions
│   └── helpers.ts     # Helper functions
└── App.tsx            # Main App component
```

## 🚀 Cài Đặt và Chạy

### Yêu Cầu Hệ Thống
- Node.js 16+ 
- npm hoặc yarn

### Bước 1: Clone Repository
```bash
git clone <repository-url>
cd edu-marketplace
```

### Bước 2: Cài Đặt Dependencies
```bash
npm install
```

### Bước 3: Chạy Ứng Dụng
```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### Bước 4: Build Production
```bash
npm run build
```

## 🎨 Tính Năng UI/UX

### Design System
- **Màu sắc**: Primary blue, Secondary gray palette
- **Typography**: Inter font family
- **Spacing**: Consistent spacing system
- **Components**: Reusable component library

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Adaptive layouts cho mọi thiết bị

### Animations & Transitions
- Hover effects trên cards
- Smooth transitions
- Loading states
- Modal animations

## 🤖 Tính Năng AI

### Gợi Ý Thông Minh
- Phân tích hành vi người dùng
- Gợi ý dựa trên sở thích
- Fallback về sản phẩm phổ biến
- Loading skeleton khi xử lý

### Mock AI Logic
```typescript
// Gợi ý dựa trên category và level của sản phẩm yêu thích
const suggestions = mockProducts.filter(p => 
  p.category === favoriteCategory && 
  p.level === favoriteLevel &&
  !userFavorites.includes(p.id)
);
```

## 📱 Responsive Features

### Mobile
- Hamburger menu
- Stacked filters
- Single column product grid
- Touch-friendly buttons

### Tablet
- 2-3 column product grid
- Side-by-side filters
- Optimized modal layout

### Desktop
- 4 column product grid
- Horizontal filter bar
- Full-featured navigation

## 🔧 Cấu Hình

### Environment Variables
Tạo file `.env` để cấu hình:
```env
REACT_APP_API_BASE_URL=https://api.edumarketplace.com
REACT_APP_ENVIRONMENT=development
```

### Tailwind Configuration
File `tailwind.config.js` chứa:
- Custom color palette
- Font family settings
- Component plugins

## 🧪 Testing

### Chạy Tests
```bash
npm test
```

### Build Test
```bash
npm run build
```

## 📦 Deployment

### Vercel
1. Push code lên GitHub
2. Connect repository với Vercel
3. Deploy tự động

### Netlify
1. Build project: `npm run build`
2. Upload folder `build/` lên Netlify
3. Configure custom domain (optional)

## 🎯 Tính Năng Nâng Cao

### Đã Implement
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Search & filtering
- ✅ AI suggestions
- ✅ Favorites management
- ✅ Product modal
- ✅ View history tracking

### Có Thể Mở Rộng
- 🔄 Chatbot AI tư vấn
- 🔄 Shopping cart
- 🔄 User authentication
- 🔄 Payment integration
- 🔄 Real-time notifications
- 🔄 Advanced analytics

## 🤝 Đóng Góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 👨‍💻 Tác Giả

Frontend Intern Project - EduMarket

---

**Lưu ý**: Đây là dự án demo với mock data. Trong môi trường production, cần thay thế mock API bằng real API endpoints.

## 🛠️ Hướng dẫn mở rộng & phát triển tính năng mới

### 1. Thêm Component mới
- Đặt file component vào thư mục `src/components/`.
- Đặt tên file và tên component rõ ràng, ví dụ: `CourseBanner.tsx`.
- Nếu component dùng chung nhiều nơi, hãy tách nhỏ và tái sử dụng.

### 2. Thêm Trang (Page) mới
- Tạo file mới trong `src/pages/`, ví dụ: `CartPage.tsx`.
- Đăng ký route mới trong `App.tsx`.
- Đặt tên route và component dễ hiểu, ưu tiên tiếng Anh cho code, tiếng Việt cho UI.

### 3. Thêm logic xử lý hoặc API
- Đặt các hàm gọi API vào `src/services/api.ts`.
- Nếu cần mock data mới, thêm vào `src/data/mockData.ts`.
- Đặt các hàm tiện ích (helpers) vào `src/utils/helpers.ts`.

### 4. Quản lý state toàn cục
- Nếu cần lưu state dùng chung, thêm vào `src/context/AppContext.tsx`.
- Định nghĩa rõ action, state, và cập nhật reducer.

### 5. Đảm bảo code sạch & dễ bảo trì
- Luôn viết comment cho logic phức tạp và các hàm export.
- Đặt tên biến, hàm, component rõ ràng, nhất quán.
- Ưu tiên tách nhỏ component, tránh lặp code.
- UI hiển thị tiếng Việt, code giữ tiếng Anh.

### 6. Kiểm tra lại giao diện
- Kiểm tra responsive trên nhiều thiết bị.
- Test lại các tính năng chính sau khi thêm mới.

### 7. Đóng góp & review
- Tạo branch mới cho mỗi tính năng.
- Viết commit message rõ ràng.
- Tạo Pull Request để review trước khi merge.

---

> **Lưu ý:** Nếu có thắc mắc về cấu trúc hoặc muốn refactor, hãy đọc kỹ phần comment trong code hoặc hỏi người review. Cứ mạnh dạn đề xuất cải tiến nếu thấy hợp lý!

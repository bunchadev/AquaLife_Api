// constants.js (Backend)
// Định nghĩa các hằng số dùng chung trong toàn bộ ứng dụng backend.
//
// CORS Whitelist: danh sách các origin được phép gọi API.
// - Môi trường dev: cho phép tất cả (callback trả về null, true)
// - Môi trường production: chỉ cho phép các domain được liệt kê ở đây

let whitelistDomains = []

if (process.env.BUILD_MODE === 'dev') {
  // Môi trường local development: mở rộng whitelist cho tiện dev
  // Thêm cả http:// để CORS library so sánh đúng với origin header từ browser
  whitelistDomains = [
    'http://localhost:5173', // Vite dev server (frontend local)
    'http://localhost:3000'  // Dự phòng nếu đổi port
  ]
} else {
  // Môi trường production: chỉ chấp nhận domain chính thức đã deploy
  whitelistDomains = [
    'https://aqua-life-web-seven.vercel.app' // Domain frontend trên Vercel
  ]
}

export const WHITELIST_DOMAINS = whitelistDomains

// Các USER ROLES hợp lệ trong hệ thống
// Dùng constant để tránh lỗi typo khi so sánh role
export const USER_ROLES = {
  ADMIN: 'admin',      // Quản trị viên: toàn quyền
  CUSTOMER: 'customer' // Khách hàng: quyền giới hạn (xem/mua hàng)
}
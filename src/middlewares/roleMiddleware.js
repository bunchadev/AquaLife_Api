// roleMiddleware.js
// Middleware kiểm tra quyền (role) của người dùng trước khi cho phép truy cập route.
// Cách dùng: roleMiddleware('admin') → chỉ admin mới vào được
// Cách dùng: roleMiddleware('customer') → chỉ customer mới vào được

import ApiError from '~/utils/ApiError' // Class lỗi tùy chỉnh (fix: đúng path utils, không phải errors)
import { usersService } from '~/services/usersService' // Fix: tên đúng là usersService (có 's')
import { StatusCodes } from 'http-status-codes'

/**
 * Factory middleware - nhận vào requiredRole, trả về middleware function.
 * Middleware sẽ:
 *  1. Lấy userId từ req.user (đã được authMiddleware gán trước đó)
 *  2. Tra DB tìm user → kiểm tra role có khớp không
 *  3. Nếu đúng role → next(); nếu sai → trả lỗi 403 Forbidden
 */
export const roleMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id // Lấy userId từ payload JWT đã decode

      // Truy vấn user trong DB để lấy role mới nhất (tránh dùng role từ token cũ)
      const user = await usersService.findById(userId)

      if (!user) {
        // User không tồn tại trong DB → reject
        return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Người dùng không tồn tại'))
      }

      if (user.role !== requiredRole) {
        // Role không khớp → từ chối truy cập
        return next(new ApiError(StatusCodes.FORBIDDEN, 'Bạn không có quyền thực hiện thao tác này'))
      }

      // Role hợp lệ → cho phép đi tiếp
      next()
    } catch (error) {
      next(error)
    }
  }
}
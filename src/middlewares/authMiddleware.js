// authMiddleware.js
// Middleware xác thực JWT token - chạy TRƯỚC các route handler cần bảo vệ.
//
// Luồng hoạt động:
//  Client gửi: Authorization: Bearer <token>
//  ↓
//  authMiddleware: extract token → verify → gán req.user
//  ↓
//  Controller: dùng req.user.id, req.user.role để xử lý logic

import { JwtProvider } from '~/providers/JwtProvider' // Sử dụng provider duy nhất, không duplicate jwt logic
import { StatusCodes } from 'http-status-codes'

/**
 * Middleware xác thực JWT.
 * Gán req.user = payload từ token nếu hợp lệ.
 * Trả 401 Unauthorized nếu thiếu/sai/hết hạn token.
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // Lấy Authorization header: "Bearer eyJhbGc..."
    const authHeader = req.headers.authorization

    // Kiểm tra header tồn tại và đúng định dạng Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        statusCode: 401,
        message: 'Không tìm thấy token xác thực. Vui lòng đăng nhập.'
      })
    }

    // Tách lấy token (bỏ phần "Bearer ")
    const token = authHeader.split(' ')[1]

    // Verify token qua JwtProvider (sẽ throw Error nếu hết hạn hoặc không hợp lệ)
    const decoded = await JwtProvider.verifyToken(token)

    // Gán decoded payload vào req.user để các middleware/controller sau dùng
    // decoded chứa: { id, email, role, name, iat (issued at), exp (expire) }
    req.user = decoded

    next() // Token hợp lệ → tiếp tục xử lý request
  } catch (err) {
    // Token hết hạn (TokenExpiredError) hoặc signature sai (JsonWebTokenError)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      statusCode: 401,
      message: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.'
    })
  }
}

// Export alias để giữ tương thích với code dùng verifyToken
export const verifyToken = authMiddleware

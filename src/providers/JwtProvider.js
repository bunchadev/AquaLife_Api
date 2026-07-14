// JwtProvider.js
// Module duy nhất xử lý mọi việc liên quan đến JSON Web Token (JWT).
//
// Tại sao tách ra Provider?
//  → Centralize logic: chỉ một nơi cần sửa nếu thay đổi JWT algorithm, key, v.v.
//  → Dễ mock khi viết test
//
// Luồng authentication:
//  1. User login → generateToken(payload) → trả token về client
//  2. Client gửi request → authMiddleware gọi verifyToken(token) → decode payload
//  3. req.user = payload → các middleware/controller tiếp theo dùng req.user

import JWT from 'jsonwebtoken'
import { env } from '~/config/environment'

/**
 * Tạo JWT token từ thông tin user.
 * @param {Object} userInfo - Payload gồm id, email, role, name
 * @param {string} [secretKey] - Secret key ký token (mặc định dùng env.JWT_KEY)
 * @param {string} [tokenLife] - Thời hạn token (mặc định env.JWT_EXPIRES_IN)
 * @returns {Promise<string>} JWT token string
 */
const generateToken = async (userInfo, secretKey = env.JWT_KEY, tokenLife = env.JWT_EXPIRES_IN) => {
  try {
    // JWT.sign: tạo token với payload, secret key, và các options
    // Algorithm HS256: HMAC-SHA256 (cân bằng tốc độ và bảo mật)
    return JWT.sign(userInfo, secretKey, {
      algorithm: 'HS256',
      expiresIn: tokenLife
    })
  } catch (error) {
    // Bọc lỗi gốc để không mất thông tin
    throw new Error(`Lỗi tạo JWT token: ${error.message}`)
  }
}

/**
 * Xác minh JWT token có hợp lệ và chưa hết hạn không.
 * @param {string} token - JWT token nhận từ client (qua Authorization header)
 * @param {string} [secretKey] - Secret key dùng để verify (phải khớp với key lúc ký)
 * @returns {Promise<Object>} Decoded payload (id, email, role, name, iat, exp)
 * @throws {Error} Nếu token không hợp lệ hoặc đã hết hạn
 */
const verifyToken = async (token, secretKey = env.JWT_KEY) => {
  try {
    // JWT.verify: decode + kiểm tra chữ ký + kiểm tra thời hạn
    // Nếu token hết hạn → throw TokenExpiredError
    // Nếu chữ ký sai → throw JsonWebTokenError
    return JWT.verify(token, secretKey)
  } catch (error) {
    throw new Error(`Token không hợp lệ: ${error.message}`)
  }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}
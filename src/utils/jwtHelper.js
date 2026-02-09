import jwt from 'jsonwebtoken'

const JWT_KEY = process.env.JWT_KEY

export const generateToken = (payload) => {
  // Tạo JWT từ payload, phục vụ các tác vụ hệ thống
  return jwt.sign(payload, JWT_KEY, { expiresIn: '7d' })
}

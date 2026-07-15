// authService.js
// Service layer cho authentication (đăng nhập, đăng ký).
// Là wrapper mỏng trên usersService để tách biệt auth logic ra route riêng.
//
// Tại sao cần authService riêng?
//  → Tách concerns: /auth routes (public) vs /users routes (authenticated)
//  → Dễ mở rộng sau (thêm OAuth, 2FA, refresh token, v.v.)

import { usersService } from '~/services/usersService.js'

/**
 * Đăng nhập user.
 * Delegate hoàn toàn sang usersService.login().
 *
 * @param {string} email - Email người dùng
 * @param {string} password - Mật khẩu (plain text, sẽ được bcrypt.compare trong usersService)
 * @returns {{ message, token, user }} Kết quả đăng nhập
 */
const login = async (email, password) => {
  const result = await usersService.login({ email, password })
  return {
    message: 'Đăng nhập thành công',
    token: result.token,
    user: result.customer // 'customer' là tên cũ từ usersService, giữ nguyên để không break API
  }
}

/**
 * Đăng ký tài khoản mới.
 * Delegate sang usersService.createNew().
 *
 * @param {Object} userPayload - Thông tin đăng ký từ request body
 * @returns {{ message, data }} Kết quả đăng ký
 */
const register = async (userPayload) => {
  const createUser = await usersService.createNew(userPayload)
  return {
    message: userPayload.role === 'admin' ? 'Tạo tài khoản admin thành công' : 'Đăng ký tài khoản thành công',
    data: createUser
  }
}

export const authService = {
  login,
  register
}

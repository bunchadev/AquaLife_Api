// usersService.js
// Service layer xử lý logic nghiệp vụ liên quan đến người dùng.
//
// Service layer nằm giữa Controller và Model:
//  Controller → Service → Model → Database
//
// Service chứa: business logic, validation bổ sung, transform data
// Model chứa: chỉ CRUD thuần túy với MongoDB

import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { usersModel } from '~/models/usersModel.js'
import { JwtProvider } from '~/providers/JwtProvider' // Dùng provider thống nhất, không import trực tiếp jwt
import { env } from '~/config/environment'

/**
 * Lọc bỏ field nhạy cảm trước khi trả về client.
 * KHÔNG BAO GIỜ trả password (dù đã hash) về phía client.
 * @param {Object|null} userDoc - Document user từ MongoDB
 * @returns {Object|null} User object đã xoá password
 */
const buildPublicUser = (userDoc) => {
  if (!userDoc) return null
  const { password, ...rest } = userDoc // Destructuring để tách password ra
  return rest
}

/**
 * Tạo user mới (đăng ký).
 * Flow: Kiểm tra email trùng → Hash password → Lưu DB → Trả về user (không có password)
 */
const createNew = async (reqBody) => {
  // Kiểm tra email đã tồn tại chưa (email phải unique)
  const existing = await usersModel.findByEmail(reqBody.email)
  if (existing) throw new ApiError(StatusCodes.CONFLICT, 'Email này đã được đăng ký')

  // Hash password với bcrypt (saltRounds=12: an toàn hơn mặc định 10, vẫn nhanh đủ dùng)
  // saltRounds cao hơn → hash chậm hơn → attacker khó brute force hơn
  const hashedPassword = await bcrypt.hash(reqBody.password, 12)

  const newUser = {
    name: reqBody.name,
    email: reqBody.email,
    phone: reqBody.phone,
    address: reqBody.address,
    password: hashedPassword,            // Lưu hash, không bao giờ lưu plain text
    role: reqBody.role || 'customer',    // Mặc định là customer
    imageUrl: reqBody.imageUrl || ''
  }

  const result = await usersModel.createNew(newUser)

  // Lấy lại user vừa tạo từ DB để đảm bảo trả về data đúng như trong DB
  const created = await usersModel.findById(result.insertedId)
  return buildPublicUser(created) // Trả về không có password
}

/**
 * Lấy tất cả users (chỉ admin dùng).
 * @returns {Array} Danh sách users đã lọc bỏ password
 */
const getAll = async () => {
  const items = await usersModel.getAll()
  return items.map(buildPublicUser) // Lọc password khỏi từng user
}

/**
 * Tìm user theo ID.
 * @param {string} id - MongoDB ObjectId dạng string
 * @returns {Object|null} User (không có password) hoặc null
 */
const findById = async (id) => buildPublicUser(await usersModel.findById(id))

/**
 * Cập nhật thông tin user.
 * Nếu body có trường 'password' → hash lại trước khi lưu.
 * @param {string} id - User ID
 * @param {Object} data - Dữ liệu cần cập nhật
 * @returns {Object} User sau khi cập nhật
 */
const updateById = async (id, data) => {
  const updatePayload = { ...data }

  // Nếu có đổi password → hash lại (không lưu plain text)
  if (data.password) {
    updatePayload.password = await bcrypt.hash(data.password, 12)
  }

  await usersModel.updateById(id, updatePayload)

  // Lấy lại từ DB để trả về data mới nhất
  return buildPublicUser(await usersModel.findById(id))
}

/**
 * Xoá user theo ID.
 * @param {string} id - User ID
 * @returns {Object} Kết quả từ MongoDB deleteOne
 */
const deleteById = async (id) => usersModel.deleteById(id)

/**
 * Đăng nhập - xác thực email/password và tạo JWT token.
 * Flow: Tìm user theo email → So sánh password → Tạo JWT → Trả về token + user info
 * @param {Object} credentials - { email, password }
 * @returns {{ token: string, customer: Object }} Token và thông tin user
 */
const login = async ({ email, password }) => {
  // Tìm user theo email
  const user = await usersModel.findByEmail(email)

  // Cùng message cho cả 2 trường hợp (sai email hoặc sai password)
  // → Tránh attacker biết email nào đã đăng ký (security best practice)
  if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Email hoặc mật khẩu không đúng')

  // So sánh password nhập vào với hash trong DB
  // bcrypt.compare: tự extract salt từ hash → so sánh chính xác
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Email hoặc mật khẩu không đúng')

  // Tạo JWT payload (chỉ include thông tin không nhạy cảm, cần thiết cho authorization)
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name
  }

  // Tạo token thông qua JwtProvider (sẽ dùng env.JWT_KEY và env.JWT_EXPIRES_IN)
  const accessToken = await JwtProvider.generateToken(payload)
  
  // Tạo Refresh Token
  const refreshToken = await JwtProvider.generateToken(payload, env.REFRESH_TOKEN_KEY, env.REFRESH_TOKEN_EXPIRES_IN)

  // Lưu Refresh Token vào Database để có thể thu hồi (revoke) khi cần
  await usersModel.updateById(user._id, { refreshToken })

  return {
    accessToken,
    refreshToken,
    customer: buildPublicUser(user) // Không trả password về client
  }
}

/**
 * Cấp lại Access Token mới dựa vào Refresh Token.
 * @param {string} refreshToken - Token cũ
 * @returns {Object} Access Token và Refresh Token mới (tuỳ chiến lược, có thể trả cả 2)
 */
const refreshToken = async (clientRefreshToken) => {
  try {
    // 1. Verify Refresh Token
    const decoded = await JwtProvider.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_KEY)
    
    // 2. Tìm user trong DB
    const user = await usersModel.findById(decoded.id)
    if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Người dùng không tồn tại')

    // 3. Kiểm tra xem Refresh Token trong DB có khớp không (để tránh bị thu hồi)
    if (user.refreshToken !== clientRefreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh Token không hợp lệ hoặc đã bị thu hồi')
    }

    // 4. Tạo Access Token mới
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    }
    const newAccessToken = await JwtProvider.generateToken(payload)

    // Option: Có thể xoay vòng Refresh Token (Refresh Token Rotation) để tăng bảo mật.
    // Ở đây ta giữ nguyên Refresh Token cũ, chỉ cấp Access Token mới để đơn giản hoá.
    
    return { accessToken: newAccessToken }
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Vui lòng đăng nhập lại (Token hết hạn)')
  }
}

/**
 * Đăng xuất - Thu hồi Refresh Token
 * @param {string} id - User ID
 */
const logout = async (id) => {
  await usersModel.updateById(id, { refreshToken: null })
  return { message: 'Đăng xuất thành công' }
}

export const usersService = {
  createNew,
  getAll,
  findById,
  updateById,
  deleteById,
  login,
  refreshToken,
  logout
}
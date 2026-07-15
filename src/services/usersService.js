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
import { otpModel } from '~/models/otpModel.js'
import { EmailProvider } from '~/providers/EmailProvider.js'
import { JwtProvider } from '~/providers/JwtProvider' // Dùng provider thống nhất, không import trực tiếp jwt
import { env } from '~/config/environment'
import { OAuth2Client } from 'google-auth-library'

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID)

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
 * Gửi mã OTP xác thực email (Đăng ký)
 * Flow: Sinh mã 6 số -> Xóa OTP cũ (nếu có) -> Lưu DB -> Gửi mail
 */
const sendOtp = async (email) => {
  // Kiểm tra xem email đã được đăng ký chưa
  const existingUser = await usersModel.findByEmail(email)
  if (existingUser) throw new ApiError(StatusCodes.CONFLICT, 'Email này đã được đăng ký')

  // Sinh mã OTP 6 số
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  // Xóa mã cũ của email này (để tránh spam)
  await otpModel.deleteByEmail(email)

  // Lưu mã mới với thời hạn 5 phút
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
  await otpModel.createNew({ email, otp, expiresAt })

  // Gửi email
  const subject = 'AquaLife - Mã xác thực đăng ký tài khoản'
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #008C9E; text-align: center;">Chào mừng đến với AquaLife!</h2>
      <p>Cảm ơn bạn đã đăng ký tài khoản. Đây là mã xác thực (OTP) của bạn:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; padding: 12px 24px; font-size: 24px; font-weight: bold; background: #f0fdfa; color: #0f766e; border-radius: 6px; letter-spacing: 4px;">${otp}</span>
      </div>
      <p style="color: #555;">Mã này sẽ hết hạn trong vòng <strong>5 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
      <p>Trân trọng,<br>Đội ngũ AquaLife</p>
    </div>
  `
  await EmailProvider.sendEmail({ to: email, subject, html })

  return { message: 'Mã xác thực đã được gửi về email của bạn.' }
}

/**
 * Tạo user mới (đăng ký).
 * Flow: Verify OTP -> Hash password -> Lưu DB -> Trả về user (không có password)
 */
const createNew = async (reqBody) => {
  // 1. Kiểm tra OTP
  const { email, otp } = reqBody
  if (!otp) throw new ApiError(StatusCodes.BAD_REQUEST, 'Vui lòng nhập mã OTP')

  const record = await otpModel.findByEmailAndOtp(email, otp)
  if (!record) throw new ApiError(StatusCodes.BAD_REQUEST, 'Mã xác thực không hợp lệ')

  if (new Date() > new Date(record.expiresAt)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Mã xác thực đã hết hạn')
  }

  // OTP hợp lệ -> Xóa khỏi DB để tránh dùng lại
  await otpModel.deleteByEmail(email)

  // Kiểm tra email trùng (bảo vệ thêm)
  const existing = await usersModel.findByEmail(email)
  if (existing) throw new ApiError(StatusCodes.CONFLICT, 'Email này đã được đăng ký')

  // Hash password
  const hashedPassword = await bcrypt.hash(reqBody.password, 12)

  const newUser = {
    name: reqBody.name,
    email: reqBody.email,
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
 * Đăng nhập bằng Google.
 * Xác thực idToken từ Frontend, tự động tạo tài khoản nếu chưa có.
 * @param {string} idToken - Token lấy từ Google Sign-In ở Frontend
 * @returns {{ token: string, customer: Object }} Token và thông tin user
 */
const googleLogin = async (idToken) => {
  try {
    // 1. Gửi token sang Google để xác minh
    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    const { email, name, picture } = payload

    // 2. Tìm xem user đã tồn tại chưa
    let user = await usersModel.findByEmail(email)

    // 3. Nếu chưa có, tạo mới luôn (không cần mật khẩu)
    if (!user) {
      const newUser = {
        email,
        name,
        imageUrl: picture || '',
        provider: 'google',
        password: '',
      }
      const createdResult = await usersModel.createNew(newUser)
      user = await usersModel.findById(createdResult.insertedId)
    }

    // 4. Cấp phát Token (giống hệt đăng nhập bình thường)
    const userInfo = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    }

    const accessToken = await JwtProvider.generateToken(userInfo)
    const refreshToken = await JwtProvider.generateToken(userInfo, env.REFRESH_TOKEN_KEY, env.REFRESH_TOKEN_EXPIRES_IN)

    await usersModel.updateById(user._id, { refreshToken })

    return {
      accessToken,
      refreshToken,
      customer: buildPublicUser(user)
    }
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Xác thực Google thất bại')
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
  sendOtp,
  getAll,
  findById,
  updateById,
  deleteById,
  login,
  googleLogin,
  refreshToken,
  logout
}
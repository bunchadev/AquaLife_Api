// ordersService.js
// Service layer xử lý logic nghiệp vụ phức tạp cho orders (đơn hàng).
//
// Business rules:
//  - Customer chỉ xem/sửa/xoá đơn hàng của mình
//  - Admin có toàn quyền với tất cả đơn hàng
//  - Quyền được kiểm tra bằng cách so sánh order.userId với user.id

import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { ordersModel } from '~/models/ordersModel.js'

/**
 * Tạo đơn hàng mới.
 * userId có thể lấy từ body (nếu admin tạo hộ) hoặc từ JWT (user tự tạo).
 */
const createNew = async (data, user) => {
  // Ưu tiên userId từ body (admin tạo hộ), fallback về user đang đăng nhập
  const userId = data?.userId || user?.id
  if (!userId) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Không xác định được người dùng')
  }

  // Normalize status: frontend có thể gửi 'pending' (English) → convert sang tiếng Việt
  const rawStatus = Array.isArray(data?.status) ? data.status[0] : data?.status
  const normalizedStatus = rawStatus === 'pending' ? 'Đang đợi' : (rawStatus || 'Đang đợi')

  return await ordersModel.createNew({
    userId,
    address: data?.address,
    totalPrice: Number(data.totalPrice || 0),
    status: normalizedStatus,
    note: data?.note
  })
}

/**
 * Lấy danh sách đơn hàng.
 * Admin: lấy tất cả | Customer: chỉ lấy của mình
 */
const getAll = async (user) => {
  if (user?.role === 'admin') {
    // Admin thấy tất cả đơn hàng
    return await ordersModel.getAll()
  }
  if (!user?.id) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Chưa đăng nhập')

  // Customer chỉ thấy đơn hàng của mình
  return await ordersModel.findByUserId(String(user.id))
}

/**
 * Lấy chi tiết một đơn hàng.
 * Kiểm tra quyền: Customer chỉ xem đơn của mình.
 */
const findById = async (id, user) => {
  const order = await ordersModel.findById(id)
  if (!order) return null

  // Kiểm tra quyền: Admin có thể xem tất cả, Customer chỉ xem của mình
  if (user?.role !== 'admin' && String(order.userId) !== String(user?.id)) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Bạn không có quyền xem đơn hàng này')
  }

  return order
}

/**
 * Cập nhật đơn hàng (thường là cập nhật status).
 * Kiểm tra quyền trước khi cho phép cập nhật.
 */
const updateById = async (id, data, user) => {
  const existing = await ordersModel.findById(id)
  if (!existing) return null // Trả null để controller xử lý 404

  // Kiểm tra quyền
  if (user?.role !== 'admin' && String(existing.userId) !== String(user?.id)) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Bạn không có quyền sửa đơn hàng này')
  }

  await ordersModel.updateById(id, data)
  return await ordersModel.findById(id) // Lấy lại sau khi update
}

/**
 * Xoá đơn hàng.
 * Kiểm tra quyền trước khi xoá.
 */
const deleteById = async (id, user) => {
  const existing = await ordersModel.findById(id)
  if (!existing) return null

  if (user?.role !== 'admin' && String(existing.userId) !== String(user?.id)) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Bạn không có quyền xoá đơn hàng này')
  }

  return await ordersModel.deleteById(id)
}

export const ordersService = {
  createNew,
  getAll,
  findById,
  updateById,
  deleteById
}

// paymentsService.js
// Service layer cho payments (thanh toán đơn hàng).
//
// Luồng thanh toán COD:
//  1. User đặt hàng → tạo order với status 'Đang đợi'
//  2. User xác nhận thanh toán → gọi createPayment
//  3. createPayment: tạo payment record + cập nhật order status
//
// Hiện tại chỉ hỗ trợ COD. Tương lai có thể mở rộng thêm VNPay, MoMo, v.v.

import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { ordersModel } from '~/models/ordersModel.js'
import { paymentsModel } from '~/models/paymentsModel.js'

/**
 * Tạo payment record cho đơn hàng.
 * Kiểm tra: đơn hàng tồn tại + quyền truy cập + chưa được thanh toán.
 *
 * @param {Object} data - { orderId, method? }
 * @param {Object} user - User payload từ JWT
 */
const createNew = async (data, user) => {
  const orderId = data?.orderId
  if (!orderId) throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Thiếu thông tin đơn hàng')

  // Kiểm tra đơn hàng tồn tại
  const order = await ordersModel.findById(orderId)
  if (!order) throw new ApiError(StatusCodes.NOT_FOUND, 'Đơn hàng không tồn tại')

  // Kiểm tra quyền: Admin có thể thanh toán cho bất kỳ đơn nào
  // Customer chỉ thanh toán đơn của mình
  if (user?.role !== 'admin' && String(order.userId) !== String(user?.id)) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Bạn không có quyền thanh toán đơn hàng này')
  }

  // Kiểm tra đơn hàng chưa được thanh toán (tránh thanh toán 2 lần)
  const latestPayment = await paymentsModel.findLatestByOrderId(orderId)
  if (latestPayment?.status === 'Đã thanh toán') {
    throw new ApiError(StatusCodes.CONFLICT, 'Đơn hàng này đã được thanh toán rồi')
  }

  // Tạo payment record với trạng thái 'Đã thanh toán'
  const payment = await paymentsModel.createNew({
    orderId,
    method: data?.method || 'cod', // Mặc định là COD
    status: 'Đã thanh toán',
    paidAt: new Date() // Ghi nhận thời gian thanh toán thực tế
  })

  // Cập nhật status đơn hàng → 'Đã xác nhận' (tiếp tục quy trình giao hàng)
  await ordersModel.updateById(String(orderId), { status: 'Đã xác nhận' })

  return payment
}

export const paymentsService = {
  createNew
}

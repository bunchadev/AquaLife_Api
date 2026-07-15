// orderDetailsService.js
// Service layer cho order_details (chi tiết đơn hàng - danh sách sản phẩm trong đơn).

import { orderDetailsModel } from '~/models/orderDetailsModel.js'

/**
 * Tạo order detail item.
 * Được gọi trong quá trình checkout cho từng sản phẩm trong giỏ hàng.
 * @param {Object} data - { orderId, productId, quantity, price }
 */
const createNew = async (data) => {
  return await orderDetailsModel.createNew(data)
}

/**
 * Lấy tất cả items của một đơn hàng.
 * @param {string} orderId - Order ID
 * @returns {Array} Danh sách order detail items
 */
const findByOrderId = async (orderId) => {
  return await orderDetailsModel.findByOrderId(orderId)
}

/**
 * Tìm order detail theo ID.
 * @param {string} id - Order detail ID
 * @returns {Object|null} Order detail hoặc null
 */
const findById = async (id) => {
  return await orderDetailsModel.findById(id)
}

export const orderDetailsService = {
  createNew,
  findByOrderId,
  findById
}

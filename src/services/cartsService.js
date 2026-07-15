// cartsService.js
// Service layer cho carts (giỏ hàng).
// Mỗi user được phép có đúng 1 cart (idempotent: tạo nếu chưa có, trả về nếu đã có).

import { cartsModel } from '~/models/cartsModel'
import { cartItemsModel } from '~/models/cartItemsModel'

/**
 * Tạo cart mới cho user, hoặc trả về cart hiện có nếu đã tồn tại.
 * Idempotent: gọi nhiều lần cũng cho kết quả giống nhau (không tạo duplicate).
 *
 * @param {string} userId - User ID từ JWT
 * @returns {Object} Cart document
 */
const createCart = async (userId) => {
  // Convert sang string để đảm bảo type nhất quán khi so sánh
  const userIdStr = userId.toString ? userId.toString() : userId

  // Kiểm tra user đã có cart chưa → trả về luôn nếu có
  const existingCart = await cartsModel.getByUserId(userIdStr)
  if (existingCart) {
    return existingCart // Idempotent: không tạo duplicate cart
  }

  // Chưa có cart → tạo mới
  const result = await cartsModel.createNew({ userId: userIdStr })
  return await cartsModel.getById(result.insertedId.toString())
}

/**
 * Lấy cart của user theo userId.
 * @param {string} userId - User ID
 * @returns {Object} Cart document
 * @throws {Error} Nếu user chưa có cart
 */
const getCartByUserId = async (userId) => {
  const cart = await cartsModel.getByUserId(userId)
  if (!cart) throw new Error('Người dùng chưa có giỏ hàng')
  return cart
}

/**
 * Lấy thông tin chi tiết cart kèm danh sách items.
 * Joins cart với cart_items để trả về đầy đủ thông tin.
 *
 * @param {string} cartId - Cart ID
 * @returns {{ ...cart, items: Array }} Cart với items
 */
const getCartDetails = async (cartId) => {
  const cart = await cartsModel.getById(cartId)
  if (!cart) throw new Error('Không tìm thấy giỏ hàng')

  // Lấy tất cả items thuộc cart này
  const items = await cartItemsModel.getByCartId(cartId)

  return {
    ...cart,
    items: items || [] // Đảm bảo items luôn là array (không phải null/undefined)
  }
}

export const cartsService = {
  createCart,
  getCartByUserId,
  getCartDetails
}

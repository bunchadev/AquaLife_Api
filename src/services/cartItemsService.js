// cartItemsService.js
// Service layer cho cart_items (các sản phẩm trong giỏ hàng).
//
// Business rules:
//  - Nếu sản phẩm đã trong giỏ → cộng thêm số lượng (không tạo bản ghi mới)
//  - Nếu update quantity ≤ 0 → xoá item khỏi giỏ

import { cartItemsModel } from '~/models/cartItemsModel'

/**
 * Thêm sản phẩm vào giỏ hàng.
 * Nếu sản phẩm đã có trong giỏ → tăng quantity.
 * Nếu chưa có → tạo cart_item mới.
 *
 * @param {string} cartId - Cart ID
 * @param {string} productId - Product ID
 * @param {number} quantity - Số lượng cần thêm
 */
const addItemToCart = async (cartId, productId, quantity) => {
  // Kiểm tra sản phẩm đã có trong giỏ chưa
  const existingItem = await cartItemsModel.getByCartIdAndProductId(cartId, productId)

  if (existingItem) {
    // Đã có → cộng thêm số lượng (không tạo bản ghi duplicate)
    const newQuantity = existingItem.quantity + quantity
    return await cartItemsModel.updateById(existingItem._id.toString(), { quantity: newQuantity })
  } else {
    // Chưa có → tạo item mới trong cart
    const result = await cartItemsModel.createNew({ cartId, productId, quantity })
    return await cartItemsModel.getById(result.insertedId.toString())
  }
}

/**
 * Cập nhật số lượng sản phẩm trong giỏ.
 * Nếu quantity ≤ 0 → xoá item luôn (tránh tồn tại item với qty = 0).
 *
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - Số lượng mới
 */
const updateItemQuantity = async (itemId, quantity) => {
  if (quantity <= 0) {
    // Số lượng = 0 → xoá item khỏi giỏ
    return await cartItemsModel.deleteById(itemId)
  }
  return await cartItemsModel.updateById(itemId, { quantity })
}

/**
 * Xoá 1 sản phẩm khỏi giỏ hàng.
 * @param {string} itemId - Cart item ID
 */
const removeItemFromCart = async (itemId) => {
  return await cartItemsModel.deleteById(itemId)
}

/**
 * Xoá tất cả sản phẩm trong giỏ hàng.
 * Dùng sau khi checkout thành công để reset giỏ hàng.
 * @param {string} cartId - Cart ID
 */
const clearCart = async (cartId) => {
  return await cartItemsModel.deleteByCartId(cartId)
}

/**
 * Lấy danh sách tất cả items trong giỏ hàng.
 * @param {string} cartId - Cart ID
 * @returns {Array} Danh sách cart items
 */
const getCartItems = async (cartId) => {
  return await cartItemsModel.getByCartId(cartId)
}

export const cartItemsService = {
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
  getCartItems
}

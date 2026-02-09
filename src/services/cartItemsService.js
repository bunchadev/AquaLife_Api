import { cartItemsModel } from '~/models/cartItemsModel'
// import { cartsModel } from '~/models/cartsModel'

const addItemToCart = async (cartId, productId, quantity) => {
  try {
    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItem = await cartItemsModel.getByCartIdAndProductId(cartId, productId)

    if (existingItem) {
      // Nếu đã có, cập nhật số lượng
      const newQuantity = existingItem.quantity + quantity
      return await cartItemsModel.updateById(existingItem._id.toString(), {
        quantity: newQuantity
      })
    } else {
      // Nếu chưa có, tạo item mới
      const result = await cartItemsModel.createNew({
        cartId,
        productId,
        quantity
      })
      return await cartItemsModel.getById(result.insertedId.toString())
    }
  } catch (error) {
    throw new Error(`Lỗi thêm sản phẩm vào giỏ: ${error.message}`)
  }
}

// Cập nhật số lượng sản phẩm trong giỏ
const updateItemQuantity = async (itemId, quantity) => {
  try {
    if (quantity <= 0) {
      // Nếu số lượng <= 0, xóa item
      return await cartItemsModel.deleteById(itemId)
    }

    return await cartItemsModel.updateById(itemId, { quantity })
  } catch (error) {
    throw new Error(`Lỗi cập nhật số lượng: ${error.message}`)
  }
}

const removeItemFromCart = async (itemId) => {
  try {
    return await cartItemsModel.deleteById(itemId)
  } catch (error) {
    throw new Error(`Lỗi xóa sản phẩm: ${error.message}`)
  }
}

const clearCart = async (cartId) => {
  try {
    return await cartItemsModel.deleteByCartId(cartId)
  } catch (error) {
    throw new Error(`Lỗi xóa giỏ hàng: ${error.message}`)
  }
}

const getCartItems = async (cartId) => {
  try {
    return await cartItemsModel.getByCartId(cartId)
  } catch (error) {
    throw new Error(`Lỗi lấy danh sách sản phẩm: ${error.message}`)
  }
}

export const cartItemsService = {
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
  getCartItems
}

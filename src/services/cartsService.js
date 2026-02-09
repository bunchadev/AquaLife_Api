import { cartsModel } from '~/models/cartsModel'
import { cartItemsModel } from '~/models/cartItemsModel'

// Tạo giỏ hàng mới cho người dùng
const createCart = async (userId) => {
  try {
    // Convert userId thành string nếu cần
    const userIdStr = userId.toString ? userId.toString() : userId
    // Kiểm tra nếu user đã có giỏ hàng chưa
    const existingCart = await cartsModel.getByUserId(userIdStr)
    if (existingCart) {
      return existingCart
    }

    const result = await cartsModel.createNew({
      userId: userIdStr
    })

    return await cartsModel.getById(result.insertedId.toString())
  } catch (error) {
    throw new Error(`Lỗi tạo giỏ hàng: ${error.message}`)
  }
}

// Lấy giỏ hàng của người dùng
const getCartByUserId = async (userId) => {
  try {
    const cart = await cartsModel.getByUserId(userId)
    if (!cart) {
      throw new Error('Không tìm thấy giỏ hàng')
    }
    return cart
  } catch (error) {
    throw new Error(`Lỗi lấy giỏ hàng: ${error.message}`)
  }
}

// Lấy chi tiết giỏ hàng (kèm items)
const getCartDetails = async (cartId) => {
  try {
    const cart = await cartsModel.getById(cartId)
    if (!cart) {
      throw new Error('Không tìm thấy giỏ hàng')
    }

    const items = await cartItemsModel.getByCartId(cartId)

    return {
      ...cart,
      items: items || [] // Đảm bảo items luôn là array
    }
  } catch (error) {
    throw new Error(`Lỗi lấy chi tiết giỏ hàng: ${error.message}`)
  }
}

export const cartsService = {
  createCart,
  getCartByUserId,
  getCartDetails
}

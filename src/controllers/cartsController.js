import { StatusCodes } from 'http-status-codes'
import { cartsService } from '~/services/cartsService'

// Tạo giỏ hàng cho người dùng
const createCart = async (req, res, next) => {
  try {
    // Lấy userId từ user đã đăng nhập
    const userId = req.user.id

    const cart = await cartsService.createCart(userId)
    res.status(StatusCodes.CREATED).json(cart)
  } catch (error) {
    next(error)
  }
}

// Lấy giỏ hàng của người dùng hiện tại (tự động tạo nếu chưa có)
const getMyCart = async (req, res, next) => {
  try {
    const userId = req.user.id

    // Tự động tạo cart nếu chưa có
    let cart = await cartsService.getCartByUserId(userId).catch(() => {
      return null
    })

    if (!cart) {
      cart = await cartsService.createCart(userId)
    }

    const cartDetails = await cartsService.getCartDetails(cart._id.toString())

    res.status(StatusCodes.OK).json(cartDetails)
  } catch (error) {
    next(error)
  }
}

// Lấy chi tiết giỏ hàng (kèm items)
const getCartDetails = async (req, res, next) => {
  try {
    const { cartId } = req.params
    const cartDetails = await cartsService.getCartDetails(cartId)
    res.status(StatusCodes.OK).json(cartDetails)
  } catch (error) {
    next(error)
  }
}

export const cartsController = {
  createCart,
  getMyCart,
  getCartDetails
}

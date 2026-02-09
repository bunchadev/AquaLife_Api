import { StatusCodes } from 'http-status-codes'
import { cartItemsService } from '~/services/cartItemsService'

const getCartItems = async (req, res, next) => {
  try {
    const { cartId } = req.params
    const items = await cartItemsService.getCartItems(cartId)
    res.status(StatusCodes.OK).json(items)
  } catch (error) {
    next(error)
  }
}

const addItemToCart = async (req, res, next) => {
  try {
    const { cartId } = req.params
    const { productId, quantity } = req.body
    const item = await cartItemsService.addItemToCart(cartId, productId, quantity)
    res.status(StatusCodes.CREATED).json(item)
  } catch (error) {
    next(error)
  }
}
const updateItemQuantity = async (req, res, next) => {
  try {
    const { itemId } = req.params
    const { quantity } = req.body
    const item = await cartItemsService.updateItemQuantity(itemId, quantity)
    res.status(StatusCodes.OK).json(item)
  } catch (error) {
    next(error)
  }
}

const removeItemFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params
    await cartItemsService.removeItemFromCart(itemId)
    res.status(StatusCodes.OK).json({ message: 'Xóa sản phẩm thành công' })
  } catch (error) {
    next(error)
  }
}

const clearCart = async (req, res, next) => {
  try {
    const { cartId } = req.params
    await cartItemsService.clearCart(cartId)
    res.status(StatusCodes.OK).json({ message: 'Xóa giỏ hàng thành công' })
  } catch (error) {
    next(error)
  }
}

export const cartItemsController = {
  getCartItems,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart
}

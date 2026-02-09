import express from 'express'
import { cartItemsController } from '~/controllers/cartItemsController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const router = express.Router()
router.get('/:cartId', cartItemsController.getCartItems)
router.post('/:cartId', authMiddleware, cartItemsController.addItemToCart)
router.put('/:itemId', authMiddleware, cartItemsController.updateItemQuantity)
router.delete('/:itemId', authMiddleware, cartItemsController.removeItemFromCart)

export default router

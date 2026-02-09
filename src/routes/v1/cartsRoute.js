import express from 'express'
import { cartsController } from '~/controllers/cartsController'
import { cartItemsController } from '~/controllers/cartItemsController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const router = express.Router()
router.post('/', authMiddleware, cartsController.createCart)
router.get('/my-cart', authMiddleware, cartsController.getMyCart)
router.get('/:cartId/details', cartsController.getCartDetails)
router.delete('/:cartId/clear', cartItemsController.clearCart)

export default router

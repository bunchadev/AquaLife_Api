import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { productsRouter } from './productsRoute.js'
import { usersRouter } from './usersRoute.js'
import { authRouter } from './authRoute.js'
import { categoriesRouter } from './categoriesRoute.js'
import { ordersRouter } from './ordersRoute.js'
import { orderDetailsRouter } from './orderDetailsRoute.js'
import cartsRouter from './cartsRoute.js'
import cartItemsRouter from './cartItemsRoute.js'
import { reviewsRouter } from './reviewsRoute.js'
import { paymentsRouter } from './paymentsRoute.js'

const Router = express.Router()

Router.get('/status', (req, res) => {
  // Health check cho API v1
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use' })
})

Router.use('/auth', authRouter)
Router.use('/users', usersRouter)
Router.use('/products', productsRouter)
Router.use('/categories', categoriesRouter)
Router.use('/orders', ordersRouter)
Router.use('/order-details', orderDetailsRouter)
Router.use('/carts', cartsRouter)
Router.use('/cart-items', cartItemsRouter)
Router.use('/reviews', reviewsRouter)
Router.use('/payments', paymentsRouter)

export const APIs_V1 = Router


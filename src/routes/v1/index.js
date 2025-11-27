import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { branchesRouter } from './branchesRoute.js'
import { employeesRouter } from './employeesRoute.js'
import { customersRouter } from './customersRoute.js'
import { productsRouter } from './productsRoute.js'
import { ordersRouter } from './ordersRouter.js'
import { orderDetailsRouter } from './orderDetailsRouter.js'
import { authRoute } from './authRoute.js'
import { headquaterRouter } from './headquaterRoute.js'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use' })
})

Router.use('/headquater', headquaterRouter)
Router.use('/branches', branchesRouter)
Router.use('/employees', employeesRouter)
Router.use('/customers', customersRouter)
Router.use('/products', productsRouter)
Router.use('/orders', ordersRouter)
Router.use('/order-details', orderDetailsRouter)
Router.use('/auth', authRoute)

export const APIs_V1 = Router


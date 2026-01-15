import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { productsRouter } from './productsRoute.js'
import { usersRouter } from './usersRoute.js'
import { authRouter } from './authRoute.js'
import { categoriesRouter } from './categoriesRoute.js'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use' })
})

Router.use('/auth', authRouter)
Router.use('/users', usersRouter)
Router.use('/products', productsRouter)
Router.use('/categories', categoriesRouter)

export const APIs_V1 = Router


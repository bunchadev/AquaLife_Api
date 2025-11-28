import express from 'express'
import { ordersController } from '~/controllers/ordersController.js'
import { verifyToken } from '~/middlewares/authMiddleware.js'
import { authorize } from '~/middlewares/authorizeMiddleware.js'
import { ordersValidation } from '~/validations/ordersValidation.js'

const Router = express.Router()

Router.route('/')
  .get(ordersController.getAll)
  .post(ordersValidation.createNew, ordersController.createNew)

Router.route('/:id')
  .get(ordersController.getById)
  .put(verifyToken, authorize(['admin', 'manager']), ordersController.updateById)

export const ordersRouter = Router
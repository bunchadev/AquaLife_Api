import express from 'express'
import { ordersController } from '~/controllers/ordersController'
import { ordersValidation } from '~/validations/ordersValidation'
import { verifyToken } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .post(verifyToken, ordersValidation.createNew, ordersController.createNew)
  .get(verifyToken, ordersController.getAll)

Router.route('/:id')
  .get(verifyToken, ordersController.getById)
  .put(verifyToken, ordersController.updateById)
  .delete(verifyToken, ordersController.deleteById)

export const ordersRouter = Router

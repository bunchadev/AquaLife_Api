import express from 'express'
import { orderDetailsController } from '~/controllers/orderDetailsController'
import { orderDetailsValidation } from '~/validations/orderDetailsValidation'
import { verifyToken } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .post(verifyToken, orderDetailsValidation.createNew, orderDetailsController.createNew)
  .get(verifyToken, orderDetailsController.getAll)

Router.route('/:id')
  .get(verifyToken, orderDetailsController.getById)

export const orderDetailsRouter = Router

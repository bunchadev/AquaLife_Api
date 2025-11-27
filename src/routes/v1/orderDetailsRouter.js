import express from 'express'
import { orderDetailsController } from '../../controllers/orderDetailsController.js'
import { orderDetailsValidation } from '../../validations/orderDetailsValidation.js'

const Router = express.Router()

Router.route('/')
  .get(orderDetailsController.getByOrderId)
  .post(orderDetailsValidation.createNew, orderDetailsController.createNew)

Router.route('/:id')
  .get(orderDetailsController.getById)

export const orderDetailsRouter = Router
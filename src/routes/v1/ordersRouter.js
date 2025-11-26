import express from 'express'
import { ordersController } from '~/controllers/ordersController.js'
import { ordersValidation } from '~/validations/ordersValidation.js'

const Router = express.Router()

Router.route('/')
  .get(ordersController.getAll)
  .post(ordersValidation.createNew, ordersController.createNew)

Router.route('/:id')
  .get(ordersController.getById)

export const ordersRouter = Router
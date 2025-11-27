import express from 'express'
import { productsController } from '~/controllers/productsController.js'
import { productsValidation } from '~/validations/productsValidation.js'

const Router = express.Router()

Router.route('/')
  .post(productsValidation.createNew, productsController.createNew)
  .get(productsController.getAll)
  .delete(productsController.deleteAll)

Router.route('/:id')
  .get(productsController.getById)
  .put(productsValidation.createNew, productsController.updateById)
  .delete(productsController.deleteById)

export const productsRouter = Router
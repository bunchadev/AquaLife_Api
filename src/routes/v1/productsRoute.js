import express from 'express'
import { productsController } from '~/controllers/productsController'
import { productsValidation } from '~/validations/productsValidation'
import { verifyToken } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .post(verifyToken, productsValidation.createNew, productsController.createNew)
  .get(productsController.getAll)

Router.route('/:id')
  .get(productsController.getById)
  .put(verifyToken, productsValidation.createNew, productsController.updateById)
  .delete(verifyToken, productsController.deleteById)

Router.route('/category/:categoryId')
  .get(productsController.getByCategory)

export const productsRouter = Router
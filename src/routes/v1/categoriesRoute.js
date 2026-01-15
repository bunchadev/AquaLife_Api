import express from 'express'
import { categoriesController } from '~/controllers/categoriesController'
import { categoriesValidation } from '~/validations/categoriesValidation'
import { verifyToken } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .post(verifyToken, categoriesValidation.createNew, categoriesController.createNew)
  .get(categoriesController.getAll)

Router.route('/:id')
  .get(categoriesController.getById)
  .put(verifyToken, categoriesValidation.updateById, categoriesController.updateById)
  .delete(verifyToken, categoriesController.deleteById)

export const categoriesRouter = Router

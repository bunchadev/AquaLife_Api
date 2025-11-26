import express from 'express'
import { customersController } from '~/controllers/customersController.js'
import { customersValidation } from '~/validations/customersValidation.js'
import { verifyToken } from '~/middlewares/authMiddleware.js'
import { authorize } from '~/middlewares/authorizeMiddleware.js'

const Router = express.Router()

Router.route('/')
  // list customers (admin/manager)
  .get(verifyToken, authorize(['admin', 'manager']), customersController.getAll)
  .post(customersValidation.createNew, customersController.createNew)
  .delete(verifyToken, authorize('admin'), customersController.deleteAll)

Router.route('/:id')
  .get(verifyToken, customersController.getById)
  .put(verifyToken, customersController.updateById)
  .delete(verifyToken, authorize('admin'), customersController.deleteById)

export const customersRouter = Router
import express from 'express'
import { usersController } from '~/controllers/usersController'
import { userValidation } from '~/validations/userValidation'
import { verifyToken } from '~/middlewares/authMiddleware'

const Router = express.Router()
Router.route('/')
  .get(verifyToken, usersController.getAll)

Router.route('/:id')
  .get(verifyToken, usersController.getById)
  .put(verifyToken, userValidation.updateById, usersController.updateById)
  .delete(verifyToken, usersController.deleteById)

export const usersRouter = Router
import express from 'express'
import { paymentsController } from '~/controllers/paymentsController'
import { paymentsValidation } from '~/validations/paymentsValidation'
import { verifyToken } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.post('/', verifyToken, paymentsValidation.createNew, paymentsController.createNew)

export const paymentsRouter = Router

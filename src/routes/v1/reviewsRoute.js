import express from 'express'
import { reviewsController } from '~/controllers/reviewsController'
import { reviewsValidation } from '~/validations/reviewsValidation'
import { verifyToken } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .post(verifyToken, reviewsValidation.createNew, reviewsController.createNew)
  .get(reviewsController.getAll)

export const reviewsRouter = Router

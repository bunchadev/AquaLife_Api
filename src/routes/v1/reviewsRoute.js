import express from 'express'
import { reviewsController } from '~/controllers/reviewsController'
import { verifyToken } from '~/middlewares/authMiddleware'

const Router = express.Router()

// GET /v1/reviews?product_id=<id>
Router.get('/', reviewsController.getByProduct)

// POST /v1/reviews (requires authentication)
Router.post('/', verifyToken, reviewsController.createNew)

export const reviewsRouter = Router

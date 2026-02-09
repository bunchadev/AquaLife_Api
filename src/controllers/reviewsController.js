import { StatusCodes } from 'http-status-codes'
import { reviewsService } from '~/services/reviewsService'

const createNew = async (req, res, next) => {
  try {
    const result = await reviewsService.createNew(req.body, req.user)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) { next(error) }
}

const getAll = async (req, res, next) => {
  try {
    const productId = req.query.product_id || req.query.productId
    if (!productId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'productId is required' })
    }
    const items = await reviewsService.findByProductId(productId)
    res.status(StatusCodes.OK).json(items)
  } catch (error) { next(error) }
}

export const reviewsController = {
  createNew,
  getAll
}

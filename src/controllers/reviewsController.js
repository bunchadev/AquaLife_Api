import { StatusCodes } from 'http-status-codes'
import { reviewsService } from '~/services/reviewsService'

const createNew = async (req, res, next) => {
  try {
    // require authenticated user
    const user = req.user
    if (!user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication required' })

    const payload = {
      product_id: req.body.product_id,
      customer_id: user.id,
      rating: req.body.rating,
      comment: req.body.comment || ''
    }

    const result = await reviewsService.createNew(payload)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) { next(error) }
}

const getByProduct = async (req, res, next) => {
  try {
    const productId = req.query.product_id || req.params.productId
    if (!productId) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'product_id is required' })
    const items = await reviewsService.getByProductId(productId)
    res.status(StatusCodes.OK).json(items)
  } catch (error) { next(error) }
}

export const reviewsController = {
  createNew,
  getByProduct
}

import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { reviewsModel } from '~/models/reviewsModel'

const normalizeReview = (item) => {
  if (!item) return item
  return {
    ...item,
    userId: item.userId?.toString ? item.userId.toString() : item.userId,
    productId: item.productId?.toString ? item.productId.toString() : item.productId
  }
}

const createNew = async (data, user) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const userId = data?.userId || user?.id
    const userName = data?.userName || user?.name
    if (!userId || !userName) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Missing user info')
    }

    const existing = await reviewsModel.findByUserAndProduct(userId, data?.productId)
    if (existing) {
      throw new ApiError(StatusCodes.CONFLICT, 'Đã đánh giá sản phẩm này')
    }

    const created = await reviewsModel.createNew({
      userId,
      userName,
      productId: data?.productId,
      rating: data?.rating,
      comment: data?.comment || ''
    })
    return normalizeReview(created)
  } catch (error) { throw error }
}

const findByProductId = async (productId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const items = await reviewsModel.findByProductId(productId)
    return items.map(normalizeReview)
  } catch (error) { throw error }
}

export const reviewsService = {
  createNew,
  findByProductId
}

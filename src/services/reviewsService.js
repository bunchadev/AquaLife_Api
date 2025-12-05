import { reviewsModel } from '~/models/reviewsModel'

const createNew = async (payload) => {
  try {
    return await reviewsModel.createNew(payload)
  } catch (error) { throw error }
}

const getByProductId = async (productId) => {
  try {
    return await reviewsModel.getByProductId(productId)
  } catch (error) { throw error }
}

const getAll = async () => {
  return await reviewsModel.getAll()
}

export const reviewsService = {
  createNew,
  getByProductId,
  getAll
}

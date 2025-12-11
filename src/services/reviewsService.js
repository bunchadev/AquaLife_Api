import { reviewsModel } from '~/models/reviewsModel'

const createNew = async (payload) => {
  // eslint-disable-next-line no-useless-catch
  try {
    return await reviewsModel.createNew(payload)
  } catch (error) { throw error }
}

const getByProductId = async (productId) => {
  // eslint-disable-next-line no-useless-catch
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

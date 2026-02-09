import { orderDetailsModel } from '~/models/orderDetailsModel.js'

const createNew = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    return await orderDetailsModel.createNew(data)
  } catch (error) { throw error }
}

const findByOrderId = async (orderId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    return await orderDetailsModel.findByOrderId(orderId)
  } catch (error) { throw error }
}

const findById = async (id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    return await orderDetailsModel.findById(id)
  } catch (error) { throw error }
}

const deleteByOrderId = async (orderId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    return await orderDetailsModel.deleteByOrderId(orderId)
  } catch (error) { throw error }
}

export const orderDetailsService = {
  createNew,
  findByOrderId,
  findById,
  deleteByOrderId
}

import { orderDetailsModel } from '~/models/orderDetailsModel'

const createNew = async (reqBody) => {
  const subtotal = reqBody.subtotal || (reqBody.quantity * reqBody.priceAtOrder)
  // eslint-disable-next-line no-useless-catch
  try {
    const newOrderDetails = {
      ...reqBody,
      subtotal
    }

    const createOrderDetails = await orderDetailsModel.createNew(newOrderDetails)

    const getNewOrderDetails = await orderDetailsModel.findOneById(createOrderDetails.insertedId)
    return getNewOrderDetails
  } catch (error) { throw error }
}
const findByOrderId = async (orderId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    return await orderDetailsModel.findByOrderId(orderId)
  } catch (err) { throw err }
}

const findOneById = async (id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    return await orderDetailsModel.findOneById(id)
  } catch (err) { throw err }
}

export const orderDetailsService = {
  createNew,
  findByOrderId,
  findOneById
}
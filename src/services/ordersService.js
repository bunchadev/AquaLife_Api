import { ordersModel } from '~/models/ordersModel'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newOrders = {
      ...reqBody
    }

    const createOrders = await ordersModel.createNew(newOrders)
    return createOrders
  } catch (error) { throw error }
}

const findByCustomerId = async (customerId) => {
  try {
    return await ordersModel.findByCustomerId(customerId)
  } catch (err) { throw err }
}

const findById = async (id) => {
  try {
    return await ordersModel.findById(id)
  } catch (err) { throw err }
}

const updateById = async (id, data) => {
  try {
    return await ordersModel.updateById(id, data)
  } catch (err) { throw err }
}

const getAll = async () => {
  try {
    return await ordersModel.getAll()
  } catch (err) { throw err }
}

export const ordersService = {
  createNew,
  findByCustomerId,
  findById,
  updateById,
  getAll
}
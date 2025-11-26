import { customersModel } from '~/models/customersModel'
import { hashPassword } from '~/utils/password'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const hashed = await hashPassword(reqBody.password)
    const newCustomers = {
      ...reqBody,
      password: hashed
    }

    const createCustomers = await customersModel.createNew(newCustomers)
    return createCustomers
  } catch (error) { throw error }
}

const getAll = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const items = await customersModel.getAll()
    return items
  } catch (error) { throw error }
}

const updateById = async (id, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const body = { ...reqBody }
    if (body.password) {
      body.password = await hashPassword(body.password)
    }
    const result = await customersModel.updateById(id, body)
    return result
  } catch (error) { throw error }
}

const deleteById = async (id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await customersModel.deleteById(id)
    return result
  } catch (error) { throw error }
}

const deleteAll = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await customersModel.deleteAll()
    return result
  } catch (error) { throw error }
}

const getById = async (id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const item = await customersModel.findById(id)
    return item
  } catch (error) { throw error }
}

export const customersService = {
  createNew,
  getAll,
  getById,
  updateById,
  deleteById,
  deleteAll
}

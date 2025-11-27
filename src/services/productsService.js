import { productsModel } from '~/models/productsModel'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newProducts = {
      ...reqBody
    }

    const createProducts = await productsModel.createNew(newProducts)
    return createProducts
  } catch (error) { throw error }
}

const getAll = async () => {
  const items = await productsModel.getAll()
  return items
}

const findById = async (id) => {
  try {
    return await productsModel.findById(id)
  } catch (err) { throw err }
}

const updateById = async (id, data) => {
  return await productsModel.updateById(id, data)
}

const deleteById = async (id) => {
  return await productsModel.deleteById(id)
}

const deleteAll = async () => {
  return await productsModel.deleteAll()
}

export const productsService = {
  createNew,
  getAll,
  findById,
  updateById,
  deleteById,
  deleteAll
}
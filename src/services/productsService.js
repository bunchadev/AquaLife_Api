import { productsModel } from '~/models/productsModel.js'

const createNew = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await productsModel.createNew(data)
    return result
  } catch (error) { throw error }
}

const getAll = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    return await productsModel.getAll()
  } catch (error) { throw error }
}

const findById = async (id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    return await productsModel.findById(id)
  } catch (error) { throw error }
}

const findByCategory = async (categoryId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    return await productsModel.findByCategory(categoryId)
  } catch (error) { throw error }
}

const updateById = async (id, data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    await productsModel.updateById(id, data)
    return await productsModel.findById(id)
  } catch (error) { throw error }
}

const deleteById = async (id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    return await productsModel.deleteById(id)
  } catch (error) { throw error }
}

export const productsService = {
  createNew,
  getAll,
  findById,
  findByCategory,
  updateById,
  deleteById
}
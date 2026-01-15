import { productsModel } from '~/models/productsModel.js'

const createNew = async (data) => {
  try {
    const result = await productsModel.createNew(data)
    return result
  } catch (error) { throw error }
}

const getAll = async () => {
  try {
    return await productsModel.getAll()
  } catch (error) { throw error }
}

const findById = async (id) => {
  try {
    return await productsModel.findById(id)
  } catch (error) { throw error }
}

const findByType = async (type) => {
  try {
    return await productsModel.findByType(type)
  } catch (error) { throw error }
}

const findByCategory = async (categoryId) => {
  try {
    return await productsModel.findByCategory(categoryId)
  } catch (error) { throw error }
}

const updateById = async (id, data) => {
  try {
    await productsModel.updateById(id, data)
    return await productsModel.findById(id)
  } catch (error) { throw error }
}

const deleteById = async (id) => {
  try {
    return await productsModel.deleteById(id)
  } catch (error) { throw error }
}

export const productsService = {
  createNew,
  getAll,
  findById,
  findByType,
  findByCategory,
  updateById,
  deleteById
}
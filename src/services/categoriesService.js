import { categoriesModel } from '~/models/categoriesModel.js'

const createNew = async (data) => {
  try {
    const result = await categoriesModel.createNew(data)
    return result
  } catch (error) { throw error }
}

const getAll = async () => {
  try {
    return await categoriesModel.getAll()
  } catch (error) { throw error }
}

const findById = async (id) => {
  try {
    return await categoriesModel.findById(id)
  } catch (error) { throw error }
}

const updateById = async (id, data) => {
  try {
    await categoriesModel.updateById(id, data)
    return await categoriesModel.findById(id)
  } catch (error) { throw error }
}

const deleteById = async (id) => {
  try {
    return await categoriesModel.deleteById(id)
  } catch (error) { throw error }
}

export const categoriesService = {
  createNew,
  getAll,
  findById,
  updateById,
  deleteById
}

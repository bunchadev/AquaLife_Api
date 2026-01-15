import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const CATEGORIES_COLLECTION_NAME = 'categories'
const CATEGORIES_COLLECTION_SCHEMA = Joi.object({
  category_name: Joi.string().required(),
  category_type: Joi.string().valid('fish', 'aquarium', 'accessory', 'food', 'plant').required(),
  description: Joi.string().optional()
})

const validateBeforeCreate = async (data) => CATEGORIES_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const result = await GET_DB().collection(CATEGORIES_COLLECTION_NAME).insertOne(validData)
    return result
  } catch (error) { throw new Error(error) }
}

const getAll = async () => {
  try {
    return await GET_DB().collection(CATEGORIES_COLLECTION_NAME).find({}).toArray()
  } catch (error) { throw new Error(error) }
}

const findById = async (id) => {
  try {
    return await GET_DB().collection(CATEGORIES_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) { throw new Error(error) }
}

const updateById = async (id, data) => {
  try {
    const update = { $set: data }
    return await GET_DB().collection(CATEGORIES_COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, update)
  } catch (error) { throw new Error(error) }
}

const deleteById = async (id) => {
  try {
    return await GET_DB().collection(CATEGORIES_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
  } catch (error) { throw new Error(error) }
}

export const categoriesModel = {
  createNew,
  getAll,
  findById,
  updateById,
  deleteById
}

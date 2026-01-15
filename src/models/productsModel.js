import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const PRODUCTS_COLLECTION_NAME = 'products'
const PRODUCTS_COLLECTION_SCHEMA = Joi.object({
  product_name: Joi.string().required(),
  product_type: Joi.string().valid('fish', 'aquarium', 'accessory', 'food', 'plant').required(),
  category_id: Joi.string().optional(),
  price: Joi.number().min(0).required(),
  stock_quantity: Joi.number().min(0).default(0),
  description: Joi.string().optional(),
  image_url: Joi.string().optional(),
  status: Joi.string().valid('available', 'out_of_stock', 'discontinued').default('available'),
  created_at: Joi.date().default(() => new Date())
})

const validateBeforeCreate = async (data) => PRODUCTS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const result = await GET_DB().collection(PRODUCTS_COLLECTION_NAME).insertOne(validData)
    return result
  } catch (error) { throw new Error(error) }
}

const getAll = async () => {
  try {
    return await GET_DB().collection(PRODUCTS_COLLECTION_NAME).find({}).toArray()
  } catch (error) { throw new Error(error) }
}

const findById = async (id) => {
  try {
    return await GET_DB().collection(PRODUCTS_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) { throw new Error(error) }
}

const findByType = async (type) => {
  try {
    return await GET_DB().collection(PRODUCTS_COLLECTION_NAME).find({ product_type: type }).toArray()
  } catch (error) { throw new Error(error) }
}

const findByCategory = async (categoryId) => {
  try {
    return await GET_DB().collection(PRODUCTS_COLLECTION_NAME).find({ category_id: categoryId }).toArray()
  } catch (error) { throw new Error(error) }
}

const updateById = async (id, data) => {
  try {
    const update = { $set: data }
    return await GET_DB().collection(PRODUCTS_COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, update)
  } catch (error) { throw new Error(error) }
}

const deleteById = async (id) => {
  try {
    return await GET_DB().collection(PRODUCTS_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
  } catch (error) { throw new Error(error) }
}

export const productsModel = {
  createNew,
  getAll,
  findById,
  findByType,
  findByCategory,
  updateById,
  deleteById
}
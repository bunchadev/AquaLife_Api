import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validatiors'

const PRODUCTS_COLLECTION_NAME = 'products'
const PRODUCTS_COLLECTION_SCHEMA = Joi.object({
  categoryId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().min(0).default(0),
  description: Joi.string().optional(),
  imageUrl: Joi.string().optional(),
  status: Joi.string().valid('Còn hàng', 'Hết hàng').default('Còn hàng'),
  created_at: Joi.date().default(() => new Date())
})

const validateBeforeCreate = async (data) => PRODUCTS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newValidData = {
      ...validData,
      categoryId: new ObjectId(validData.categoryId)
    }
    const result = await GET_DB().collection(PRODUCTS_COLLECTION_NAME).insertOne(newValidData)
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

const findByCategory = async (categoryId) => {
  try {
    return await GET_DB().collection(PRODUCTS_COLLECTION_NAME).find({ categoryId: new ObjectId(categoryId) }).toArray()
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
  findByCategory,
  updateById,
  deleteById
}